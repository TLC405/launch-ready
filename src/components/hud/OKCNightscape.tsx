import { motion } from 'framer-motion';
import okcSkyline from '@/assets/okc-night-skyline.png';

export function OKCNightscape() {
  return (
    <div className="fixed inset-0 z-0">
      {/* OKC Night Skyline background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${okcSkyline})`,
        }}
      />
      
      {/* Subtle animated color overlay for cyberpunk effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(0, 10, 20, 0.3) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(10, 0, 20, 0.4) 100%)',
          mixBlendMode: 'overlay',
        }}
      />
      
      {/* Atmospheric haze at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1/3"
        style={{
          background: 'linear-gradient(0deg, rgba(0, 240, 255, 0.05) 0%, transparent 100%)',
        }}
      />
      
      {/* "by TLC" branding on Devon Tower area */}
      <motion.div
        className="absolute right-[15%] top-[25%] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1 }}
      >
        <motion.span
          className="font-display text-2xl tracking-[0.3em] font-bold"
          style={{
            color: 'rgba(0, 240, 255, 0.9)',
            textShadow: `
              0 0 10px rgba(0, 240, 255, 0.8),
              0 0 20px rgba(0, 240, 255, 0.6),
              0 0 40px rgba(0, 240, 255, 0.4),
              0 0 60px rgba(168, 85, 247, 0.3)
            `,
            WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.3)',
          }}
          animate={{
            textShadow: [
              `0 0 10px rgba(0, 240, 255, 0.8), 0 0 20px rgba(0, 240, 255, 0.6), 0 0 40px rgba(0, 240, 255, 0.4), 0 0 60px rgba(168, 85, 247, 0.3)`,
              `0 0 15px rgba(0, 240, 255, 1), 0 0 30px rgba(0, 240, 255, 0.8), 0 0 50px rgba(0, 240, 255, 0.5), 0 0 70px rgba(168, 85, 247, 0.4)`,
              `0 0 10px rgba(0, 240, 255, 0.8), 0 0 20px rgba(0, 240, 255, 0.6), 0 0 40px rgba(0, 240, 255, 0.4), 0 0 60px rgba(168, 85, 247, 0.3)`,
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          by TLC
        </motion.span>
      </motion.div>
    </div>
  );
}
