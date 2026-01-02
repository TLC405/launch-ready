-- Rate limit tracking table for abuse prevention
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX idx_rate_limits_lookup ON public.rate_limits(ip_hash, endpoint, window_start);

-- Enable RLS - only service role can access (edge functions bypass RLS)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- No policies = no public access, service role bypasses RLS for edge functions