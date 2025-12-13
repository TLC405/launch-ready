import { motion } from 'framer-motion';
import { Radio, Sparkles } from 'lucide-react';
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
  const progressPercent = Math.round((completedCount / eraOrder.length) * 100);
  
  return (
    <div className="space-y-5">
      {/* Premium Header */}
      <motion.div 
        className="glass-panel-gold rounded-2xl p-5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Animated accent bar */}
            <motion.div 
              className="w-1.5 h-10 rounded-full bg-gradient-to-b from-gold via-gold/60 to-transparent"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            <div>
              <p className="text-[9px] tracking-[0.4em] text-gold/60 font-mono mb-1">TEMPORAL LINE CATALOG</p>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-[0.15em] text-gradient-gold">ERA SELECTION</h3>
            </div>
          </div>
          
          {/* Live status indicator */}
          <div className="glass-ultra px-4 py-2.5 rounded-xl flex items-center gap-3 border border-success/20">
            <div className="relative">
              <motion.div 
                className="w-2.5 h-2.5 rounded-full bg-success"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-success animate-ping opacity-50" />
            </div>
            <div className="hidden sm:block">
              <span className="text-[9px] tracking-[0.25em] text-success/80 font-mono block">SYSTEM</span>
              <span className="text-[10px] tracking-[0.15em] text-success font-semibold">ONLINE</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* TV Grid with staggered animation */}
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.06, delayChildren: 0.1 }
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
                hidden: { opacity: 0, y: 30, scale: 0.9 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: { type: 'spring', stiffness: 300, damping: 25 }
                }
              }}
            >
              <EraTVTile
                era={era}
                isActive={activeEra === eraId}
                isGenerating={generatingEras.has(eraId)}
                isComplete={result?.success ?? false}
                resultUrl={result?.imageUrl}
                error={result?.error}
                onClick={() => onSelectEra(eraId)}
                onGenerate={() => onGenerateEra(eraId)}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Premium Status Bar */}
      <motion.div 
        className="glass-panel rounded-2xl p-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Stats Grid */}
          <div className="flex items-center gap-6 sm:gap-10">
            {[
              { label: 'TOTAL', value: eraOrder.length, color: 'text-platinum', icon: Radio },
              { label: 'COMPLETE', value: completedCount, color: 'text-success', icon: null },
              { label: 'GENERATING', value: generatingEras.size, color: 'text-gold', icon: Sparkles }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <motion.span 
                  className={`text-3xl sm:text-4xl font-bold ${stat.color}`}
                  animate={stat.label === 'GENERATING' && stat.value > 0 ? { opacity: [0.7, 1, 0.7] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {stat.value}
                </motion.span>
                <div className="flex flex-col">
                  <span className="text-[8px] tracking-[0.3em] text-muted-foreground/60 font-mono">{stat.label}</span>
                  {stat.icon && <stat.icon className="w-3 h-3 text-muted-foreground/40 mt-0.5" />}
                </div>
              </div>
            ))}
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-40 h-2 rounded-full bg-muted/50 overflow-hidden">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
              
              {/* Progress fill */}
              <motion.div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold via-success to-success rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
              
              {/* Shine effect */}
              <motion.div 
                className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '500%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gold">{progressPercent}%</span>
              <span className="text-[9px] tracking-wider text-muted-foreground/60 font-mono hidden sm:block">COMPLETE</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}