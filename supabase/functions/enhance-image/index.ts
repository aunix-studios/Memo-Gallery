import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DAILY_LIMIT = 20;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData, deviceId } = await req.json();

    if (!imageData || !deviceId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? ''
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
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});