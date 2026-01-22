-- Create push_subscriptions table for Web Push notifications
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id
ON public.push_subscriptions(user_id);

-- Create index on endpoint for faster upserts
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint
ON public.push_subscriptions(endpoint);

-- Enable Row Level Security
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own subscriptions
CREATE POLICY "Users can view own subscriptions"
ON public.push_subscriptions
FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Anyone can insert (for anonymous users)
CREATE POLICY "Anyone can insert subscriptions"
ON public.push_subscriptions
FOR INSERT
WITH CHECK (true);

-- Policy: Users can update their own subscriptions
CREATE POLICY "Users can update own subscriptions"
ON public.push_subscriptions
FOR UPDATE
USING (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Users can delete their own subscriptions
CREATE POLICY "Users can delete own subscriptions"
ON public.push_subscriptions
FOR DELETE
USING (auth.uid() = user_id OR user_id IS NULL);

-- Grant access to authenticated users
GRANT ALL ON public.push_subscriptions TO authenticated;
GRANT INSERT, SELECT, DELETE ON public.push_subscriptions TO anon;
