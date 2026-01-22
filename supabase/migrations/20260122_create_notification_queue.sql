-- Create notification_queue table for storing pending push notifications
CREATE TABLE IF NOT EXISTS public.notification_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'general',
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_notification_queue_user_id
ON public.notification_queue(user_id);

CREATE INDEX IF NOT EXISTS idx_notification_queue_status
ON public.notification_queue(status);

CREATE INDEX IF NOT EXISTS idx_notification_queue_created_at
ON public.notification_queue(created_at);

-- Composite index for processing pending notifications
CREATE INDEX IF NOT EXISTS idx_notification_queue_pending
ON public.notification_queue(status, created_at)
WHERE status = 'pending';

-- Enable Row Level Security
ALTER TABLE public.notification_queue ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own notifications
CREATE POLICY "Users can view own notifications"
ON public.notification_queue
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Service role can do everything (for edge functions)
-- This is handled by service_role key, no explicit policy needed

-- Grant access
GRANT ALL ON public.notification_queue TO authenticated;
GRANT SELECT ON public.notification_queue TO anon;

-- Create function to trigger nemesis detection on score insert
CREATE OR REPLACE FUNCTION public.trigger_nemesis_detection()
RETURNS TRIGGER AS $$
BEGIN
    -- Call edge function via pg_net extension (if available)
    -- For now, we'll use a simpler approach with direct insertion check
    -- The edge function can also be called via webhook from Supabase dashboard

    -- Log the new score for debugging
    RAISE NOTICE 'New score inserted: game_id=%, score=%, nickname=%',
        NEW.game_id, NEW.score, NEW.nickname;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on scores table
DROP TRIGGER IF EXISTS on_score_insert_detect_nemesis ON public.scores;
CREATE TRIGGER on_score_insert_detect_nemesis
    AFTER INSERT ON public.scores
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_nemesis_detection();

-- Comment explaining the architecture
COMMENT ON TABLE public.notification_queue IS
'Queue for pending push notifications. Processed by send-push edge function.
Status values: pending, sent, failed, expired';
