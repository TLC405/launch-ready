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
      whileHover={{ scale: 1.06, y: -8 }}
      whileTap={{ scale: 0.97 }}
      layout
    >
      {/* Multi-layer glow effect when active */}
      <AnimatePresence>
        {isActive && (
          <>
            <motion.div 
              className="absolute -inset-4 rounded-2xl blur-2xl -z-10"
              style={{
                background: `radial-gradient(circle, hsla(var(--gold), 0.5), transparent 70%)`
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            />
            <motion.div 
              className="absolute -inset-2 rounded-xl blur-md -z-10"
              style={{
                background: `linear-gradient(135deg, hsla(var(--gold), 0.3), transparent)`
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          </>
        )}
      </AnimatePresence>
      
      {/* Card Container */}
      <div 
        className={`relative rounded-xl overflow-hidden transition-all duration-500 ${
          isActive 
            ? 'ring-2 ring-gold shadow-[0_0_50px_hsla(var(--gold),0.35)]' 
            : hasError
              ? 'ring-1 ring-destructive/60 hover:ring-destructive shadow-[0_0_30px_hsla(0,62%,50%,0.2)]'
              : 'ring-1 ring-zinc-700/60 hover:ring-zinc-500/80 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]'
        }`}
      >
        {/* Premium glass background */}
        <div className="absolute inset-0 glass-card" />
        
        {/* Animated chrome highlight */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: isActive 
              ? 'linear-gradient(90deg, transparent, hsla(var(--gold), 0.6), transparent)'
              : 'linear-gradient(90deg, transparent, hsla(var(--silver), 0.3), transparent)'
          }}
          animate={isActive ? { opacity: [0.5, 1, 0.5] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Screen Area */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <AnimatePresence mode="wait">
            {resultUrl ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 1.15 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute inset-0"
              >
                <img 
                  src={resultUrl} 
                  alt={era.name}
                  className="w-full h-full object-cover"
                />
                {/* Premium gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
                
                {/* Shine overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
                
                {/* Success badge with pulse */}
                <motion.div 
                  className="absolute top-2.5 right-2.5"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', bounce: 0.5, delay: 0.3 }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 w-7 h-7 rounded-full bg-success/40 animate-ping" />
                    <div className="relative w-7 h-7 rounded-full bg-gradient-to-br from-success to-emerald-600 flex items-center justify-center shadow-lg shadow-success/40">
                      <Check className="w-4 h-4 text-success-foreground" strokeWidth={3} />
                    </div>
                  </div>
                </motion.div>
                
                {/* Era label on result */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <div className="glass-ultra px-2.5 py-1.5 rounded-lg">
                    <p className="text-[10px] tracking-[0.2em] text-platinum font-mono truncate">{era.name}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="placeholder"
                className="absolute inset-0 flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Deep layered background */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-950" />
                
                {/* Era gradient with better blending */}
                <div className={`absolute inset-0 bg-gradient-to-br ${era.gradient} opacity-50 mix-blend-overlay`} />
                <div className={`absolute inset-0 bg-gradient-to-t ${era.gradient} opacity-20`} />
                
                {/* Premium noise texture */}
                <div 
                  className="absolute inset-0 opacity-40 mix-blend-overlay"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
                  }}
                />
                
                {/* Deep vignette */}
                <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 80px rgba(0,0,0,0.9)' }} />
                
                {/* Center content */}
                <div className="relative z-10 text-center px-2">
                  <motion.span 
                    className="text-4xl sm:text-5xl lg:text-4xl xl:text-5xl font-bold text-platinum drop-shadow-2xl tracking-wider block"
                    animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {era.year}
                  </motion.span>
                  <p className="text-[8px] sm:text-[9px] tracking-[0.25em] text-platinum/60 mt-2 font-mono uppercase">
                    {era.name.split(' ').slice(0, 2).join(' ')}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Premium scanlines */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)'
            }}
          />

          {/* Screen curvature effect */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{ 
              boxShadow: 'inset 0 0 60px rgba(0,0,0,0.6), inset 0 0 120px rgba(0,0,0,0.3)' 
            }} 
          />
          
          {/* Generate/Retry button overlay */}
          {!isComplete && !isGenerating && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onGenerate();
              }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 opacity-0 group-hover:opacity-100 transition-all duration-400 backdrop-blur-md"
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                {/* Animated glow ring */}
                <motion.div 
                  className={`absolute -inset-8 rounded-full blur-2xl ${hasError ? 'bg-destructive/40' : 'bg-gold/40'}`}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Button */}
                <motion.div 
                  className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl ${
                    hasError 
                      ? 'bg-gradient-to-br from-destructive via-destructive to-red-700' 
                      : 'bg-gradient-to-br from-gold via-gold to-gold-muted'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {/* Inner shine */}
                  <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
                  
                  {hasError ? (
                    <RotateCcw className="w-7 h-7 text-destructive-foreground relative z-10" />
                  ) : (
                    <Zap className="w-7 h-7 text-primary-foreground relative z-10" />
                  )}
                </motion.div>
              </div>
              
              <p className={`mt-4 text-[10px] font-mono tracking-[0.2em] ${hasError ? 'text-destructive' : 'text-gold'}`}>
                {hasError ? 'TAP TO RETRY' : 'GENERATE'}
              </p>
            </motion.button>
          )}
          
          {/* Generating overlay with premium animation */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div 
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="relative">
                  {/* Animated rings */}
                  <motion.div 
                    className="absolute -inset-6 rounded-full border-2 border-gold/30"
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <motion.div 
                    className="absolute -inset-4 rounded-full border border-gold/40"
                    animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                  />
                  
                  {/* Glow */}
                  <div className="absolute -inset-4 rounded-full bg-gold/25 blur-xl animate-pulse" />
                  
                  {/* Spinner */}
                  <Loader2 className="w-12 h-12 text-gold animate-spin relative z-10" />
                </div>
                <motion.p 
                  className="text-[10px] text-gold font-mono tracking-[0.2em] mt-4"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  GENERATING...
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Premium bottom bar */}
        <div className="relative h-4 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border-t border-zinc-700/50">
          {/* LED indicators */}
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex gap-1.5">
            <motion.div 
              className={`w-2 h-2 rounded-full transition-all ${
                isGenerating 
                  ? 'bg-gold shadow-[0_0_8px_hsla(var(--gold),0.9)]' 
                  : hasError
                    ? 'bg-destructive shadow-[0_0_8px_hsla(var(--destructive),0.8)]'
                    : isComplete 
                      ? 'bg-success shadow-[0_0_8px_hsla(var(--success),0.8)]' 
                      : 'bg-zinc-700'
              }`}
              animate={isGenerating ? { opacity: [0.5, 1, 0.5] } : {}}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            <div className={`w-2 h-2 rounded-full transition-all ${
              isActive ? 'bg-gold shadow-[0_0_8px_hsla(var(--gold),0.8)]' : 'bg-zinc-700'
            }`} />
          </div>
          
          {/* Model number */}
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
            <span className="text-[7px] text-zinc-500 font-mono tracking-wider">TLC-{era.year}</span>
          </div>
          
          {/* Chrome accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent" />
        </div>
      </div>
    </motion.div>
  );
}