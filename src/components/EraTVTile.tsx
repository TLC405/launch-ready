import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check, Zap, RotateCcw } from 'lucide-react';
import { EraConfig } from '@/lib/decadePrompts';

interface EraTVTileProps {
  era: EraConfig;
  isActive: boolean;
  isGenerating: boolean;
  isComplete: boolean;
  resultUrl?: string;
  error?: string;
  onClick: () => void;
  onGenerate: () => void;
}

export function EraTVTile({
  era,
  isActive,
  isGenerating,
  isComplete,
  resultUrl,
  error,
  onClick,
  onGenerate
}: EraTVTileProps) {
  const hasError = !!error && !isComplete;
  
  return (
    <motion.div
      className={`relative cursor-pointer group ${isActive ? 'z-10' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.04, y: -6 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* Glow effect when active */}
      <AnimatePresence>
        {isActive && (
          <motion.div 
            className="absolute -inset-3 rounded-2xl blur-xl -z-10"
            style={{
              background: `linear-gradient(135deg, hsla(var(--gold), 0.4), transparent)`
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
      
      {/* Card */}
      <div 
        className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
          isActive 
            ? 'ring-2 ring-gold shadow-[0_0_40px_hsla(var(--gold),0.3)]' 
            : hasError
              ? 'ring-1 ring-destructive/50 hover:ring-destructive'
              : 'ring-1 ring-zinc-700/50 hover:ring-zinc-600'
        }`}
      >
        {/* Glass background */}
        <div className="absolute inset-0 glass-card" />
        
        {/* Chrome highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Screen */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {/* Content */}
          <AnimatePresence mode="wait">
            {resultUrl ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <img 
                  src={resultUrl} 
                  alt={era.name}
                  className="w-full h-full object-cover"
                />
                {/* Success gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Success badge */}
                <motion.div 
                  className="absolute top-2 right-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/90 flex items-center justify-center shadow-lg">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                key="placeholder"
                className="absolute inset-0 flex flex-col items-center justify-center p-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Deep dark base */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-950" />
                
                {/* Era gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${era.gradient} opacity-40`} />
                
                {/* Noise texture */}
                <div 
                  className="absolute inset-0 opacity-30 mix-blend-overlay"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
                  }}
                />
                
                {/* Vignette */}
                <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.8)' }} />
                
                {/* Year */}
                <div className="relative z-10 text-center">
                  <span className="text-4xl sm:text-5xl font-bold text-white drop-shadow-2xl tracking-wider">
                    {era.year}
                  </span>
                  <p className="text-[9px] tracking-[0.3em] text-white/60 mt-2 font-mono uppercase">
                    {era.name.split(' ').slice(0, 2).join(' ')}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scanlines */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-15"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)'
            }}
          />

          {/* Screen curvature */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{ boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)' }} 
          />
          
          {/* Generate/Retry button overlay */}
          {!isComplete && !isGenerating && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onGenerate();
              }}
              className="absolute inset-0 flex items-center justify-center bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                {/* Glow */}
                <div className={`absolute -inset-6 rounded-full blur-xl animate-pulse ${hasError ? 'bg-destructive/30' : 'bg-gold/30'}`} />
                
                {/* Button */}
                <div className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl ${
                  hasError 
                    ? 'bg-gradient-to-br from-destructive via-destructive to-destructive/80' 
                    : 'bg-gradient-to-br from-gold via-gold to-gold-muted'
                }`}>
                  {hasError ? (
                    <RotateCcw className="w-6 h-6 text-white" />
                  ) : (
                    <Zap className="w-6 h-6 text-background" />
                  )}
                </div>
              </div>
              
              {hasError && (
                <p className="absolute bottom-4 text-[10px] text-destructive/80 font-mono tracking-wider">
                  TAP TO RETRY
                </p>
              )}
            </motion.button>
          )}
          
          {/* Generating overlay */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div 
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full bg-gold/20 blur-lg animate-pulse" />
                  <Loader2 className="w-10 h-10 text-gold animate-spin" />
                </div>
                <p className="text-[10px] text-gold/80 font-mono tracking-wider animate-pulse">
                  GENERATING...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom bar */}
        <div className="relative h-3 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900">
          {/* LEDs */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex gap-1">
            <div className={`w-1.5 h-1.5 rounded-full transition-all ${
              isGenerating 
                ? 'bg-gold shadow-[0_0_6px_rgba(201,169,98,0.9)] animate-pulse' 
                : hasError
                  ? 'bg-destructive shadow-[0_0_6px_rgba(239,68,68,0.8)]'
                  : isComplete 
                    ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]' 
                    : 'bg-zinc-700'
            }`} />
            <div className={`w-1.5 h-1.5 rounded-full transition-all ${
              isActive ? 'bg-gold shadow-[0_0_6px_rgba(201,169,98,0.8)]' : 'bg-zinc-700'
            }`} />
          </div>
          
          {/* Model number */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <span className="text-[6px] text-zinc-600 font-mono tracking-wider">TLC-{era.year}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}