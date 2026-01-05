import { motion, AnimatePresence } from 'framer-motion';
import { Download, Loader2, AlertCircle, X } from 'lucide-react';
import { useState } from 'react';
import { GenerationResult } from '@/services/generationService';

interface HoloResultsGalleryProps {
  results: Map<string, GenerationResult>;
  isGenerating: boolean;
  selectedEras: Set<string>;
  currentGeneratingEra?: string;
}

const ERA_LABELS: Record<string, string> = {
  '1865': '1865',
  '1900s': '1900s',
  '1950s': '1950s',
  '1960s': '1960s',
  '1970s': '1970s',
  '1980s': '1980s',
  '1990s': '1990s',
  '2000s': '2000s',
  'homeless': 'HOMELESS',
  'dayone': 'DAY ONE',
};

export function HoloResultsGallery({ 
  results, 
  isGenerating, 
  selectedEras,
  currentGeneratingEra 
}: HoloResultsGalleryProps) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  
  // Show gallery when there are results OR when generating
  const shouldShow = results.size > 0 || isGenerating;
  
  if (!shouldShow) return null;
  
  // Get all eras to display (selected eras during generation, or results)
  const displayEras = isGenerating ? Array.from(selectedEras) : Array.from(results.keys());
  
  return (
    <>
      <motion.div
        className="fixed bottom-28 left-1/2 -translate-x-1/2 z-30"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Gallery header */}
        <motion.div
          className="mb-3 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span 
            className="font-mono text-[10px] tracking-[0.3em] uppercase"
            style={{
              color: 'rgba(0, 240, 255, 0.7)',
              textShadow: '0 0 10px rgba(0, 240, 255, 0.5)',
            }}
          >
            ◈ TEMPORAL CAPTURES ◈
          </span>
        </motion.div>
        
        {/* Horizontal polaroid row */}
        <div className="flex gap-3 justify-center flex-wrap max-w-[95vw]">
          {displayEras.map((era, index) => {
            const result = results.get(era);
            const isCurrentlyGenerating = isGenerating && !result && era === currentGeneratingEra;
            const isPending = isGenerating && !result && era !== currentGeneratingEra;
            
            return (
              <PolaroidCard
                key={era}
                era={era}
                label={ERA_LABELS[era] || era}
                result={result}
                isGenerating={isCurrentlyGenerating}
                isPending={isPending}
                index={index}
                onExpand={() => result?.imageUrl && setExpandedImage(result.imageUrl)}
              />
            );
          })}
        </div>
      </motion.div>
      
      {/* Expanded image modal */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedImage(null)}
          >
            <motion.div
              className="relative max-w-[80vw] max-h-[80vh]"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Polaroid frame for expanded view */}
              <div
                className="p-4 pb-12 rounded"
                style={{
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(240, 240, 245, 0.9))',
                  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 240, 255, 0.2)',
                }}
              >
                <img 
                  src={expandedImage} 
                  alt="Generated portrait"
                  className="max-w-full max-h-[70vh] object-contain"
                />
              </div>
              
              {/* Close button */}
              <motion.button
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(255, 41, 117, 0.9)',
                  boxShadow: '0 0 20px rgba(255, 41, 117, 0.5)',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setExpandedImage(null)}
              >
                <X size={16} className="text-white" />
              </motion.button>
              
              {/* Download button */}
              <motion.a
                href={expandedImage}
                download="REWIND_portrait.png"
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded flex items-center gap-2 font-mono text-xs"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.9), rgba(168, 85, 247, 0.9))',
                  boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
                  color: 'white',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={14} />
                SAVE
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface PolaroidCardProps {
  era: string;
  label: string;
  result?: GenerationResult;
  isGenerating: boolean;
  isPending: boolean;
  index: number;
  onExpand: () => void;
}

