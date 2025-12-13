import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, Loader2, Clock, Sparkles, AlertCircle } from 'lucide-react';
import { eraConfig } from '@/lib/decadePrompts';
import { GenerationResult } from '@/services/generationService';

interface ResultsStageProps {
  activeEra: string | null;
  result: GenerationResult | null | undefined;
  isGenerating: boolean;
}

export function ResultsStage({ activeEra, result, isGenerating }: ResultsStageProps) {
  const era = activeEra ? eraConfig[activeEra] : null;

  const handleDownload = () => {
    if (!result?.imageUrl) return;
    
    const link = document.createElement('a');
    link.href = result.imageUrl;
    link.download = `tlc-rewind-${activeEra}-${Date.now()}.png`;
    link.click();
  };

  const handleShare = async () => {
    if (!result?.imageUrl) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `TLC REWIND - ${era?.name}`,
          text: `Check out my time travel portrait from ${era?.year}!`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <motion.div 
      className="glass-panel rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/30 bg-gradient-to-r from-gold/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gold animate-pulse shadow-[0_0_12px_hsla(var(--gold),0.6)]" />
            <div>
              <h3 className="text-lg font-bold tracking-[0.15em]">RESULTS STAGE</h3>
              <p className="text-[10px] tracking-[0.2em] text-muted-foreground/60 font-mono">TIME LOCKED CAPTURES</p>
            </div>
          </div>
          
          {result?.success && (
            <div className="flex gap-2">
              <motion.button 
                onClick={handleDownload}
                className="glass-ultra px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-medium tracking-wider hover:bg-gold/10 hover:border-gold/30 border border-transparent transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-4 h-4 text-gold" />
                <span className="hidden sm:inline">DOWNLOAD</span>
              </motion.button>
              <motion.button 
                onClick={handleShare}
                className="glass-ultra px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-medium tracking-wider hover:bg-gold/10 hover:border-gold/30 border border-transparent transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 className="w-4 h-4 text-gold" />
                <span className="hidden sm:inline">SHARE</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Main Stage */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-background via-card to-background">
        {/* Ambient background pattern */}
        <div className="absolute inset-0 synthwave-grid opacity-5" />
        
        {/* Empty state */}
        <AnimatePresence mode="wait">
          {!activeEra && !isGenerating && (
            <motion.div 
              key="empty"
              className="absolute inset-0 flex items-center justify-center p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center">
                <motion.div 
                  className="relative w-24 h-24 mx-auto mb-6"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/20 to-transparent blur-xl" />
                  <div className="relative w-full h-full rounded-full glass-ultra flex items-center justify-center">
                    <Clock className="w-10 h-10 text-gold/60" />
                  </div>
                </motion.div>
                <p className="text-lg font-bold tracking-wider text-muted-foreground/80">SELECT AN ERA</p>
                <p className="text-sm text-muted-foreground/50 mt-2 max-w-xs mx-auto">
                  Choose an era from the grid above and generate to see your legendary portrait
                </p>
              </div>
            </motion.div>
          )}

          {/* Generating state */}
          {isGenerating && (
            <motion.div 
              key="generating"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center">
                {/* Animated portal */}
                <div className="relative w-40 h-40 mx-auto mb-6">
                  {/* Outer rings */}
                  <motion.div 
                    className="absolute inset-0 rounded-full border-2 border-gold/20"
                    animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <motion.div 
                    className="absolute inset-4 rounded-full border-2 border-gold/30"
                    animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                  />
                  <motion.div 
                    className="absolute inset-8 rounded-full border-2 border-gold/40"
                    animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                  />
                  
                  {/* Center glow */}
                  <motion.div 
                    className="absolute inset-12 rounded-full bg-gold/20 blur-xl"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  
                  {/* Spinner */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-16 h-16 text-gold animate-spin" />
                  </div>
                </div>
                
                <motion.p 
                  className="text-xl font-bold tracking-[0.15em] text-gradient-gold"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  TRAVELING TO {era?.year}...
                </motion.p>
                <p className="text-sm text-muted-foreground mt-2">
                  Meeting {era?.celebrity}
                </p>
              </div>
            </motion.div>
          )}

          {/* Success result */}
          {result?.success && result.imageUrl && !isGenerating && (
            <motion.div 
              key="result"
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={result.imageUrl}
                alt={`${era?.name} portrait`}
                className="w-full h-full object-contain"
              />
              
              {/* Era badge overlay */}
              <motion.div 
                className="absolute top-4 left-4"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${era?.gradient} text-white shadow-xl flex items-center gap-2`}>
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-bold tracking-wider">{era?.name} • {era?.year}</span>
                </div>
              </motion.div>
              
              {/* TLC Watermark */}
              <div className="absolute bottom-4 right-4 glass-ultra px-3 py-2 rounded-xl">
                <span className="text-[10px] tracking-[0.2em] text-platinum/80 font-mono">TLC STUDIOS REWIND™</span>
              </div>
            </motion.div>
          )}

          {/* Error state */}
          {result && !result.success && !isGenerating && (
            <motion.div 
              key="error"
              className="absolute inset-0 flex items-center justify-center p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center">
                <motion.div 
                  className="relative w-20 h-20 mx-auto mb-6"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="absolute inset-0 rounded-full bg-destructive/20 blur-xl" />
                  <div className="relative w-full h-full rounded-full glass-ultra flex items-center justify-center border border-destructive/30">
                    <AlertCircle className="w-10 h-10 text-destructive" />
                  </div>
                </motion.div>
                <p className="text-lg font-bold tracking-wider text-destructive">GENERATION FAILED</p>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                  {result.error || 'Please try again'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer with generation time */}
      {result?.generationTimeMs && result.success && (
        <motion.div 
          className="px-5 py-3 border-t border-border/30 flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Clock className="w-3.5 h-3.5 text-muted-foreground/60" />
          <p className="text-xs text-muted-foreground/60 font-mono tracking-wider">
            Generated in {(result.generationTimeMs / 1000).toFixed(1)}s
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}