import { supabase } from '@/integrations/supabase/client';

let currentSessionId: string | null = null;

export const trackingService = {
  // Initialize a new session
  async startSession(userId?: string) {
    try {
      const deviceInfo = navigator.userAgent;
      const browser = getBrowserName();

      const { data, error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: userId || null,
          device_info: deviceInfo,
          browser: browser
        })
        .select('id')
        .single();

      if (!error && data) {
        currentSessionId = data.id;
        return data.id;
      }
    } catch (err) {
      console.error('Error starting session:', err);
    }
    return null;
  },

  // End the current session
  async endSession() {
    if (!currentSessionId) return;

    try {
      await supabase
        .from('user_sessions')
        .update({ ended_at: new Date().toISOString() })
        .eq('id', currentSessionId);
      
      currentSessionId = null;
    } catch (err) {
      console.error('Error ending session:', err);
    }
  },

  // Track a page view
  async trackPageView(pagePath: string, userId?: string) {
    try {
      await supabase
        .from('page_views')
        .insert({
          session_id: currentSessionId,
          user_id: userId || null,
          page_path: pagePath
        });
    } catch (err) {
      console.error('Error tracking page view:', err);
    }
  },

  // Track a click event
  async trackClick(
    elementId: string,
    elementType: string,
    x: number,
    y: number,
    userId?: string
  ) {
    try {
      await supabase
        .from('click_events')
        .insert({
          session_id: currentSessionId,
          user_id: userId || null,
          element_id: elementId,
          element_type: elementType,
          x_pos: Math.round(x),
          y_pos: Math.round(y)
        });
    } catch (err) {
      console.error('Error tracking click:', err);
    }
  },

  // Track era selection
  async trackEraSelection(era: string, userId?: string) {
    try {
      await supabase
        .from('era_selections')
        .insert({
          user_id: userId || null,
          era: era
        });
    } catch (err) {
      console.error('Error tracking era selection:', err);
    }
  },

  // Track a generation attempt
  async trackGeneration(
    era: string,
    success: boolean,
    generationTimeMs: number,
    errorMessage?: string,
    userId?: string
  ) {
    try {
      await supabase
        .from('generation_logs')
        .insert({
          user_id: userId || null,
          era: era,
          success: success,
          generation_time_ms: generationTimeMs,
          error_message: errorMessage || null
        });

      // Update user behavior if logged in
      if (userId) {
        await updateUserBehavior(userId, era, success);
      }
    } catch (err) {
      console.error('Error tracking generation:', err);
    }
  },

  // Get session ID
  getSessionId() {
    return currentSessionId;
  }
};

// Helper to detect browser
function getBrowserName(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  return 'Unknown';
}

// Update user behavior aggregates
async function updateUserBehavior(userId: string, era: string, success: boolean) {
  if (!success) return;

  try {
    // Get current behavior
    const { data: behavior } = await supabase
      .from('user_behavior')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (behavior) {
      // Update total generations
      const newTotal = (behavior.total_generations || 0) + 1;
      
      // Get most used era
      const { data: eraStats } = await supabase
        .from('generation_logs')
        .select('era')
        .eq('user_id', userId)
        .eq('success', true);

      let favoriteEra = era;
      if (eraStats && eraStats.length > 0) {
        const eraCounts: Record<string, number> = {};
        eraStats.forEach(s => {
          eraCounts[s.era] = (eraCounts[s.era] || 0) + 1;
        });
        favoriteEra = Object.entries(eraCounts).sort((a, b) => b[1] - a[1])[0][0];
      }

      await supabase
        .from('user_behavior')
        .update({
          total_generations: newTotal,
          favorite_era: favoriteEra,
          engagement_score: Math.min(100, newTotal * 5)
        })
        .eq('user_id', userId);
    }
  } catch (err) {
    console.error('Error updating user behavior:', err);
  }
}

export default trackingService;
