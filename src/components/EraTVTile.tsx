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
      whileHover={{ scale: 1.05, y: -6 }}
      whileTap={{ scale: 0.97 }}
      layout
    >
      {/* Glow effect when active */}
      {isActive && (
        <div className="absolute -inset-2 rounded-2xl bg-amber-500/30 blur-xl -z-10" />
      )}
      
      {/* CRT Frame */}
      <div className={`relative rounded-xl overflow-hidden transition-all duration-300 shadow-2xl ${
        isActive 
          ? 'ring-2 ring-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.4)]' 
          : 'ring-1 ring-zinc-600'
      }`} style={{ background: 'linear-gradient(145deg, hsl(230 15% 15%), hsl(230 15% 8%))' }}>
        
        {/* Chrome highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Screen */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* Content */}
          {resultUrl ? (
            <>
              <img 
                src={resultUrl} 
                alt={era.name}
                className="w-full h-full object-cover"
              />
              {/* Success overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
              {/* Solid dark background for visibility */}
              <div className="absolute inset-0 bg-black/60" />
              
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${era.gradient} opacity-50`} />
              
              {/* Noise texture */}
              <div 
                className="absolute inset-0 opacity-20 mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
                }}
              />
              
              {/* Year - big visual */}
              <span className="relative text-2xl sm:text-3xl font-bold text-white drop-shadow-lg tracking-wider">
                {era.year}
              </span>
            </div>
          )}

          {/* Scanlines */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)'
            }}
          />

          {/* Screen curvature */}
          <div className="absolute inset-0 pointer-events-none" style={{
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)'
          }} />
          
          {/* Generate button overlay */}
          {!isComplete && !isGenerating && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onGenerate();
              }}
              className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300"
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-amber-500/30 blur-lg" />
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-black" />
                </div>
              </div>
            </motion.button>
          )}
        </div>

        {/* Status strip */}
        <div className="h-1.5 bg-zinc-900 flex items-center justify-between px-2">
          {/* LED indicators */}
          <div className="flex gap-1">
            <div className={`w-1 h-1 rounded-full ${isGenerating ? 'bg-amber-500 animate-pulse' : isComplete ? 'bg-emerald-500' : 'bg-zinc-700'}`} />
            <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-amber-500' : 'bg-zinc-700'}`} />
          </div>
          
          {/* Status icon */}
          {isGenerating && <Loader2 className="w-2 h-2 animate-spin text-amber-500" />}
          {isComplete && <Check className="w-2 h-2 text-emerald-500" />}
        </div>
      </div>
    </motion.div>
  );
}