import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Grid3X3, Check } from 'lucide-react';
import { useState } from 'react';

interface HoloSceneSelectorProps {
  selectedEras: Set<string>;
  onToggleEra: (era: string) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
}

const ERAS = [
  { id: '1865', label: '1865', color: 'hsl(35, 50%, 40%)' },
  { id: '1900s', label: '1900s', color: 'hsl(30, 30%, 50%)' },
  { id: '1950s', label: '1950s', color: 'hsl(0, 0%, 60%)' },
  { id: '1960s', label: '1960s', color: 'hsl(30, 70%, 50%)' },
  { id: '1970s', label: '1970s', color: 'hsl(25, 80%, 45%)' },
  { id: '1980s', label: '1980s', color: 'hsl(300, 80%, 50%)' },
  { id: '1990s', label: '1990s', color: 'hsl(180, 80%, 40%)' },
  { id: '2000s', label: '2000s', color: 'hsl(210, 80%, 50%)' },
  { id: 'Homeless', label: 'HOMELESS', color: 'hsl(40, 30%, 35%)' },
  { id: 'Day One', label: 'DAY ONE', color: 'hsl(185, 100%, 50%)' },
];

export function HoloSceneSelector({ selectedEras, onToggleEra, onSelectAll, onSelectNone }: HoloSceneSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div
      className="fixed top-24 right-56 z-40"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {/* Trigger button */}
      <motion.button
        className="flex items-center gap-2 px-4 py-2 rounded font-mono text-xs tracking-wider"
        style={{
          background: 'linear-gradient(180deg, rgba(0, 10, 20, 0.9) 0%, rgba(0, 20, 40, 0.95) 100%)',
          border: '1px solid rgba(0, 240, 255, 0.4)',
          color: 'hsl(185, 100%, 50%)',
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.2)',
        }}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ 
          boxShadow: '0 0 30px rgba(0, 240, 255, 0.4)',
          borderColor: 'rgba(0, 240, 255, 0.6)',
        }}
        whileTap={{ scale: 0.98 }}
      >
        <Grid3X3 size={14} />
        <span>SCENES [{selectedEras.size}]</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={14} />
        </motion.div>
      </motion.button>
      
      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full right-0 mt-2 w-72"
            initial={{ opacity: 0, y: -10, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -10, rotateX: -15 }}
            transition={{ duration: 0.3 }}
            style={{ perspective: '1000px' }}
          >
            {/* Holographic glow */}
            <div
              className="absolute -inset-2 rounded-lg opacity-40"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(168, 85, 247, 0.2))',
                filter: 'blur(10px)',
              }}
            />
            
            {/* Main panel */}
            <div
              className="relative rounded-lg overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(0, 10, 20, 0.95) 0%, rgba(0, 20, 40, 0.98) 100%)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(0, 240, 255, 0.05)',
              }}
            >
              {/* Header */}
              <div 
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: '1px solid rgba(0, 240, 255, 0.2)' }}
              >
                <span className="font-mono text-xs text-[hsl(185,100%,50%)] tracking-wider">
                  SELECT ERA
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={onSelectAll}
                    className="font-mono text-[10px] text-[hsl(152,70%,50%)] hover:text-[hsl(152,70%,70%)] tracking-wider"
                  >
                    ALL
                  </button>
                  <span className="text-[hsl(185,100%,50%)] opacity-30">/</span>
                  <button
                    onClick={onSelectNone}
                    className="font-mono text-[10px] text-[hsl(330,100%,60%)] hover:text-[hsl(330,100%,80%)] tracking-wider"
                  >
                    NONE
                  </button>
                </div>
              </div>
              
              {/* Era grid */}
              <div className="grid grid-cols-2 gap-2 p-4">
                {ERAS.map((era) => {
                  const isSelected = selectedEras.has(era.id);
                  
                  return (
                    <motion.button
                      key={era.id}
                      className="relative flex items-center justify-between px-3 py-2 rounded font-mono text-xs tracking-wider"
                      style={{
                        background: isSelected 
                          ? `linear-gradient(135deg, ${era.color}33, ${era.color}22)` 
                          : 'rgba(0, 0, 0, 0.3)',
                        border: `1px solid ${isSelected ? era.color : 'rgba(255, 255, 255, 0.1)'}`,
                        color: isSelected ? era.color : 'rgba(255, 255, 255, 0.5)',
                        boxShadow: isSelected ? `0 0 15px ${era.color}44` : 'none',
                      }}
                      onClick={() => onToggleEra(era.id)}
                      whileHover={{ 
                        scale: 1.02,
                        borderColor: era.color,
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{era.label}</span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check size={12} style={{ color: era.color }} />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              
              {/* Footer status */}
              <div 
                className="flex items-center justify-center px-4 py-2"
                style={{ borderTop: '1px solid rgba(0, 240, 255, 0.2)' }}
              >
                <span className="font-mono text-[10px] text-[hsl(185,100%,50%)] opacity-60 tracking-wider">
                  {selectedEras.size} ERA{selectedEras.size !== 1 ? 'S' : ''} SELECTED
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
