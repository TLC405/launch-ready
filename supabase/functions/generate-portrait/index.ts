import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Allowed eras - strict validation (must match frontend exactly)
const ALLOWED_ERAS = ['1865', '1900s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', 'Homeless', 'Day One'];

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 50; // 50 requests per hour per IP

// Hash IP for privacy
async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + "tlc-salt");
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    // ═══════════════════════════════════════════════════════════════
    // SECURITY: Rate Limiting
    // ═══════════════════════════════════════════════════════════════
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const ipHash = await hashIP(clientIP);
    
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
    
    // Check rate limit
    const { data: rateLimitData, error: rateLimitError } = await supabaseAdmin
      .from('rate_limits')
      .select('request_count')
      .eq('ip_hash', ipHash)
      .eq('endpoint', 'generate-portrait')
      .gte('window_start', windowStart)
      .single();

    if (!rateLimitError && rateLimitData && rateLimitData.request_count >= MAX_REQUESTS_PER_WINDOW) {
      console.warn(`⚠️ Rate limit exceeded for IP hash: ${ipHash}`);
      return new Response(JSON.stringify({ 
        error: "Rate limit exceeded. Time machine overheated - try again later.",
        code: "RATE_LIMIT_EXCEEDED",
        success: false
      }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update or insert rate limit record
    if (rateLimitData) {
      await supabaseAdmin
        .from('rate_limits')
        .update({ request_count: rateLimitData.request_count + 1 })
        .eq('ip_hash', ipHash)
        .eq('endpoint', 'generate-portrait')
        .gte('window_start', windowStart);
    } else {
      await supabaseAdmin
        .from('rate_limits')
        .insert({ 
          ip_hash: ipHash, 
          endpoint: 'generate-portrait', 
          request_count: 1,
          window_start: new Date().toISOString()
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // Parse and Validate Request
    // ═══════════════════════════════════════════════════════════════
    const { era, sourceImageBase64, prompt } = await req.json();

    // Validate era
    if (!era || !ALLOWED_ERAS.includes(era)) {
      console.error(`❌ Invalid era: ${era}`);
      return new Response(JSON.stringify({ 
        error: "Invalid era selected",
        code: "INVALID_ERA",
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate prompt length
    if (prompt && prompt.length > 15000) {
      console.error(`❌ Prompt too long: ${prompt.length} chars`);
      return new Response(JSON.stringify({ 
        error: "Prompt too long (max 15000 characters)",
        code: "PROMPT_TOO_LONG",
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate image size (max 10MB)
    if (sourceImageBase64) {
      const base64Data = sourceImageBase64.replace(/^data:image\/\w+;base64,/, '');
      const sizeInBytes = (base64Data.length * 3) / 4;
      if (sizeInBytes > 10 * 1024 * 1024) {
        console.error(`❌ Image too large: ${(sizeInBytes / 1024 / 1024).toFixed(2)}MB`);
        return new Response(JSON.stringify({ 
          error: "Image too large (max 10MB)",
          code: "IMAGE_TOO_LARGE",
          success: false
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ═══════════════════════════════════════════════════════════════
    // API Key Check
    // ═══════════════════════════════════════════════════════════════
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`🎬 TLC STUDIOS REWIND - Generating ${era} portrait`);
    console.log(`📝 Prompt length: ${prompt?.length || 0} characters`);
    console.log(`🔒 IP hash: ${ipHash}`);
    const startTime = Date.now();

    // Build the ENHANCED prompt with ULTRA face lock instructions
    const enhancedPrompt = `${prompt}

═══════════════════════════════════════════════════════════════════════
▓▓▓ FINAL RENDERING - ULTRA FACE LOCK PROTOCOL ▓▓▓
═══════════════════════════════════════════════════════════════════════

▓▓▓ MANDATORY PHOTOREALISM ▓▓▓
• Output MUST be a REAL PHOTOGRAPH - indistinguishable from authentic archival footage
• NOT cartoon, NOT illustration, NOT painting, NOT CGI, NOT "AI-looking"
• Real skin with pores, imperfections, natural asymmetry
• Real eyes with moisture, reflections, tear ducts
• Real lighting physics with motivated sources
• Real film grain specific to the era's camera equipment

▓▓▓ ULTRA FACE LOCK - FACE ONLY, NO HAIR/BEARD TRANSFER ▓▓▓
CRITICAL - EXTRACT ONLY THE FACE FROM SOURCE:

STEP 1 - STRIP EVERYTHING EXCEPT FACE:
• REMOVE any hats, caps, beanies from source - DO NOT TRANSFER
• REMOVE any glasses, sunglasses from source - DO NOT TRANSFER  
• REMOVE user's hair from source - DO NOT COPY IT
• REMOVE user's beard/facial hair from source - DO NOT COPY IT
• Only use the NAKED FACE geometry from reference

STEP 2 - STYLE HAIR/BEARD FOR THE ERA (NOT FROM SOURCE):
• Give user ERA-APPROPRIATE hair styled for the decade
• Give user ERA-APPROPRIATE facial hair (or clean shaven) for the scene
• If source has long hair → IGNORE IT, use era hair
• If source has beard → IGNORE IT, use era beard or clean shave
• The source photo is ONLY for facial structure reference

STEP 3 - PRESERVE EXACT FACIAL GEOMETRY:
• NOSE: EXACT same width, bridge, nostrils, tip - DO NOT ENLARGE
• EYES: Same shape, spacing, size, color, eyelids
• MOUTH: Same lip shape, width, proportions  
• JAWLINE: Same jaw shape, chin, face width
• CHEEKBONES: Same placement, prominence
• They must be IMMEDIATELY RECOGNIZABLE as the same person

STEP 4 - NATURAL COMPOSITION:
• Celebrities at REALISTIC distances (5-15 feet apart)
• NO ONE overlapping or "stacked" on top of each other
• Natural depth and breathing room in the scene

▓▓▓ CELEBRITY ACCURACY ▓▓▓
• Every celebrity is their REAL SELF from actual photos
• NOT caricatures, NOT beautified, NOT stylized

OUTPUT: Museum-quality photorealistic photograph.`;

    // Build the message content with image
    const messageContent: any[] = [
      {
        type: "text",
        text: enhancedPrompt
      }
    ];

    // Add source image if provided - this is CRITICAL for face lock
    if (sourceImageBase64) {
      messageContent.push({
        type: "image_url",
        image_url: {
          url: sourceImageBase64.startsWith('data:') 
            ? sourceImageBase64 
            : `data:image/jpeg;base64,${sourceImageBase64}`
        }
      });
      console.log(`📸 Source image attached for face lock`);
    } else {
      console.log(`⚠️ No source image provided - face lock not possible`);
    }

    // Use the recommended image generation model
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: messageContent
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("⚠️ AI gateway rate limit exceeded");
        return new Response(JSON.stringify({ 
          error: "AI rate limit exceeded. The time machine needs to cool down.",
          code: "AI_RATE_LIMIT",
          success: false
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        console.error("⚠️ Payment required");
        return new Response(JSON.stringify({ 
          error: "AI credits exhausted. The time machine needs more fuel.",
          code: "PAYMENT_REQUIRED",
          success: false
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("❌ AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const generationTimeMs = Date.now() - startTime;

    console.log(`✅ Portrait generated in ${generationTimeMs}ms for era: ${era}`);

    if (!generatedImageUrl) {
      console.error("❌ No image in response:", JSON.stringify(data, null, 2));
      throw new Error("No image generated from AI - temporal anomaly occurred");
    }

    return new Response(JSON.stringify({ 
      imageUrl: generatedImageUrl,
      era,
      generationTimeMs,
      success: true,
      model: "gemini-2.5-flash-image-preview"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Error in generate-portrait:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown temporal anomaly occurred",
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
