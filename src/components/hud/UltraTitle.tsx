import { motion } from 'framer-motion';

export function UltraTitle() {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
      {/* Main REWIND title with maximum cyberpunk effects */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        {/* Glitch layer - red offset */}
        <motion.h1
          className="absolute font-display text-[10vw] md:text-[8vw] font-black tracking-wider select-none"
          style={{
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255, 0, 50, 0.5)',
            left: '2px',
            top: '2px',
          }}
          animate={{
            x: [0, -3, 0, 2, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatDelay: 4,
          }}
        >
          REWIND
        </motion.h1>
        
        {/* Glitch layer - cyan offset */}
        <motion.h1
          className="absolute font-display text-[10vw] md:text-[8vw] font-black tracking-wider select-none"
          style={{
            color: 'transparent',
            WebkitTextStroke: '1px rgba(0, 240, 255, 0.5)',
            left: '-2px',
            top: '-2px',
          }}
          animate={{
            x: [0, 3, 0, -2, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatDelay: 4,
            delay: 0.05,
          }}
        >
          REWIND
        </motion.h1>
        
        {/* Main title */}
        <h1
          className="relative font-display text-[10vw] md:text-[8vw] font-black tracking-wider"
          style={{
            background: 'linear-gradient(180deg, #00f0ff 0%, #ffffff 30%, #a855f7 60%, #ff2975 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 30px rgba(0, 240, 255, 0.8)) drop-shadow(0 0 60px rgba(168, 85, 247, 0.5))',
            letterSpacing: '0.08em',
          }}
        >
          REWIND
        </h1>
        
        {/* Scanline overlay on text */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
            mixBlendMode: 'overlay',
          }}
        />
      </motion.div>
      
      {/* Japanese subtitle */}
      <motion.p
        className="font-mono text-xs tracking-[0.5em] mt-1"
        style={{
          color: 'rgba(0, 240, 255, 0.6)',
          textShadow: '0 0 10px rgba(0, 240, 255, 0.5)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        リワインド
      </motion.p>
      
      {/* by TLC with holographic shimmer */}
      <motion.div
        className="mt-2 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <p
          className="font-display text-[3vw] md:text-[2vw] font-semibold tracking-[0.4em]"
          style={{
            background: 'linear-gradient(90deg, #00f0ff, #a855f7, #ff2975, #a855f7, #00f0ff)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'shimmer 3s linear infinite',
            filter: 'drop-shadow(0 0 15px rgba(0, 240, 255, 0.6))',
          }}
        >
          by TLC
        </p>
      </motion.div>
      
      {/* Status indicators */}
      <motion.div 
        className="flex gap-4 mt-3 font-mono text-[10px] tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span className="text-[hsl(185,100%,50%)] opacity-60">SYS::ONLINE</span>
        <span className="text-[hsl(270,80%,60%)] opacity-60">◈</span>
        <span className="text-[hsl(330,100%,60%)] opacity-60">TIME.WARP::READY</span>
      </motion.div>
    </div>
  );
}
