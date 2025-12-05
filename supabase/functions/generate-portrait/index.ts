import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { era, sourceImageBase64, prompt } = await req.json();

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`🎬 TLC STUDIOS REWIND - Generating ${era} portrait`);
    console.log(`📝 Prompt length: ${prompt?.length || 0} characters`);
    const startTime = Date.now();

    // Build the ENHANCED prompt with explicit photorealism instructions
    const enhancedPrompt = `${prompt}

═══════════════════════════════════════════════════════════════════════
▓▓▓ FINAL RENDERING INSTRUCTIONS - ABSOLUTE REQUIREMENTS ▓▓▓
═══════════════════════════════════════════════════════════════════════

▓▓▓ MANDATORY PHOTOREALISM ▓▓▓
This is NOT optional - the output MUST be:
• A REAL PHOTOGRAPH - indistinguishable from authentic archival footage
• NOT cartoon, NOT illustration, NOT painting, NOT CGI, NOT artistic
• NOT "AI-looking" - if it looks AI-generated, it has FAILED
• Real skin with pores, imperfections, natural asymmetry
• Real eyes with moisture, reflections, tear ducts
• Real lighting physics with motivated sources
• Real fabric textures, real metal surfaces, real environmental details
• Real film grain specific to the era's camera equipment

▓▓▓ FACE TRANSPLANT PROTOCOL ▓▓▓
The user's face from the reference image MUST be:
• TRANSPLANTED onto the scene as if they were actually photographed there
• SAME bone structure - no changes to skull shape
• SAME eye shape, spacing, color - pixel-perfect
• SAME nose - exact shape, nostrils, bridge
• SAME mouth and lips - exact proportions
• SAME jawline and chin - no modifications
• SAME skin tone - only adjust for era lighting
• The face must BLEND seamlessly - not look "pasted on"
• They must look like the SAME PERSON in a real period photograph

▓▓▓ CELEBRITY ACCURACY ▓▓▓
• Every celebrity is their REAL SELF - reference actual photos
• NOT caricatures, NOT beautified, NOT stylized
• Correct age/era, correct outfit, correct hair
• They surround the USER who is the undisputed STAR

OUTPUT: A museum-quality photorealistic photograph ready for auction.`;

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

    // Use the best available image generation model
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview", // Upgraded to next-gen model
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
        console.error("⚠️ Rate limit exceeded");
        return new Response(JSON.stringify({ 
          error: "Rate limit exceeded. The time machine needs to cool down. Try again in a moment.",
          code: "RATE_LIMIT",
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
      throw new Error("No image generated from AI - the time machine encountered a temporal anomaly");
    }

    return new Response(JSON.stringify({ 
      imageUrl: generatedImageUrl,
      era,
      generationTimeMs,
      success: true,
      model: "gemini-3-pro-image-preview"
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
