import { supabase } from '@/integrations/supabase/client';
import { decadePrompts } from '@/lib/decadePrompts';
import trackingService from './trackingService';

export interface GenerationResult {
  era: string;
  imageUrl: string | null;
  success: boolean;
  error?: string;
  generationTimeMs?: number;
  retryCount?: number;
}

// In-memory cache for generated images
const imageCache = new Map<string, string>();

function getCacheKey(era: string, sourceImageHash: string): string {
  return `${era}:${sourceImageHash}`;
}

// Simple hash for source image
async function hashImage(base64: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(base64.slice(0, 1000));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}

// Delay helper with exponential backoff
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Parse error for user-friendly message
function parseError(error: unknown): { message: string; isRetryable: boolean; isRateLimit: boolean } {
  const msg = error instanceof Error ? error.message : String(error);
  
  if (msg.includes('429') || msg.includes('rate limit')) {
    return { message: 'Rate limited - please wait a moment', isRetryable: true, isRateLimit: true };
  }
  if (msg.includes('402') || msg.includes('payment')) {
    return { message: 'AI credits depleted - please add funds', isRetryable: false, isRateLimit: false };
  }
  if (msg.includes('timeout') || msg.includes('network')) {
    return { message: 'Network error - retrying...', isRetryable: true, isRateLimit: false };
  }
  return { message: msg, isRetryable: false, isRateLimit: false };
}

export const generationService = {
  // Generate a single portrait with retry logic
  async generatePortrait(
    era: string,
    sourceImageBase64: string,
    userId?: string,
    maxRetries: number = 2
  ): Promise<GenerationResult> {
    const startTime = Date.now();
    let lastError: string = '';
    let retryCount = 0;

    // Check cache first
    try {
      const imageHash = await hashImage(sourceImageBase64);
      const cacheKey = getCacheKey(era, imageHash);
      
      if (imageCache.has(cacheKey)) {
        return {
          era,
          imageUrl: imageCache.get(cacheKey)!,
          success: true,
          generationTimeMs: 0,
          retryCount: 0
        };
      }
    } catch {
      // Continue without cache on hash error
    }

    const prompt = decadePrompts[era];
    if (!prompt) {
      return {
        era,
        imageUrl: null,
        success: false,
        error: `Unknown era: ${era}`,
        generationTimeMs: 0
      };
    }

    // Retry loop with exponential backoff
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const backoffMs = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
          await delay(backoffMs);
          retryCount = attempt;
        }

        const { data, error } = await supabase.functions.invoke('generate-portrait', {
          body: { era, sourceImageBase64, prompt }
        });

        const generationTimeMs = Date.now() - startTime;

        if (error) {
          const parsed = parseError(error);
          lastError = parsed.message;
          
          if (!parsed.isRetryable || attempt === maxRetries) {
            await trackingService.trackGeneration(era, false, generationTimeMs, lastError, userId);
            throw new Error(lastError);
          }
          continue;
        }

        if (!data?.success || !data?.imageUrl) {
          lastError = data?.error || 'Generation failed - no image returned';
          if (attempt === maxRetries) {
            await trackingService.trackGeneration(era, false, generationTimeMs, lastError, userId);
            throw new Error(lastError);
          }
          continue;
        }

        // Success - cache and track
        const imageHash = await hashImage(sourceImageBase64);
        imageCache.set(getCacheKey(era, imageHash), data.imageUrl);
        await trackingService.trackGeneration(era, true, generationTimeMs, undefined, userId);

        // Store in database if user is logged in (non-blocking)
        if (userId) {
          void supabase.from('generated_portraits').insert({
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
          generationTimeMs,
          retryCount
        };

      } catch (err) {
        const parsed = parseError(err);
        lastError = parsed.message;
        
        if (!parsed.isRetryable || attempt === maxRetries) {
          break;
        }
      }
    }

    return {
      era,
      imageUrl: null,
      success: false,
      error: lastError || 'Generation failed after retries',
      generationTimeMs: Date.now() - startTime,
      retryCount
    };
  },

  // Generate multiple portraits with controlled concurrency
  async generateAll(
    eras: string[],
    sourceImageBase64: string,
    onProgress: (completed: number, total: number, result: GenerationResult) => void,
    userId?: string,
    concurrency: number = 3
  ): Promise<GenerationResult[]> {
    const total = eras.length;
    const results: GenerationResult[] = [];
    let completed = 0;

    // Process in batches to avoid overwhelming the API
    for (let i = 0; i < eras.length; i += concurrency) {
      const batch = eras.slice(i, i + concurrency);
      
      const batchResults = await Promise.allSettled(
        batch.map(async (era) => {
          const result = await this.generatePortrait(era, sourceImageBase64, userId);
          completed++;
          onProgress(completed, total, result);
          return result;
        })
      );

      for (let j = 0; j < batchResults.length; j++) {
        const result = batchResults[j];
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          results.push({
            era: batch[j],
            imageUrl: null,
            success: false,
            error: result.reason?.message || 'Generation failed'
          });
        }
      }

      // Small delay between batches to be nice to the API
      if (i + concurrency < eras.length) {
        await delay(500);
      }
    }

    return results;
  },

  clearCache() {
    imageCache.clear();
  },

  getCacheSize(): number {
    return imageCache.size;
  }
};

export default generationService;
