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
  return (
    <div className="space-y-4">
      {/* Header - Minimal */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-px h-6 bg-gradient-to-b from-amber-500 to-transparent" />
          <h3 className="text-lg font-bold tracking-[0.2em] text-gradient-gold">ERAS</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
          <span className="text-[9px] tracking-[0.2em] text-emerald-500/70">LIVE</span>
        </div>
      </div>

      {/* TV Grid */}
      <motion.div 
        className="grid grid-cols-3 gap-2 sm:gap-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.03 }
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
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 }
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

      {/* Status bar - Minimal */}
      <div className="flex items-center justify-center gap-6 py-2">
        {[
          { value: eraOrder.length, color: 'text-foreground' },
          { value: Array.from(results.values()).filter(r => r.success).length, color: 'text-emerald-500' },
          { value: generatingEras.size, color: 'text-amber-500' }
        ].map((stat, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
            <div className={`w-1 h-1 rounded-full ${stat.color.replace('text-', 'bg-')}`} />
          </div>
        ))}
      </div>
    </div>
  );
}