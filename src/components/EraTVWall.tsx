import { motion } from 'framer-motion';
import { EraTVTile } from './EraTVTile';
import { eraConfig, eraOrder, EraId } from '@/lib/decadePrompts';
import { GenerationResult } from '@/services/generationService';

interface EraTVWallProps {
  activeEra: EraId | null;
  generatingEras: Set<string>;
  results: Map<string, GenerationResult>;
  onSelectEra: (era: EraId) => void;
  onGenerateEra: (era: EraId) => void;
}

export function EraTVWall({
  activeEra,
  generatingEras,
  results,
  onSelectEra,
  onGenerateEra
}: EraTVWallProps) {
  const completedCount = Array.from(results.values()).filter(r => r.success).length;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Decorative line */}
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-gold via-gold/50 to-transparent" />
          
          <div>
            <p className="text-[9px] tracking-[0.4em] text-muted-foreground/60 font-mono">TEMPORAL LINE CATALOG</p>
            <h3 className="text-2xl font-bold tracking-[0.2em] text-gradient-gold">ERA SELECTION</h3>
          </div>
        </div>
        
        {/* Live indicator */}
        <div className="glass-ultra px-4 py-2 rounded-full flex items-center gap-3">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <span className="text-[10px] tracking-[0.3em] text-emerald-400 font-mono">ONLINE</span>
        </div>
      </div>

      {/* TV Grid */}
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
          }
        }}
      >
        {eraOrder.map((eraId) => {
          const era = eraConfig[eraId];
          const result = results.get(eraId);
          
          return (
            <motion.div
              key={eraId}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 }
              }}
            >
              <EraTVTile
                era={era}
                isActive={activeEra === eraId}
                isGenerating={generatingEras.has(eraId)}
                isComplete={result?.success ?? false}
                resultUrl={result?.imageUrl}
                onClick={() => onSelectEra(eraId)}
                onGenerate={() => onGenerateEra(eraId)}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Status bar */}
      <div className="glass-ultra rounded-xl p-4">
        <div className="flex items-center justify-between">
          {/* Stats */}
          <div className="flex items-center gap-8">
            {[
              { label: 'TOTAL', value: eraOrder.length, color: 'text-foreground' },
              { label: 'COMPLETE', value: completedCount, color: 'text-emerald-400' },
              { label: 'GENERATING', value: generatingEras.size, color: 'text-gold' }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                <span className="text-[8px] tracking-[0.3em] text-muted-foreground/60 font-mono">{stat.label}</span>
              </div>
            ))}
          </div>
          
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="w-32 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-gold to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / eraOrder.length) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <span className="text-[10px] tracking-wider text-muted-foreground font-mono">
              {Math.round((completedCount / eraOrder.length) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}