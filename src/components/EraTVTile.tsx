import { motion } from 'framer-motion';
import { Loader2, Check, Zap } from 'lucide-react';
import { EraConfig } from '@/lib/decadePrompts';

interface EraTVTileProps {
  era: EraConfig;
  isActive: boolean;
  isGenerating: boolean;
  isComplete: boolean;
  resultUrl?: string;
  onClick: () => void;
  onGenerate: () => void;
}

export function EraTVTile({
  era,
  isActive,
  isGenerating,
  isComplete,
  resultUrl,
  onClick,
  onGenerate
}: EraTVTileProps) {
  return (
    <motion.div
      className={`relative cursor-pointer group ${isActive ? 'z-10' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.06, y: -8 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* Glow effect when active */}
      {isActive && (
        <motion.div 
          className="absolute -inset-3 rounded-2xl blur-xl -z-10"
          style={{
            background: `linear-gradient(135deg, hsla(var(--gold), 0.4), transparent)`
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
      
      {/* Card */}
      <div 
        className={`relative rounded-xl overflow-hidden transition-all duration-500 ${
          isActive 
            ? 'ring-2 ring-gold shadow-[0_0_40px_hsla(var(--gold),0.3)]' 
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
          {resultUrl ? (
            <>
              <img 
                src={resultUrl} 
                alt={era.name}
                className="w-full h-full object-cover"
              />
              {/* Success gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Success badge */}
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500/90 flex items-center justify-center shadow-lg">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
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
            </div>
          )}

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
          
          {/* Generate button overlay */}
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
                <div className="absolute -inset-6 rounded-full bg-gold/30 blur-xl animate-pulse" />
                
                {/* Button */}
                <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-gold via-gold to-gold-muted flex items-center justify-center shadow-2xl">
                  <Zap className="w-6 h-6 text-background" />
                </div>
              </div>
            </motion.button>
          )}
          
          {/* Generating overlay */}
          {isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-gold/20 blur-lg animate-pulse" />
                <Loader2 className="w-10 h-10 text-gold animate-spin" />
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="relative h-3 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900">
          {/* LEDs */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex gap-1">
            <div className={`w-1.5 h-1.5 rounded-full transition-all ${
              isGenerating 
                ? 'bg-gold shadow-[0_0_6px_rgba(201,169,98,0.9)] animate-pulse' 
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