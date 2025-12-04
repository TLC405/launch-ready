import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Radio, Disc3, Volume2 } from 'lucide-react';
import { eraConfig, eraOrder, EraId } from '@/lib/decadePrompts';

interface VUMeterProps {
  level: number;
  color?: string;
}

function VUMeter({ level, color = 'gold' }: VUMeterProps) {
  return (
    <div className="flex gap-0.5 items-end h-8">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className={`w-1.5 rounded-sm ${
            i < level 
              ? i > 7 ? 'bg-red-500' : i > 5 ? 'bg-yellow-500' : 'bg-emerald-500'
              : 'bg-muted/30'
          }`}
          initial={{ height: 4 }}
          animate={{ height: i < level ? 8 + i * 2.5 : 4 }}
          transition={{ duration: 0.15, delay: i * 0.02 }}
        />
      ))}
    </div>
  );
}

function TimeDial({ activeEra }: { activeEra: EraId }) {
  const activeIndex = eraOrder.indexOf(activeEra);
  const rotation = (activeIndex / (eraOrder.length - 1)) * 270 - 135;

  return (
    <div className="relative w-20 h-20">
      {/* Dial background */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 shadow-inner" />
      
      {/* Dial markers */}
      {eraOrder.map((_, i) => {
        const angle = (i / (eraOrder.length - 1)) * 270 - 135;
        return (
          <div
            key={i}
            className="absolute w-1 h-2 bg-zinc-500 rounded-full"
            style={{
              top: '10%',
              left: '50%',
              transformOrigin: '50% 300%',
              transform: `translateX(-50%) rotate(${angle}deg)`
            }}
          />
        );
      })}
      
      {/* Dial needle */}
      <motion.div
        className="absolute w-1 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full shadow-lg"
        style={{
          top: '15%',
          left: '50%',
          transformOrigin: '50% 85%'
        }}
        animate={{ rotate: rotation }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      />
      
      {/* Center cap */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 border border-zinc-500" />
    </div>
  );
}

export function BoomboxConsole() {
  const navigate = useNavigate();
  const [activeEra, setActiveEra] = useState<EraId>('1980s');
  const [vuLevels, setVuLevels] = useState([5, 6]);
  const [isHovered, setIsHovered] = useState(false);

  // Animate VU meters
  useEffect(() => {
    const interval = setInterval(() => {
      setVuLevels([
        Math.floor(Math.random() * 4) + 4,
        Math.floor(Math.random() * 4) + 5
      ]);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Cycle through eras
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveEra(prev => {
        const currentIndex = eraOrder.indexOf(prev);
        return eraOrder[(currentIndex + 1) % eraOrder.length];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentEra = eraConfig[activeEra];

  return (
    <motion.div
      className="relative w-full max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main boombox body */}
      <div className="surface-metal rounded-2xl p-6 border-metallic">
        {/* Top section - branding */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-medium tracking-[0.3em] text-muted-foreground">TLC</span>
          </div>
          <motion.h2 
            className="text-3xl font-bold tracking-wider text-gradient-gold"
            animate={{ textShadow: isHovered ? '0 0 30px rgba(217, 164, 78, 0.5)' : '0 0 10px rgba(217, 164, 78, 0.2)' }}
          >
            REWIND
          </motion.h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium tracking-wider text-muted-foreground">PLATINUM</span>
            <Disc3 className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        {/* Display screen */}
        <div className="surface-inset rounded-lg p-4 mb-4 screen-glow">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <TimeDial activeEra={activeEra} />
              <div>
                <p className="text-[10px] tracking-[0.2em] text-muted-foreground mb-1">ERA TUNER</p>
                <motion.p 
                  key={activeEra}
                  className="text-sm font-semibold text-foreground"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {currentEra.year}
                </motion.p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-[10px] tracking-wider text-muted-foreground mb-1">L</p>
                <VUMeter level={vuLevels[0]} />
              </div>
              <div className="text-center">
                <p className="text-[10px] tracking-wider text-muted-foreground mb-1">R</p>
                <VUMeter level={vuLevels[1]} />
              </div>
            </div>
          </div>

          {/* Era display */}
          <motion.div 
            key={activeEra}
            className="text-center py-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className={`text-xs tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r ${currentEra.gradient} mb-1`}>
              {currentEra.year}
            </p>
            <h3 className="text-2xl font-bold text-foreground tracking-wide mb-2">
              {currentEra.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {currentEra.tagline}
            </p>
          </motion.div>

          {/* Scanlines overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20 rounded-lg overflow-hidden">
            <div className="w-full h-full" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
            }} />
          </div>
        </div>

        {/* Control labels */}
        <div className="flex justify-between text-[9px] tracking-[0.2em] text-muted-foreground mb-3 px-2">
          <span>TIME DIAL</span>
          <span>ERA SELECTOR</span>
          <span>VOLUME</span>
        </div>

        {/* Bottom controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Fake knob left */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-600 shadow-lg flex items-center justify-center">
            <div className="w-1 h-3 bg-zinc-400 rounded-full transform -translate-y-1" />
          </div>

          {/* Main BEGIN REWIND button */}
          <motion.button
            onClick={() => navigate('/lab')}
            className="flex-1 btn-gold flex items-center justify-center gap-3 py-5 text-lg rounded-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-6 h-6 fill-current" />
            <span className="tracking-[0.15em]">BEGIN REWIND</span>
          </motion.button>

          {/* Fake knob right */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-600 shadow-lg flex items-center justify-center">
            <Volume2 className="w-4 h-4 text-zinc-400" />
          </div>
        </div>

        {/* Decorative screws */}
        {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-2 h-2 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 border border-zinc-500`}>
            <div className="absolute inset-0.5 rounded-full bg-zinc-700" />
          </div>
        ))}
      </div>

      {/* Speaker grilles */}
      <div className="flex justify-between mt-4">
        {[0, 1].map(i => (
          <div key={i} className="w-20 h-20 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 p-2">
            <div className="w-full h-full rounded-full" style={{
              background: 'repeating-radial-gradient(circle at center, transparent 0, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
            }} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
