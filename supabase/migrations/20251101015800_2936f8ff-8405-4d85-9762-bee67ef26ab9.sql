-- Create atomic credit deduction function to prevent race conditions
CREATE OR REPLACE FUNCTION public.deduct_credits(
  p_user_id uuid,
  p_amount integer
)
RETURNS TABLE(success boolean, new_credits integer, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_credits integer;
  v_last_reset_date date;
BEGIN
  -- Lock the row for update to prevent concurrent modifications
  SELECT credits, last_reset_date INTO v_current_credits, v_last_reset_date
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- If no record exists, create one with initial credits
  IF NOT FOUND THEN
    INSERT INTO user_credits (user_id, credits, last_reset_date)
    VALUES (p_user_id, 100000, CURRENT_DATE);
    v_current_credits := 100000;
    v_last_reset_date := CURRENT_DATE;
  END IF;

  -- Check if daily reset is needed
  IF v_last_reset_date < CURRENT_DATE THEN
    UPDATE user_credits
    SET credits = 100000, 
        last_reset_date = CURRENT_DATE,
        updated_at = now()
    WHERE user_id = p_user_id;
    v_current_credits := 100000;
  END IF;

  -- Check if sufficient credits
  IF v_current_credits < p_amount THEN
    RETURN QUERY SELECT false, v_current_credits, 'Insufficient credits'::text;
    RETURN;
  END IF;

  -- Atomically deduct credits
  UPDATE user_credits
  SET credits = credits - p_amount,
      updated_at = now()
  WHERE user_id = p_user_id
  RETURNING credits, 'Credits deducted successfully'::text 
  INTO v_current_credits, message;

  RETURN QUERY SELECT true, v_current_credits, message;
END;
$$;

-- Add constraint to prevent negative credits
ALTER TABLE user_credits
DROP CONSTRAINT IF EXISTS credits_non_negative;

ALTER TABLE user_credits
ADD CONSTRAINT credits_non_negative 
CHECK (credits >= 0);