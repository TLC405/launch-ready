import { motion } from 'framer-motion';

export function Scanlines() {
  return (
    <>
      {/* CRT Scanlines */}
      <div 
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.15) 2px,
            rgba(0, 0, 0, 0.15) 4px
          )`,
        }}
      />
      
      {/* Horizontal scan line animation */}
      <motion.div
        className="pointer-events-none fixed left-0 right-0 h-[2px] z-20"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.3), transparent)',
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.5)',
        }}
        animate={{
          top: ['0%', '100%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* CRT screen curve vignette */}
      <div 
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.4) 100%)',
        }}
      />
    </>
  );
}
