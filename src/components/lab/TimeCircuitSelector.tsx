import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Check, Loader2, Download, Clock, Sparkles } from 'lucide-react';
import { eraConfig, eraOrder, EraId } from '@/lib/decadePrompts';
import { GenerationResult } from '@/services/generationService';

interface TimeCircuitSelectorProps {
  selectedEras: Set<EraId>;
  generatingEras: Set<string>;
  results: Map<string, GenerationResult>;
  sourceImage: string | null;
  isGenerating: boolean;
  onToggleEra: (era: EraId) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
  onGenerate: () => void;
  onDownload: () => void;
}

export function TimeCircuitSelector({
  selectedEras,
  generatingEras,
  results,
  sourceImage,
  isGenerating,
  onToggleEra,
  onSelectAll,
  onSelectNone,
  onGenerate,
  onDownload
}: TimeCircuitSelectorProps) {
  const completedCount = Array.from(results.values()).filter(r => r.success).length;
  const totalLegends = selectedEras.size * 12;
  
  return (
    <motion.div 
      className="time-circuit-panel rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* BTTF Header */}
      <div className="time-circuit-header px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Flux capacitor icon */}
            <motion.div 
              className="flux-indicator"
              animate={{ 
                boxShadow: [
                  '0 0 20px hsla(var(--gold), 0.4)',
                  '0 0 40px hsla(var(--gold), 0.8)',
                  '0 0 20px hsla(var(--gold), 0.4)'
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Clock className="w-5 h-5 text-gold" />
            </motion.div>
            
            <div>
              <h3 className="time-circuit-title">DESTINATION TIME</h3>
              <p className="time-circuit-subtitle">SELECT YOUR ERAS</p>
            </div>
          </div>
          
          {/* Quick actions */}
          <div className="flex gap-2">
            <motion.button
              onClick={onSelectAll}
              className="time-circuit-btn-small"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ALL
            </motion.button>
            <motion.button
              onClick={onSelectNone}
              className="time-circuit-btn-small time-circuit-btn-ghost"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              NONE
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Era Grid - Clean BTTF style */}
      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {eraOrder.map((eraId, index) => {
            const era = eraConfig[eraId];
            const isSelected = selectedEras.has(eraId);
            const isGen = generatingEras.has(eraId);
            const result = results.get(eraId);
            const isComplete = result?.success;
            
            return (
              <motion.button
                key={eraId}
                onClick={() => !isGen && onToggleEra(eraId)}
                disabled={isGen}
                className={`era-chip ${isSelected ? 'era-chip-selected' : ''} ${isGen ? 'era-chip-generating' : ''} ${isComplete ? 'era-chip-complete' : ''}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: isGen ? 1 : 1.08, y: isGen ? 0 : -4 }}
                whileTap={{ scale: isGen ? 1 : 0.95 }}
              >
                {/* Glow effect when selected */}
                {isSelected && !isGen && (
                  <motion.div 
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: `radial-gradient(circle, hsla(var(--gold), 0.3) 0%, transparent 70%)`
                    }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                
                {/* Complete badge */}
                {isComplete && (
                  <motion.div 
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-success flex items-center justify-center z-10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.6 }}
                  >
                    <Check className="w-2.5 h-2.5 text-success-foreground" strokeWidth={3} />
                  </motion.div>
                )}
                
                {/* Content */}
                <span className="relative z-10 font-bold tracking-wider">
                  {isGen ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    era.year
                  )}
                </span>
                
                {/* Era name tooltip on hover */}
                <span className="era-chip-tooltip">{era.name}</span>
              </motion.button>
            );
          })}
        </div>
        
        {/* LED Status Display */}
        <div className="mt-6 pt-5 border-t border-gold/10">
          <div className="led-display">
            <div className="led-display-row">
              <div className="led-stat">
                <span className="led-label">ERAS</span>
                <motion.span 
                  className="led-value led-value-gold"
                  key={selectedEras.size}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                >
                  {selectedEras.size}
                </motion.span>
              </div>
              <div className="led-divider" />
              <div className="led-stat">
                <span className="led-label">LEGENDS</span>
                <span className="led-value led-value-cyan">{totalLegends}+</span>
              </div>
              <div className="led-divider" />
              <div className="led-stat">
                <span className="led-label">COMPLETE</span>
                <span className="led-value led-value-green">{completedCount}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <motion.button
            onClick={onGenerate}
            disabled={!sourceImage || isGenerating || selectedEras.size === 0}
            className="time-warp-btn w-full"
            whileHover={{ scale: sourceImage && !isGenerating && selectedEras.size > 0 ? 1.02 : 1 }}
            whileTap={{ scale: sourceImage && !isGenerating && selectedEras.size > 0 ? 0.98 : 1 }}
          >
            {/* Animated energy effect */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div 
                  className="absolute inset-0 overflow-hidden rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Progress bar */}
            {isGenerating && (
              <motion.div 
                className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-xl"
                initial={{ width: 0 }}
                animate={{ width: `${((selectedEras.size - generatingEras.size) / selectedEras.size) * 100}%` }}
              />
            )}
            
            <span className="relative z-10 flex items-center justify-center gap-3">
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>ENGAGING TIME WARP...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>ENGAGE TIME WARP</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </span>
          </motion.button>
          
          <motion.button
            onClick={onDownload}
            disabled={completedCount === 0}
            className="download-album-btn w-full"
            whileHover={{ scale: completedCount > 0 ? 1.02 : 1 }}
            whileTap={{ scale: completedCount > 0 ? 0.98 : 1 }}
          >
            <Download className="w-5 h-5" />
            <span>DOWNLOAD ALBUM ({completedCount})</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
