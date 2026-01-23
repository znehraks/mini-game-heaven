import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { PushSubscriptionInsert } from '@/types/database';

interface ResubscribeBody {
  oldEndpoint?: string;
  newSubscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
}

/**
 * Handle push subscription renewal/change from service worker
 * Called when the browser automatically renews or changes a subscription
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ResubscribeBody;
    const { oldEndpoint, newSubscription } = body;

    if (!newSubscription?.endpoint || !newSubscription?.keys) {
      return NextResponse.json({ error: 'Invalid new subscription data' }, { status: 400 });
    }

    const supabase = await createClient();

    // Start transaction-like operation
    let userId: string | null = null;

    // If we have the old endpoint, get the user_id from it
    if (oldEndpoint) {
      const { data: oldSub } = await supabase
        .from('push_subscriptions')
        .select('user_id')
        .eq('endpoint', oldEndpoint)
        .single();

      userId = (oldSub as { user_id: string | null } | null)?.user_id || null;

      // Delete old subscription
      await supabase.from('push_subscriptions').delete().eq('endpoint', oldEndpoint);
    }

    const subscriptionData: PushSubscriptionInsert = {
      endpoint: newSubscription.endpoint,
      p256dh: newSubscription.keys.p256dh,
      auth: newSubscription.keys.auth,
      user_id: userId,
    };

    // Insert new subscription
    const { data, error } = await supabase
      .from('push_subscriptions')
      .upsert(subscriptionData as never, {
        onConflict: 'endpoint',
      })
      .select('id')
      .single();

    if (error) {
      console.error('[API Push] Resubscribe error:', error);
      return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
    }

    const resultId = (data as { id: string } | null)?.id;
    console.log('[API Push] Subscription renewed:', resultId);

    return NextResponse.json({ success: true, id: resultId });
  } catch (error) {
    console.error('[API Push] Resubscribe error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
