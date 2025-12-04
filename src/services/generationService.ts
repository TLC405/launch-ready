import { supabase } from '@/integrations/supabase/client';
import { decadePrompts } from '@/lib/decadePrompts';
import trackingService from './trackingService';

export interface GenerationResult {
  era: string;
  imageUrl: string | null;
  success: boolean;
  error?: string;
  generationTimeMs?: number;
}

// In-memory cache for generated images
const imageCache = new Map<string, string>();

function getCacheKey(era: string, sourceImageHash: string): string {
  return `${era}:${sourceImageHash}`;
}

// Simple hash for source image
async function hashImage(base64: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(base64.slice(0, 1000)); // Hash first 1000 chars for speed
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}

export const generationService = {
  // Generate a single portrait
  async generatePortrait(
    era: string,
    sourceImageBase64: string,
    userId?: string
  ): Promise<GenerationResult> {
    const startTime = Date.now();
    
    try {
      // Check cache first
      const imageHash = await hashImage(sourceImageBase64);
      const cacheKey = getCacheKey(era, imageHash);
      
      if (imageCache.has(cacheKey)) {
        return {
          era,
          imageUrl: imageCache.get(cacheKey)!,
          success: true,
          generationTimeMs: 0
        };
      }

      const prompt = decadePrompts[era];
      if (!prompt) {
        throw new Error(`Unknown era: ${era}`);
      }

      const { data, error } = await supabase.functions.invoke('generate-portrait', {
        body: {
          era,
          sourceImageBase64,
          prompt
        }
      });

      const generationTimeMs = Date.now() - startTime;

      if (error) {
        // Track failed generation
        await trackingService.trackGeneration(era, false, generationTimeMs, error.message, userId);
        throw error;
      }

      if (!data.success || !data.imageUrl) {
        const errorMsg = data.error || 'Generation failed';
        await trackingService.trackGeneration(era, false, generationTimeMs, errorMsg, userId);
        throw new Error(errorMsg);
      }

      // Cache the result
      imageCache.set(cacheKey, data.imageUrl);

      // Track successful generation
      await trackingService.trackGeneration(era, true, generationTimeMs, undefined, userId);

      // Store in database if user is logged in
      if (userId) {
        await supabase.from('generated_portraits').insert({
          user_id: userId,
          era,
          image_url: data.imageUrl,
          prompt_hash: imageHash
        });
      }

      return {
        era,
        imageUrl: data.imageUrl,
        success: true,
        generationTimeMs
      };

    } catch (err) {
      const generationTimeMs = Date.now() - startTime;
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      return {
        era,
        imageUrl: null,
        success: false,
        error: errorMessage,
        generationTimeMs
      };
    }
  },

  // Generate multiple portraits concurrently (Blitz All)
  async generateAll(
    eras: string[],
    sourceImageBase64: string,
    onProgress: (completed: number, total: number, result: GenerationResult) => void,
    userId?: string
  ): Promise<GenerationResult[]> {
    const total = eras.length;
    let completed = 0;

    const results = await Promise.allSettled(
      eras.map(async (era) => {
        const result = await this.generatePortrait(era, sourceImageBase64, userId);
        completed++;
        onProgress(completed, total, result);
        return result;
      })
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      }
      return {
        era: eras[index],
        imageUrl: null,
        success: false,
        error: result.reason?.message || 'Generation failed'
      };
    });
  },

  // Clear the cache
  clearCache() {
    imageCache.clear();
  },

  // Get cached image
  getCachedImage(era: string, sourceImageBase64: string): string | null {
    // This is a simplified check - would need proper hash in production
    for (const [key, value] of imageCache.entries()) {
      if (key.startsWith(era + ':')) {
        return value;
      }
    }
    return null;
  }
};

export default generationService;
