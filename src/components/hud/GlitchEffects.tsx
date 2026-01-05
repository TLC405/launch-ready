import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export function GlitchEffects() {
  const [glitchActive, setGlitchActive] = useState(false);
  
  useEffect(() => {
    // Random glitch bursts every 8-15 seconds
    const triggerGlitch = () => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
      
      const nextGlitch = 8000 + Math.random() * 7000;
      setTimeout(triggerGlitch, nextGlitch);
    };
    
    const timeout = setTimeout(triggerGlitch, 5000);
    return () => clearTimeout(timeout);
  }, []);
  
  return (
    <AnimatePresence>
      {glitchActive && (
        <>
          {/* Chromatic aberration burst */}
          <motion.div
            className="pointer-events-none fixed inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: 'linear-gradient(90deg, rgba(255, 0, 0, 0.1), transparent 33%, rgba(0, 255, 255, 0.1))',
              mixBlendMode: 'screen',
            }}
          />
          
          {/* Horizontal displacement lines */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="pointer-events-none fixed left-0 right-0 z-30"
              initial={{ opacity: 0, x: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                x: [0, (Math.random() - 0.5) * 20, 0],
              }}
              style={{
                top: `${15 + i * 18}%`,
                height: `${2 + Math.random() * 4}px`,
                background: `linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.5), rgba(255, 41, 117, 0.5), transparent)`,
              }}
              transition={{ duration: 0.15 }}
            />
          ))}
        </>
      )}
    </AnimatePresence>
  );
}

// Floating data fragments
export function DataFragments() {
  const fragments = [
    'NEURAL_LINK::OK',
    'SYS.CHECK//TRUE',
    'MEM:0xFF4A2C',
    'TIME.LOCK',
    '◢◣ ACTIVE',
    'BIOMETRIC_ID',
    'DECRYPT::RUN',
  ];
  
  return (
    <div className="pointer-events-none fixed inset-0 z-5 overflow-hidden">
      {fragments.map((text, i) => (
        <motion.div
          key={i}
          className="absolute font-mono text-[10px] opacity-20"
          style={{
            color: i % 2 === 0 ? 'hsl(185, 100%, 50%)' : 'hsl(330, 100%, 60%)',
            left: `${10 + (i * 12)}%`,
            top: `${20 + (i * 10)}%`,
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        >
          {text}
        </motion.div>
      ))}
    </div>
  );
}