function PolaroidCard({ era, label, result, isGenerating, isPending, index, onExpand }: PolaroidCardProps) {
  const hasImage = result?.success && result?.imageUrl;
  const hasError = result && !result.success;
  
  // Random slight rotation for organic feel
  const rotation = ((index % 3) - 1) * 2;
  
  return (
    <motion.div
      className="relative cursor-pointer flex-shrink-0"
      initial={{ opacity: 0, y: 30, rotate: rotation - 5 }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={hasImage ? { 
        scale: 1.08, 
        rotate: 0,
        zIndex: 10,
        transition: { duration: 0.2 }
      } : {}}
      onClick={hasImage ? onExpand : undefined}
    >
      {/* Polaroid frame */}
      <div
        className="relative w-20 md:w-24 p-1.5 pb-5 rounded-sm"
        style={{
          background: hasImage 
            ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(245, 245, 250, 0.9))'
            : 'linear-gradient(145deg, rgba(30, 35, 45, 0.9), rgba(20, 25, 35, 0.95))',
          boxShadow: hasImage
            ? '0 8px 25px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 240, 255, 0.15)'
            : '0 4px 15px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(0, 240, 255, 0.05)',
          border: hasImage 
            ? 'none' 
            : '1px solid rgba(0, 240, 255, 0.2)',
        }}
      >
        {/* Image area */}
        <div 
          className="aspect-[3/4] rounded-sm overflow-hidden flex items-center justify-center"
          style={{
            background: hasImage ? 'transparent' : 'rgba(0, 0, 0, 0.3)',
          }}
        >
          {hasImage && (
            <motion.img
              src={result.imageUrl!}
              alt={`${era} portrait`}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
          
          {isGenerating && (
            <div className="flex flex-col items-center gap-1">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 size={16} style={{ color: 'rgba(0, 240, 255, 0.8)' }} />
              </motion.div>
              <span 
                className="font-mono text-[7px] tracking-wider"
                style={{ color: 'rgba(0, 240, 255, 0.6)' }}
              >
                WARPING...
              </span>
            </div>
          )}
          
          {isPending && (
            <div className="flex flex-col items-center gap-1">
              <div 
                className="w-4 h-4 rounded-full border-2 border-dashed"
                style={{ borderColor: 'rgba(100, 100, 110, 0.4)' }}
              />
              <span 
                className="font-mono text-[6px] tracking-wider"
                style={{ color: 'rgba(100, 100, 110, 0.5)' }}
              >
                QUEUED
              </span>
            </div>
          )}
          
          {hasError && (
            <div className="flex flex-col items-center gap-1 p-1">
              <AlertCircle size={14} style={{ color: 'rgba(255, 100, 100, 0.8)' }} />
              <span 
                className="font-mono text-[6px] tracking-wider text-center"
                style={{ color: 'rgba(255, 100, 100, 0.7)' }}
              >
                ERROR
              </span>
            </div>
          )}
        </div>
        
        {/* Era label */}
        <div className="absolute bottom-1 left-0 right-0 text-center">
          <span 
            className="font-mono text-[8px] tracking-wide"
            style={{ 
              color: hasImage ? 'rgba(40, 40, 50, 0.8)' : 'rgba(0, 240, 255, 0.6)',
              textShadow: hasImage ? 'none' : '0 0 5px rgba(0, 240, 255, 0.3)',
            }}
          >
            {label}
          </span>
        </div>
        
        {/* Holographic shimmer overlay for pending/generating */}
        {(isGenerating || isPending) && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-sm"
            style={{
              background: 'linear-gradient(45deg, transparent 40%, rgba(0, 240, 255, 0.1) 50%, transparent 60%)',
              backgroundSize: '200% 200%',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '200% 200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}
      </div>
      
      {/* Tape piece decoration for completed polaroids */}
      {hasImage && (
        <div
          className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-2 rounded-sm"
          style={{
            background: 'rgba(255, 255, 200, 0.4)',
            transform: 'translateX(-50%) rotate(-2deg)',
          }}
        />
      )}
    </motion.div>
  );
}
