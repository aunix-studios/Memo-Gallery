-- Fix function search_path mutable warning
-- Update the update_enhancement_usage_timestamp function to include search_path setting
CREATE OR REPLACE FUNCTION public.update_enhancement_usage_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;