import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { PushSubscriptionInsert } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint, p256dh, auth, userId } = body as {
      endpoint: string;
      p256dh: string;
      auth: string;
      userId?: string;
    };

    if (!endpoint || !p256dh || !auth) {
      return NextResponse.json({ error: 'Missing required subscription fields' }, { status: 400 });
    }

    const supabase = await createClient();

    const subscriptionData: PushSubscriptionInsert = {
      endpoint,
      p256dh,
      auth,
      user_id: userId || null,
    };

    // Upsert subscription
    const { data, error } = await supabase
      .from('push_subscriptions')
      .upsert(subscriptionData as never, {
        onConflict: 'endpoint',
      })
      .select('id')
      .single();

    if (error) {
      console.error('[API Push] Subscribe error:', error);
      return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: (data as { id: string } | null)?.id });
  } catch (error) {
    console.error('[API Push] Subscribe error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    if (!endpoint) {
      return NextResponse.json({ error: 'Missing endpoint parameter' }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint);

    if (error) {
      console.error('[API Push] Unsubscribe error:', error);
      return NextResponse.json({ error: 'Failed to remove subscription' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API Push] Unsubscribe error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
