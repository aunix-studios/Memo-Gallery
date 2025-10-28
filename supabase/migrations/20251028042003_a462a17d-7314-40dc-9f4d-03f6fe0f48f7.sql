-- Create table to track daily enhancement usage
CREATE TABLE IF NOT EXISTS public.enhancement_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL,
  usage_count INTEGER NOT NULL DEFAULT 0,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(device_id, usage_date)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_enhancement_usage_device_date 
ON public.enhancement_usage(device_id, usage_date);

-- Enable RLS
ALTER TABLE public.enhancement_usage ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read and write their own usage
CREATE POLICY "Anyone can manage their own enhancement usage"
ON public.enhancement_usage
FOR ALL
USING (true)
WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_enhancement_usage_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update timestamp
CREATE TRIGGER update_enhancement_usage_updated_at
BEFORE UPDATE ON public.enhancement_usage
FOR EACH ROW
EXECUTE FUNCTION public.update_enhancement_usage_timestamp();