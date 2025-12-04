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
      className={`relative cursor-pointer group ${isActive ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-background' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* CRT Frame */}
      <div className="surface-metal rounded-xl p-2 border-metallic">
        {/* Screen */}
        <div className="relative aspect-[4/3] surface-inset rounded-lg overflow-hidden screen-glow">
          {/* Content */}
          {resultUrl ? (
            <img 
              src={resultUrl} 
              alt={era.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
              {/* Static noise pattern */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  backgroundSize: '100px 100px'
                }}
              />
              
              {/* Era badge */}
              <span className={`text-xs font-bold tracking-wider px-2 py-0.5 rounded bg-gradient-to-r ${era.gradient} text-white mb-2`}>
                {era.year}
              </span>
              
              {/* Era name */}
              <h4 className="text-sm font-bold text-center text-foreground leading-tight">
                {era.name}
              </h4>
            </div>
          )}

          {/* Scanlines */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)'
            }}
          />

          {/* Screen curvature effect */}
          <div className="absolute inset-0 pointer-events-none rounded-lg" style={{
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5), inset 0 0 60px rgba(0,0,0,0.3)'
          }} />
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="flex items-center gap-1.5">
            {isGenerating ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
                <span className="text-[10px] text-amber-500 tracking-wider">GENERATING</span>
              </>
            ) : isComplete ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] text-emerald-500 tracking-wider">COMPLETE</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-zinc-600" />
                <span className="text-[10px] text-muted-foreground tracking-wider">IDLE</span>
              </>
            )}
          </div>

          {/* Generate button */}
          {!isComplete && !isGenerating && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onGenerate();
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Zap className="w-3 h-3 text-amber-500" />
            </motion.button>
          )}
        </div>

        {/* Power LED */}
        <div className="absolute bottom-3 right-3">
          <div className={`w-1.5 h-1.5 rounded-full ${
            isGenerating ? 'bg-amber-500 animate-pulse' : 
            isComplete ? 'bg-emerald-500' : 
            'bg-red-500/50'
          }`} />
        </div>
      </div>
    </motion.div>
  );
}
