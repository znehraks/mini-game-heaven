// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { createClient } from 'jsr:@supabase/supabase-js@2';

interface ScorePayload {
  type: 'INSERT';
  table: 'scores';
  record: {
    id: string;
    user_id: string | null;
    game_id: string;
    nickname: string;
    score: number;
    created_at: string;
  };
  old_record: null;
}

interface NemesisResult {
  dethroned_user_id: string | null;
  dethroned_nickname: string;
  old_score: number;
  new_score: number;
  game_id: string;
  challenger_nickname: string;
}

Deno.serve(async (req) => {
  try {
    // Parse the webhook payload
    const payload: ScorePayload = await req.json();

    // Only handle INSERT events on scores table
    if (payload.type !== 'INSERT' || payload.table !== 'scores') {
      return new Response(JSON.stringify({ message: 'Ignored: not a score insert' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newScore = payload.record;

    // Create Supabase client with service role for full access
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find users whose high scores have been beaten
    // We look for the previous top score for this game that is now lower than the new score
    const { data: dethronedScores, error: queryError } = await supabase
      .from('scores')
      .select('user_id, nickname, score')
      .eq('game_id', newScore.game_id)
      .lt('score', newScore.score)
      .order('score', { ascending: false })
      .limit(10); // Get top 10 scores that were beaten

    if (queryError) {
      console.error('Error querying dethroned scores:', queryError);
      throw queryError;
    }

    if (!dethronedScores || dethronedScores.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No users were dethroned', dethroned: 0 }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Filter to unique users who were in the top and now beaten
    // We only notify users who had a score that was previously in a higher position
    const seenUsers = new Set<string>();
    const nemesisNotifications: NemesisResult[] = [];

    for (const dethroned of dethronedScores) {
      // Skip if same user as the new score
      if (dethroned.user_id === newScore.user_id) continue;
      if (dethroned.nickname === newScore.nickname) continue;

      // Skip if we already processed this user
      const userKey = dethroned.user_id || dethroned.nickname;
      if (seenUsers.has(userKey)) continue;
      seenUsers.add(userKey);

      // Only notify if the dethroned user has a user_id (can receive push)
      // or if we want to track for future notification
      nemesisNotifications.push({
        dethroned_user_id: dethroned.user_id,
        dethroned_nickname: dethroned.nickname,
        old_score: dethroned.score,
        new_score: newScore.score,
        game_id: newScore.game_id,
        challenger_nickname: newScore.nickname,
      });
    }

    if (nemesisNotifications.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No nemesis notifications needed', dethroned: 0 }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Queue notifications for users with user_id (they can receive push)
    const notificationsToQueue = nemesisNotifications
      .filter((n) => n.dethroned_user_id !== null)
      .map((n) => ({
        user_id: n.dethroned_user_id,
        type: 'nemesis',
        title: 'Your throne is under attack!',
        body: `${n.challenger_nickname} just beat your score of ${n.old_score} with ${n.new_score}!`,
        data: {
          game_id: n.game_id,
          challenger: n.challenger_nickname,
          old_score: n.old_score,
          new_score: n.new_score,
        },
        status: 'pending',
      }));

    if (notificationsToQueue.length > 0) {
      const { error: insertError } = await supabase
        .from('notification_queue')
        .insert(notificationsToQueue);

      if (insertError) {
        console.error('Error queuing notifications:', insertError);
        // Don't throw - we still want to return success for the score
      }
    }

    console.log(`Nemesis detection complete: ${nemesisNotifications.length} users dethroned`);

    return new Response(
      JSON.stringify({
        message: 'Nemesis detection complete',
        dethroned: nemesisNotifications.length,
        queued: notificationsToQueue.length,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Nemesis detection error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: String(error) }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});
