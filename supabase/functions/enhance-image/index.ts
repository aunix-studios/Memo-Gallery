import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DAILY_LIMIT = 20;
const MAX_IMAGE_SIZE = 25 * 1024 * 1024; // 25MB
const VALID_IMAGE_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

function validateBase64Image(base64String: string): { valid: boolean; error?: string; size?: number } {
  if (!base64String.startsWith('data:image/')) {
    return { valid: false, error: 'Invalid image format' };
  }

  const matches = base64String.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) {
    return { valid: false, error: 'Invalid base64 format' };
  }

  const mimeType = matches[1];
  if (!VALID_IMAGE_FORMATS.includes(mimeType)) {
    return { valid: false, error: `Unsupported image type: ${mimeType}` };
  }

  const base64Data = matches[2];
  const sizeInBytes = (base64Data.length * 3) / 4;
  
  if (sizeInBytes > MAX_IMAGE_SIZE) {
    return { valid: false, error: `Image too large: ${(sizeInBytes / 1024 / 1024).toFixed(2)}MB (max 25MB)` };
  }

  return { valid: true, size: sizeInBytes };
}

function validateDeviceId(deviceId: string): boolean {
  // Enforce expected format: device_<timestamp>_<random>
  return /^device_\d+_[a-z0-9]{9}$/.test(deviceId);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData, deviceId } = await req.json();

    // Validate required fields
    if (!imageData || !deviceId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate deviceId format
    if (!validateDeviceId(deviceId)) {
      console.error('Invalid deviceId format:', deviceId);
      return new Response(
        JSON.stringify({ error: 'Invalid device identifier' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate image data
    const imageValidation = validateBase64Image(imageData);
    if (!imageValidation.valid) {
      console.error('Image validation failed:', imageValidation.error);
      return new Response(
        JSON.stringify({ error: imageValidation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Image validated successfully:', {
      size: `${(imageValidation.size! / 1024 / 1024).toFixed(2)}MB`,
      deviceId
    });

    // Initialize Supabase client with service role key to bypass RLS
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check daily usage limit
    const today = new Date().toISOString().split('T')[0];
    const { data: usageData, error: usageError } = await supabase
      .from('enhancement_usage')
      .select('usage_count')
      .eq('device_id', deviceId)
      .eq('usage_date', today)
      .single();

    if (usageError && usageError.code !== 'PGRST116') {
      console.error('Usage check error:', usageError);
      return new Response(
        JSON.stringify({ error: 'Failed to check usage limit' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const currentUsage = usageData?.usage_count || 0;

    if (currentUsage >= DAILY_LIMIT) {
      return new Response(
        JSON.stringify({ 
          error: 'Daily limit reached',
          message: `You've reached your daily limit of ${DAILY_LIMIT} enhancements. Try again tomorrow!`,
          remainingEnhancements: 0
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Lovable AI to enhance the image
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Enhancing image with AI...');
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Enhance this image: improve colors, sharpen details, enhance lighting and contrast, remove noise, and make it look professional and high-quality. Maintain the original composition and subject.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'AI service rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service payment required. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, errorText);
      throw new Error('Failed to enhance image');
    }

    const aiData = await aiResponse.json();
    console.log('AI Response received');

    const enhancedImageUrl = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!enhancedImageUrl) {
      console.error('No enhanced image in response:', JSON.stringify(aiData));
      throw new Error('No enhanced image returned from AI');
    }

    // Update usage count
    if (usageData) {
      await supabase
        .from('enhancement_usage')
        .update({ usage_count: currentUsage + 1 })
        .eq('device_id', deviceId)
        .eq('usage_date', today);
    } else {
      await supabase
        .from('enhancement_usage')
        .insert({ device_id: deviceId, usage_count: 1, usage_date: today });
    }

    const remainingEnhancements = DAILY_LIMIT - (currentUsage + 1);

    return new Response(
      JSON.stringify({ 
        enhancedImage: enhancedImageUrl,
        remainingEnhancements,
        message: `Enhancement successful! ${remainingEnhancements} enhancements remaining today.`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Enhancement error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // Don't expose internal error details to client
    return new Response(
      JSON.stringify({ error: 'Failed to process enhancement request' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});