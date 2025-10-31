-- Fix RLS policy on enhancement_usage table
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can manage their own enhancement usage" ON public.enhancement_usage;

-- Create restrictive policies that only allow service role access
-- This prevents direct client manipulation while allowing edge function access
CREATE POLICY "Service role can manage all enhancement usage"
  ON public.enhancement_usage
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Prevent direct client access
CREATE POLICY "Authenticated users cannot access enhancement usage"
  ON public.enhancement_usage
  FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Anonymous users cannot access enhancement usage"
  ON public.enhancement_usage
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);