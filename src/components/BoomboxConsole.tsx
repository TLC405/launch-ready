import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2 } from 'lucide-react';
import { eraConfig, eraOrder, EraId } from '@/lib/decadePrompts';

function VUMeter({ level }: { level: number }) {
  return (
    <div className="flex gap-px items-end h-10">
      {[...Array(12)].map((_, i) => {
        const isActive = i < level;
        const isHot = i > 9;
        const isWarm = i > 6;
        return (
          <motion.div
            key={i}
            className={`w-1.5 rounded-sm ${
              isActive
                ? isHot ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' 
                : isWarm ? 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]' 
                : 'bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.3)]'
                : 'bg-zinc-800/50'
            }`}
            animate={{ 
              height: isActive ? 8 + i * 2.5 : 3,
              opacity: isActive ? 1 : 0.3
            }}
            transition={{ duration: 0.1, delay: i * 0.015 }}
          />
        );
      })}
    </div>
  );
}

function RotaryKnob({ value, label }: { value: number; label: string }) {
  const rotation = (value / 100) * 270 - 135;
  return (
    <div className="relative group">
      {/* Outer ring */}
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 p-0.5 shadow-lg">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 relative overflow-hidden">
          {/* Indicator notches */}
          {[...Array(11)].map((_, i) => {
            const angle = (i / 10) * 270 - 135;
            return (
              <div
                key={i}
                className="absolute w-0.5 h-1.5 bg-zinc-600"
                style={{
                  top: '8%',
                  left: '50%',
                  transformOrigin: '50% 400%',
                  transform: `translateX(-50%) rotate(${angle}deg)`
                }}
              />
            );
          })}
          {/* Pointer */}
          <motion.div
            className="absolute w-0.5 h-4 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"
            style={{
              top: '15%',
              left: '50%',
              transformOrigin: '50% 250%'
            }}
            animate={{ rotate: rotation }}
            transition={{ type: 'spring', stiffness: 150, damping: 20 }}
          />
          {/* Center cap */}
          <div className="absolute inset-[30%] rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 shadow-inner" />
        </div>
      </div>
      {/* Label */}
      <p className="text-[7px] tracking-[0.2em] text-zinc-500 text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">{label}</p>
    </div>
  );
}

export function BoomboxConsole() {
  const navigate = useNavigate();
  const [activeEra, setActiveEra] = useState<EraId>('1980s');
  const [vuLevels, setVuLevels] = useState([6, 7]);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVuLevels([
        Math.floor(Math.random() * 5) + 5,
        Math.floor(Math.random() * 5) + 6
      ]);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveEra(prev => {
        const currentIndex = eraOrder.indexOf(prev);
        return eraOrder[(currentIndex + 1) % eraOrder.length];
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentEra = eraConfig[activeEra];

  return (
    <motion.div
      className="relative w-full max-w-lg mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Solid backing for visibility */}
      <div className="absolute -inset-4 rounded-3xl bg-black/80 blur-xl" />
      
      {/* Ambient glow */}
      <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-transparent to-amber-500/10 blur-2xl" />

      {/* Main body */}
      <div className="relative rounded-2xl overflow-hidden border border-zinc-700/50 shadow-2xl" style={{ background: 'linear-gradient(145deg, hsl(230 12% 10%), hsl(230 12% 6%))' }}>
        {/* Chrome trim top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Inner padding */}
        <div className="p-5">
          {/* Top bar - Brand & VU meters */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center border border-zinc-600">
                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
              </div>
              <div>
                <p className="text-[8px] tracking-[0.4em] text-zinc-500">TLC</p>
                <p className="text-lg font-bold tracking-[0.2em] text-gradient-gold">REWIND</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[7px] tracking-wider text-zinc-600 mb-1">LEFT</p>
                <VUMeter level={vuLevels[0]} />
              </div>
              <div className="text-right">
                <p className="text-[7px] tracking-wider text-zinc-600 mb-1">RIGHT</p>
                <VUMeter level={vuLevels[1]} />
              </div>
            </div>
          </div>

          {/* Main display screen */}
          <div className="relative surface-inset rounded-xl overflow-hidden mb-4">
            {/* Screen glass effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
            
            {/* Scanlines */}
            <div className="absolute inset-0 pointer-events-none opacity-30" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)'
            }} />
            
            {/* Content */}
            <div className="relative p-6">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeEra}
                  className="text-center"
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Era year - big visual focus */}
                  <div className="relative inline-block">
                    <span className={`text-6xl font-bold tracking-wider bg-gradient-to-r ${currentEra.gradient} bg-clip-text text-transparent`}>
                      {currentEra.year}
                    </span>
                    <div className={`absolute -inset-4 bg-gradient-to-r ${currentEra.gradient} opacity-20 blur-xl -z-10`} />
                  </div>
                  
                  {/* Era name */}
                  <h3 className="text-xl font-bold text-foreground/90 tracking-[0.15em] mt-3">
                    {currentEra.name}
                  </h3>
                </motion.div>
              </AnimatePresence>

              {/* Era indicator dots */}
              <div className="flex justify-center gap-1.5 mt-6">
                {eraOrder.map((era, i) => (
                  <button
                    key={era}
                    onClick={() => setActiveEra(era)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      era === activeEra 
                        ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] scale-125' 
                        : 'bg-zinc-700 hover:bg-zinc-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Screen glow */}
            <div className={`absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-r ${currentEra.gradient} mix-blend-overlay`} />
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between">
            <RotaryKnob value={35} label="TIME" />
            
            {/* Center controls */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-600 flex items-center justify-center hover:border-zinc-500 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-zinc-400" />
                ) : (
                  <Play className="w-4 h-4 text-zinc-400 ml-0.5" />
                )}
              </button>
              
              {/* Main action button */}
              <motion.button
                onClick={() => navigate('/lab')}
                className="relative px-10 py-4 rounded-lg overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Button gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute inset-px rounded-lg bg-gradient-to-br from-amber-400/50 to-transparent" />
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                
                {/* Text */}
                <span className="relative flex items-center gap-3 text-black font-bold tracking-[0.2em]">
                  <Play className="w-5 h-5 fill-current" />
                  BEGIN
                </span>
              </motion.button>
            </div>
            
            <RotaryKnob value={70} label="VOL" />
          </div>
        </div>

        {/* Bottom trim */}
        <div className="h-1 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800" />
        
        {/* Corner screws */}
        {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-2.5 h-2.5 rounded-full bg-gradient-to-br from-zinc-500 to-zinc-700`}>
            <div className="absolute inset-0.5 rounded-full bg-zinc-800" />
            <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-zinc-600 to-zinc-700" />
          </div>
        ))}
      </div>

      {/* Speaker grilles */}
      <div className="flex justify-between mt-5 px-4">
        {[0, 1].map(i => (
          <div key={i} className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700 overflow-hidden">
              <div className="absolute inset-2 rounded-full" style={{
                background: 'repeating-radial-gradient(circle at center, transparent 0, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)'
              }} />
              {/* Center dust cap */}
              <div className="absolute inset-[30%] rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800" />
            </div>
            {/* Speaker shadow */}
            <div className="absolute -inset-2 rounded-full bg-black/30 blur-md -z-10" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}