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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold tracking-wider text-foreground">ERA TV WALL</h3>
          <p className="text-xs text-muted-foreground tracking-wider">SELECT YOUR TIMELINE CHANNEL</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">LIVE</span>
        </div>
      </div>

      {/* TV Grid */}
      <motion.div 
        className="grid grid-cols-3 gap-3"
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
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
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
      <div className="surface-inset rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">TOTAL:</span>
            <span className="text-sm font-bold text-foreground">{eraOrder.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">COMPLETE:</span>
            <span className="text-sm font-bold text-emerald-500">
              {Array.from(results.values()).filter(r => r.success).length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">GENERATING:</span>
            <span className="text-sm font-bold text-amber-500">{generatingEras.size}</span>
          </div>
        </div>
        
        {activeEra && (
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground">SELECTED</p>
            <p className="text-sm font-bold text-foreground">{eraConfig[activeEra].name}</p>
          </div>
        )}
      </div>
    </div>
  );
}
