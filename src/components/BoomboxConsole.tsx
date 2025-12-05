import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { eraConfig, eraOrder, EraId } from '@/lib/decadePrompts';

function VUMeter({ level, side }: { level: number; side: 'L' | 'R' }) {
  return (
    <div className="relative">
      {/* Label */}
      <p className="text-[6px] tracking-[0.3em] text-zinc-600 mb-1.5 text-center font-mono">{side}</p>
      
      {/* Meter housing */}
      <div className="relative p-1 rounded-lg bg-gradient-to-b from-zinc-900 to-black">
        {/* Inner bezel */}
        <div className="absolute inset-0.5 rounded-lg border border-zinc-800/50" />
        
        {/* LED bars */}
        <div className="flex gap-[2px] items-end h-12 px-1">
          {[...Array(14)].map((_, i) => {
            const isActive = i < level;
            const isHot = i > 11;
            const isWarm = i > 8;
            return (
              <motion.div
                key={i}
                className={`w-[3px] rounded-[1px] ${
                  isActive
                    ? isHot 
                      ? 'bg-gradient-to-t from-red-600 to-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)]' 
                      : isWarm 
                        ? 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.6)]' 
                        : 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_0_4px_rgba(16,185,129,0.5)]'
                    : 'bg-zinc-900'
                }`}
                animate={{ 
                  height: isActive ? 6 + i * 2.8 : 4,
                  opacity: isActive ? 1 : 0.2
                }}
                transition={{ duration: 0.08, delay: i * 0.01 }}
              />
            );
          })}
        </div>
        
        {/* Reflection */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-lg pointer-events-none" />
      </div>
    </div>
  );
}

function RotaryKnob({ value, label }: { value: number; label: string }) {
  const rotation = (value / 100) * 270 - 135;
  
  return (
    <div className="relative group">
      {/* Outer ring with notches */}
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 p-[2px] shadow-xl">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-zinc-850 to-zinc-950 relative overflow-hidden">
          {/* Indicator notches */}
          {[...Array(11)].map((_, i) => {
            const angle = (i / 10) * 270 - 135;
            const isActive = (i / 10) * 100 <= value;
            return (
              <div
                key={i}
                className={`absolute w-[2px] h-[6px] rounded-full transition-colors ${
                  isActive ? 'bg-gold' : 'bg-zinc-700'
                }`}
                style={{
                  top: '6%',
                  left: '50%',
                  transformOrigin: '50% 450%',
                  transform: `translateX(-50%) rotate(${angle}deg)`
                }}
              />
            );
          })}
          
          {/* Knob body */}
          <div className="absolute inset-[15%] rounded-full bg-gradient-to-br from-zinc-600 via-zinc-700 to-zinc-800 shadow-inner">
            {/* Grip ridges */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-[1px] bg-zinc-500/30"
                style={{
                  top: '50%',
                  transform: `rotate(${i * 30}deg)`
                }}
              />
            ))}
            
            {/* Center cap */}
            <div className="absolute inset-[25%] rounded-full bg-gradient-to-br from-zinc-500 to-zinc-700" />
          </div>
          
          {/* Pointer */}
          <motion.div
            className="absolute w-[3px] h-[18px] rounded-full bg-gradient-to-b from-gold via-gold to-gold-muted"
            style={{
              top: '8%',
              left: '50%',
              transformOrigin: '50% 280%'
            }}
            animate={{ rotate: rotation }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          />
        </div>
      </div>
      
      {/* Label */}
      <p className="text-[7px] tracking-[0.3em] text-zinc-600 text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
        {label}
      </p>
    </div>
  );
}

