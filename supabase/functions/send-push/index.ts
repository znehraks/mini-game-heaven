// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { createClient } from 'jsr:@supabase/supabase-js@2';

interface PushSubscription {
  id: string;
  user_id: string | null;
  endpoint: string;
  p256dh: string;
  auth: string;
}

interface NotificationQueueItem {
  id: string;
  user_id: string | null;
  type: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
  status: string;
  created_at: string;
}

interface WebPushResult {
  success: boolean;
  error?: string;
}

/**
 * Generate VAPID headers for Web Push
 * Using crypto APIs available in Deno
 */
async function generateVapidHeaders(
  endpoint: string,
  vapidPublicKey: string,
  vapidPrivateKey: string,
  subject: string
): Promise<{ Authorization: string; 'Crypto-Key': string }> {
  // Parse the endpoint to get the audience
  const endpointUrl = new URL(endpoint);
  const audience = `${endpointUrl.protocol}//${endpointUrl.host}`;

  // Create JWT header
  const header = { typ: 'JWT', alg: 'ES256' };

  // Create JWT payload (valid for 12 hours)
  const payload = {
    aud: audience,
    exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
    sub: subject,
  };

  // Base64URL encode
  const base64UrlEncode = (data: Uint8Array | string): string => {
    const base64 =
      typeof data === 'string'
        ? btoa(data)
        : btoa(String.fromCharCode(...data));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  const headerEncoded = base64UrlEncode(JSON.stringify(header));
  const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${headerEncoded}.${payloadEncoded}`;

  // Import the private key and sign
  const privateKeyBytes = base64UrlDecode(vapidPrivateKey);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    privateKeyBytes,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    cryptoKey,
    new TextEncoder().encode(unsignedToken)
  );

  // Convert signature from DER to raw format (r || s)
  const signatureBytes = new Uint8Array(signature);
  const signatureEncoded = base64UrlEncode(signatureBytes);

  const jwt = `${unsignedToken}.${signatureEncoded}`;

  return {
    Authorization: `vapid t=${jwt}, k=${vapidPublicKey}`,
    'Crypto-Key': `p256ecdsa=${vapidPublicKey}`,
  };
}

/**
 * Base64URL decode helper
 */
function base64UrlDecode(input: string): Uint8Array {
  // Add padding if needed
  let padded = input.replace(/-/g, '+').replace(/_/g, '/');
  while (padded.length % 4) {
    padded += '=';
  }

  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Encrypt the payload for Web Push
 */
async function encryptPayload(
  payload: string,
  p256dh: string,
  auth: string
): Promise<{ encrypted: Uint8Array; salt: Uint8Array; serverPublicKey: Uint8Array }> {
  // Generate ephemeral ECDH key pair
  const serverKeyPair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveBits']
  );

  // Import client's public key
  const clientPublicKeyBytes = base64UrlDecode(p256dh);
  const clientPublicKey = await crypto.subtle.importKey(
    'raw',
    clientPublicKeyBytes,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    []
  );

  // Derive shared secret
  const sharedSecret = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: clientPublicKey },
    serverKeyPair.privateKey,
    256
  );

  // Get server public key bytes
  const serverPublicKeyBytes = await crypto.subtle.exportKey('raw', serverKeyPair.publicKey);

  // Generate salt
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // Derive encryption keys using HKDF
  const authBytes = base64UrlDecode(auth);

  // Create PRK (pseudo-random key)
  const prkInfo = new TextEncoder().encode('Content-Encoding: auth\0');
  const prkKey = await crypto.subtle.importKey(
    'raw',
    authBytes,
    { name: 'HKDF' },
    false,
    ['deriveBits']
  );

  // Import shared secret for HKDF
  const sharedSecretKey = await crypto.subtle.importKey(
    'raw',
    new Uint8Array(sharedSecret),
    { name: 'HKDF' },
    false,
    ['deriveBits']
  );

  // Derive content encryption key
  const cekInfo = concat(
    new TextEncoder().encode('Content-Encoding: aes128gcm\0'),
    new Uint8Array(1),
    clientPublicKeyBytes,
    new Uint8Array(serverPublicKeyBytes)
  );

  const cekBits = await crypto.subtle.deriveBits(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: salt,
      info: cekInfo,
    },
    sharedSecretKey,
    128
  );

  // Derive nonce
  const nonceInfo = concat(
    new TextEncoder().encode('Content-Encoding: nonce\0'),
    new Uint8Array(1),
    clientPublicKeyBytes,
    new Uint8Array(serverPublicKeyBytes)
  );

  const nonceBits = await crypto.subtle.deriveBits(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: salt,
      info: nonceInfo,
    },
    sharedSecretKey,
    96
  );

  // Import CEK for AES-GCM
  const cek = await crypto.subtle.importKey(
    'raw',
    new Uint8Array(cekBits),
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  // Pad and encrypt payload
  const payloadBytes = new TextEncoder().encode(payload);
  const paddedPayload = concat(payloadBytes, new Uint8Array([2]), new Uint8Array(0));

  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(nonceBits),
    },
    cek,
    paddedPayload
  );

  // Build the final encrypted message (aes128gcm format)
  const recordSize = 4096;
  const header = concat(
    salt,
    new Uint8Array([0, 0, 16, 1]), // record size (4096) as 4 bytes + key id length (1)
    new Uint8Array([65]), // key length (65 bytes for uncompressed P-256)
    new Uint8Array(serverPublicKeyBytes)
  );

  return {
    encrypted: concat(header, new Uint8Array(encrypted)),
    salt,
    serverPublicKey: new Uint8Array(serverPublicKeyBytes),
  };
}

/**
 * Helper to concatenate Uint8Arrays
 */
function concat(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

/**
 * Send a Web Push notification
 */
async function sendWebPush(
  subscription: PushSubscription,
  notification: { title: string; body: string; data?: Record<string, unknown> },
  vapidPublicKey: string,
  vapidPrivateKey: string,
  vapidSubject: string
): Promise<WebPushResult> {
  try {
    const payload = JSON.stringify({
      title: notification.title,
      body: notification.body,
      data: notification.data || {},
      timestamp: Date.now(),
    });

    // Encrypt the payload
    const { encrypted } = await encryptPayload(
      payload,
      subscription.p256dh,
      subscription.auth
    );

    // Generate VAPID headers
    const vapidHeaders = await generateVapidHeaders(
      subscription.endpoint,
      vapidPublicKey,
      vapidPrivateKey,
      vapidSubject
    );

    // Send the request
    const response = await fetch(subscription.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Encoding': 'aes128gcm',
        'Content-Length': String(encrypted.length),
        TTL: '86400', // 24 hours
        Urgency: 'normal',
        ...vapidHeaders,
      },
      body: encrypted,
    });

    if (response.ok || response.status === 201) {
      return { success: true };
    }

    // Handle specific error codes
    if (response.status === 404 || response.status === 410) {
      // Subscription expired or invalid
      return { success: false, error: 'subscription_expired' };
    }

    const errorText = await response.text();
    return { success: false, error: `HTTP ${response.status}: ${errorText}` };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

Deno.serve(async (req) => {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get VAPID keys from environment
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY');
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');
    const vapidSubject = Deno.env.get('VAPID_SUBJECT') || 'mailto:admin@minigameheaven.app';

    if (!vapidPublicKey || !vapidPrivateKey) {
      console.error('VAPID keys not configured');
      return new Response(
        JSON.stringify({ error: 'VAPID keys not configured' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body for options
    const body = await req.json().catch(() => ({}));
    const limit = body.limit || 100;
    const notificationId = body.notification_id; // Process specific notification

    // Build query
    let query = supabase
      .from('notification_queue')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(limit);

    if (notificationId) {
      query = supabase
        .from('notification_queue')
        .select('*')
        .eq('id', notificationId)
        .single();
    }

    const { data: notifications, error: queryError } = await query;

    if (queryError) {
      console.error('Error querying notifications:', queryError);
      throw queryError;
    }

    const notificationList = notificationId
      ? [notifications as NotificationQueueItem]
      : (notifications as NotificationQueueItem[]);

    if (!notificationList || notificationList.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No pending notifications', processed: 0 }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const results = {
      processed: 0,
      sent: 0,
      failed: 0,
      expired_subscriptions: 0,
    };

    // Process each notification
    for (const notification of notificationList) {
      results.processed++;

      // Get push subscriptions for this user
      let subscriptions: PushSubscription[] = [];

      if (notification.user_id) {
        const { data: userSubs, error: subError } = await supabase
          .from('push_subscriptions')
          .select('*')
          .eq('user_id', notification.user_id);

        if (subError) {
          console.error('Error getting subscriptions:', subError);
          await updateNotificationStatus(supabase, notification.id, 'failed', subError.message);
          results.failed++;
          continue;
        }

        subscriptions = userSubs || [];
      }

      if (subscriptions.length === 0) {
        console.log(`No subscriptions for user ${notification.user_id}`);
        await updateNotificationStatus(
          supabase,
          notification.id,
          'failed',
          'No push subscriptions found'
        );
        results.failed++;
        continue;
      }

      // Send to all subscriptions for this user
      let anySent = false;
      const failedEndpoints: string[] = [];

      for (const subscription of subscriptions) {
        const result = await sendWebPush(
          subscription,
          {
            title: notification.title,
            body: notification.body,
            data: notification.data,
          },
          vapidPublicKey,
          vapidPrivateKey,
          vapidSubject
        );

        if (result.success) {
          anySent = true;
        } else if (result.error === 'subscription_expired') {
          // Remove expired subscription
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('id', subscription.id);
          results.expired_subscriptions++;
          failedEndpoints.push('expired');
        } else {
          console.error(`Push failed for ${subscription.endpoint}:`, result.error);
          failedEndpoints.push(result.error || 'unknown');
        }
      }

      // Update notification status
      if (anySent) {
        await updateNotificationStatus(supabase, notification.id, 'sent');
        results.sent++;
      } else {
        await updateNotificationStatus(
          supabase,
          notification.id,
          'failed',
          `All subscriptions failed: ${failedEndpoints.join(', ')}`
        );
        results.failed++;
      }
    }

    console.log(`Push processing complete:`, results);

    return new Response(
      JSON.stringify({
        message: 'Push processing complete',
        ...results,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Send push error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: String(error) }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});

/**
 * Update notification status in the queue
 */
async function updateNotificationStatus(
  supabase: ReturnType<typeof createClient>,
  notificationId: string,
  status: 'sent' | 'failed' | 'expired',
  errorMessage?: string
) {
  const updateData: Record<string, unknown> = {
    status,
    processed_at: new Date().toISOString(),
  };

  if (errorMessage) {
    updateData.error_message = errorMessage;
  }

  await supabase
    .from('notification_queue')
    .update(updateData)
    .eq('id', notificationId);
}
