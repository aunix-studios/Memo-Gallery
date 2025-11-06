import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_IMAGE_SIZE = 25 * 1024 * 1024; // 25MB
const VALID_IMAGE_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

function validateBase64Image(base64String: string): { valid: boolean; error?: string } {
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

  return { valid: true };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData, prompt } = await req.json();

    // Validate required fields
    if (!imageData || !prompt) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate prompt
    if (typeof prompt !== 'string' || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Valid prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (prompt.length > 500) {
      return new Response(
        JSON.stringify({ error: 'Prompt must be less than 500 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate image data
    const imageValidation = validateBase64Image(imageData);
    if (!imageValidation.valid) {
      return new Response(
        JSON.stringify({ error: imageValidation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Deduct credits
    const { data: creditResult, error: creditError } = await supabase
      .rpc('deduct_credits', {
        p_user_id: user.id,
        p_amount: 10
      })
      .single();

    if (creditError) {
      console.error('Credit deduction error:', creditError);
      return new Response(
        JSON.stringify({ error: 'Failed to process credits' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = creditResult as { success: boolean; new_credits: number; message: string };

    if (!result.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Insufficient credits',
          credits: result.new_credits,
          message: 'You need at least 10 credits to edit an image.'
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const currentCredits = result.new_credits;

    // Edit image using Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Editing image with AI...');
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
            role: 'system',
            content: 'You are an image editing AI. Apply the user\'s requested edits while maintaining image quality and coherence. Only make safe, appropriate edits.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Edit this image: ${prompt}`
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
      
      // Refund credits on failure
      await supabase
        .rpc('deduct_credits', { p_user_id: user.id, p_amount: -10 });
      
      throw new Error('Failed to edit image');
    }

    const aiData = await aiResponse.json();
    const editedImageUrl = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!editedImageUrl) {
      console.error('No edited image in response');
      
      // Refund credits on failure
      await supabase
        .rpc('deduct_credits', { p_user_id: user.id, p_amount: -10 });
      
      throw new Error('No edited image returned from AI');
    }

    // Save edit record
    await supabase
      .from('ai_generations')
      .insert({
        user_id: user.id,
        prompt: prompt,
        image_url: editedImageUrl,
        credits_used: 10
      });

    console.log('Image edited successfully for user:', user.id);

    return new Response(
      JSON.stringify({ 
        editedImage: editedImageUrl,
        credits: currentCredits,
        message: `Image edited successfully! ${currentCredits} credits remaining.`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Edit error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process edit request' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});