export function BoomboxConsole() {
  const navigate = useNavigate();
  const [activeEra, setActiveEra] = useState<EraId>('1980s');
  const [vuLevels, setVuLevels] = useState([7, 8]);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVuLevels([
        Math.floor(Math.random() * 6) + 6,
        Math.floor(Math.random() * 6) + 7
      ]);
    }, 120);
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
      className="relative w-full max-w-xl mx-auto"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Ambient glow */}
      <div className="absolute -inset-12 rounded-[60px] bg-gradient-to-br from-gold/5 via-transparent to-gold/5 blur-3xl" />
      
      {/* Shadow */}
      <div className="absolute -inset-4 rounded-3xl bg-black/60 blur-2xl" />

      {/* Main body */}
      <div 
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ 
          background: 'linear-gradient(160deg, hsl(230 12% 12%), hsl(230 12% 6%), hsl(230 12% 4%))'
        }}
      >
        {/* Chrome bezel top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-zinc-400/30 to-transparent" />
        
        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Top section - Brand & VU Meters */}
          <div className="flex items-start justify-between mb-6">
            {/* Brand */}
            <div className="flex items-center gap-4">
              {/* Power LED */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center border border-zinc-700/50">
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)] animate-pulse" />
              </div>
              
              <div>
                <p className="text-[7px] tracking-[0.5em] text-zinc-600 font-mono">TEMPORAL LOOP CONTROL</p>
                <p className="text-2xl font-bold tracking-[0.25em] text-gradient-gold">TLC REWIND</p>
              </div>
            </div>
            
            {/* VU Meters */}
            <div className="flex items-center gap-4">
              <VUMeter level={vuLevels[0]} side="L" />
              <VUMeter level={vuLevels[1]} side="R" />
            </div>
          </div>

          {/* Main Display */}
          <div className="relative rounded-xl overflow-hidden mb-6">
            {/* Display housing */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-950" />
            
            {/* Screen bezel */}
            <div className="absolute inset-0 border border-zinc-800 rounded-xl" />
            <div className="absolute inset-[2px] border border-zinc-900/50 rounded-xl" />
            
            {/* Glass reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
            
            {/* Scanlines */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)'
              }}
            />
            
            {/* Content */}
            <div className="relative p-8 sm:p-10">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeEra}
                  className="text-center"
                  initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Era year */}
                  <div className="relative inline-block">
                    <span 
                      className={`text-7xl sm:text-8xl font-bold tracking-wider bg-gradient-to-r ${currentEra.gradient} bg-clip-text text-transparent`}
                    >
                      {currentEra.year}
                    </span>
                    <div className={`absolute -inset-6 bg-gradient-to-r ${currentEra.gradient} opacity-20 blur-2xl -z-10`} />
                  </div>
                  
                  {/* Era name */}
                  <h3 className="text-2xl font-bold text-foreground/80 tracking-[0.2em] mt-4">
                    {currentEra.name}
                  </h3>
                </motion.div>
              </AnimatePresence>

              {/* Era dots */}
              <div className="flex justify-center gap-2 mt-8">
                {eraOrder.map((era) => (
                  <button
                    key={era}
                    onClick={() => setActiveEra(era)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      era === activeEra 
                        ? 'bg-gold shadow-[0_0_10px_rgba(201,169,98,0.9)] scale-125' 
                        : 'bg-zinc-800 hover:bg-zinc-700'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Screen glow */}
            <div className={`absolute inset-0 pointer-events-none opacity-15 bg-gradient-to-r ${currentEra.gradient} mix-blend-overlay`} />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <RotaryKnob value={40} label="TIME" />
            
            {/* Center controls */}
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-600/50 flex items-center justify-center hover:border-zinc-500 transition-all shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-zinc-400" />
                ) : (
                  <Play className="w-4 h-4 text-zinc-400 ml-0.5" />
                )}
              </button>
              
              {/* Main CTA */}
              <motion.button
                onClick={() => navigate('/lab')}
                className="relative px-12 py-4 rounded-lg overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-gold/30 via-gold/50 to-gold/30 blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
                
                {/* Button layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold via-gold to-gold-muted" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute inset-px rounded-lg bg-gradient-to-br from-white/30 to-transparent" />
                
                {/* Shine */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                
                {/* Text */}
                <span className="relative flex items-center gap-3 text-background font-bold tracking-[0.25em]">
                  <Play className="w-5 h-5 fill-current" />
                  BEGIN
                </span>
              </motion.button>
            </div>
            
            <RotaryKnob value={75} label="VOL" />
          </div>
        </div>

        {/* Bottom trim */}
        <div className="h-2 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900" />
        
        {/* Corner screws */}
        {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos, i) => (
          <div 
            key={i} 
            className={`absolute ${pos} w-3 h-3 rounded-full`}
            style={{
              background: 'linear-gradient(145deg, hsl(230 10% 30%), hsl(230 10% 20%))'
            }}
          >
            <div className="absolute inset-[2px] rounded-full bg-zinc-800" />
            <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-zinc-600 to-zinc-700" />
            <div className="absolute inset-[40%] bg-zinc-800 rotate-45" />
          </div>
        ))}
      </div>

      {/* Speaker grilles */}
      <div className="flex justify-between mt-6 px-6">
        {[0, 1].map(i => (
          <div key={i} className="relative">
            {/* Shadow */}
            <div className="absolute -inset-3 rounded-full bg-black/40 blur-xl" />
            
            {/* Speaker housing */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700/50 overflow-hidden relative">
              {/* Grille pattern */}
              <div 
                className="absolute inset-2 rounded-full"
                style={{
                  background: 'repeating-radial-gradient(circle at center, transparent 0, transparent 3px, rgba(0,0,0,0.5) 3px, rgba(0,0,0,0.5) 6px)'
                }}
              />
              
              {/* Center dome */}
              <div className="absolute inset-[30%] rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 shadow-lg" />
              
              {/* Reflection */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}