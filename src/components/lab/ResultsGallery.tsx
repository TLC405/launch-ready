import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Download, Share2 } from 'lucide-react';
import { eraConfig, eraOrder, EraId } from '@/lib/decadePrompts';
import { GenerationResult } from '@/services/generationService';

interface ResultsGalleryProps {
  results: Map<string, GenerationResult>;
  activeEra: EraId | null;
  onSelectEra: (era: EraId) => void;
}

export function ResultsGallery({ results, activeEra, onSelectEra }: ResultsGalleryProps) {
  const completedResults = eraOrder
    .map(era => ({ era, result: results.get(era) }))
    .filter(({ result }) => result?.success && result.imageUrl);
    
  const activeResult = activeEra ? results.get(activeEra) : null;
  
  if (completedResults.length === 0) {
    return null;
  }
  
  return (
    <motion.div 
      className="results-gallery rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="results-header px-5 py-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-gold" />
          <div>
            <h3 className="results-title">YOUR ALBUM</h3>
            <p className="results-subtitle">{completedResults.length} PORTRAITS GENERATED</p>
          </div>
        </div>
      </div>
      
      {/* Thumbnails */}
      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-5 gap-2 mb-5">
          {completedResults.map(({ era, result }, index) => (
            <motion.button
              key={era}
              onClick={() => onSelectEra(era as EraId)}
              className={`result-thumb ${activeEra === era ? 'result-thumb-active' : ''}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <img 
                src={result!.imageUrl!} 
                alt={eraConfig[era as EraId].name}
                className="w-full h-full object-cover"
              />
              <div className="result-thumb-overlay">
                <span className="text-[8px] font-bold">{eraConfig[era as EraId].year}</span>
              </div>
            </motion.button>
          ))}
        </div>
        
        {/* Active Preview */}
        <AnimatePresence mode="wait">
          {activeResult?.success && activeResult.imageUrl && (
            <motion.div
              key={activeEra}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="result-preview"
            >
              <img 
                src={activeResult.imageUrl}
                alt={activeEra ? eraConfig[activeEra].name : 'Generated'}
                className="w-full aspect-square object-cover rounded-xl"
              />
              
              {/* Overlay info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-platinum tracking-wider">
                      {activeEra ? eraConfig[activeEra].name : ''}
                    </p>
                    <p className="text-[10px] text-platinum/60 font-mono tracking-wider">
                      TLC STUDIOS REWIND™
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <motion.a
                      href={activeResult.imageUrl}
                      download={`tlc-rewind-${activeEra}.png`}
                      className="result-action-btn"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Download className="w-4 h-4" />
                    </motion.a>
                    <motion.button
                      className="result-action-btn"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Share2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
