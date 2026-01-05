import { motion } from 'framer-motion';
import { Zap, Download, Loader2 } from 'lucide-react';

interface DashboardClusterProps {
  sourceImage: string | null;
  selectedEras: Set<string>;
  isGenerating: boolean;
  progress: number;
  completedCount: number;
  onEngage: () => void;
  onDownload: () => void;
}

export function DashboardCluster({
  sourceImage,
  selectedEras,
  isGenerating,
  progress,
  completedCount,
  onEngage,
  onDownload,
}: DashboardClusterProps) {
  const canEngage = sourceImage && selectedEras.size > 0 && !isGenerating;
  const canDownload = completedCount > 0 && !isGenerating;
  
  // Calculate flux capacitor value (system readiness)
  const fluxValue = sourceImage ? (selectedEras.size > 0 ? 88 : 44) : 0;
  
  // Temporal sync oscillates during generation
  const temporalSync = isGenerating ? progress : (sourceImage ? 100 : 0);
  
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7 }}
    >
      {/* Dashboard background */}
      <div
        className="relative h-36 flex items-center justify-center gap-6 px-6"
        style={{
          background: 'linear-gradient(0deg, rgba(5, 5, 15, 0.98) 0%, rgba(10, 15, 25, 0.95) 70%, transparent 100%)',
          borderTop: '2px solid rgba(0, 240, 255, 0.3)',
        }}
      >
        {/* Glow line */}
        <div 
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.5), rgba(168, 85, 247, 0.5), rgba(255, 41, 117, 0.5), transparent)',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)',
          }}
        />
        
        {/* Left cluster - FLUX CAPACITOR + TEMPORAL SYNC */}
        <div className="flex gap-4 items-end">
          <AnalogGauge 
            label="FLUX CAPACITOR" 
            value={fluxValue} 
            max={100} 
            color="hsl(185, 100%, 50%)" 
            isActive={isGenerating}
          />
          <AnalogGauge 
            label="TEMPORAL SYNC" 
            value={temporalSync} 
            max={100} 
            color="hsl(270, 80%, 60%)" 
            suffix="%" 
            isActive={isGenerating}
          />
        </div>
        
        {/* Center buttons */}
        <div className="flex flex-col items-center gap-2">
          {/* Digital readouts above buttons */}
          <div className="flex gap-8">
            <DigitalReadout label="TIME LOCK" value={sourceImage ? "LOCKED" : "WAITING"} color={sourceImage ? "hsl(152, 70%, 50%)" : "hsl(0, 0%, 40%)"} />
            <DigitalReadout label="ERAS QUEUED" value={selectedEras.size.toString()} color="hsl(45, 100%, 50%)" />
          </div>
          
          <div className="flex gap-4">
            {/* ENGAGE button */}
            <motion.button
              className={`relative flex items-center gap-3 px-8 py-4 rounded font-display text-lg tracking-wider ${
                canEngage ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
              }`}
              style={{
                background: canEngage 
                  ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(168, 85, 247, 0.2))'
                  : 'rgba(50, 50, 60, 0.3)',
                border: `2px solid ${canEngage ? 'rgba(0, 240, 255, 0.6)' : 'rgba(100, 100, 110, 0.3)'}`,
                color: canEngage ? 'hsl(185, 100%, 70%)' : 'rgba(150, 150, 160, 0.5)',
                boxShadow: canEngage 
                  ? '0 0 30px rgba(0, 240, 255, 0.3), inset 0 0 20px rgba(0, 240, 255, 0.1)'
                  : 'none',
              }}
              onClick={canEngage ? onEngage : undefined}
              whileHover={canEngage ? { 
                scale: 1.05,
                boxShadow: '0 0 50px rgba(0, 240, 255, 0.5), inset 0 0 30px rgba(0, 240, 255, 0.2)',
              } : {}}
              whileTap={canEngage ? { scale: 0.98 } : {}}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>GENERATING...</span>
                </>
              ) : (
                <>
                  <Zap size={20} />
                  <span>ENGAGE TIME WARP</span>
                </>
              )}
            </motion.button>
            
            {/* DOWNLOAD button */}
            <motion.button
              className={`relative flex items-center gap-3 px-6 py-4 rounded font-display text-base tracking-wider ${
                canDownload ? 'cursor-pointer' : 'cursor-not-allowed opacity-30'
              }`}
              style={{
                background: canDownload 
                  ? 'linear-gradient(135deg, rgba(255, 41, 117, 0.2), rgba(168, 85, 247, 0.2))'
                  : 'rgba(50, 50, 60, 0.2)',
                border: `1px solid ${canDownload ? 'rgba(255, 41, 117, 0.5)' : 'rgba(100, 100, 110, 0.2)'}`,
                color: canDownload ? 'hsl(330, 100%, 70%)' : 'rgba(150, 150, 160, 0.4)',
                boxShadow: canDownload ? '0 0 20px rgba(255, 41, 117, 0.2)' : 'none',
              }}
              onClick={canDownload ? onDownload : undefined}
              whileHover={canDownload ? { 
                scale: 1.03,
                boxShadow: '0 0 40px rgba(255, 41, 117, 0.4)',
              } : {}}
              whileTap={canDownload ? { scale: 0.98 } : {}}
            >
              <Download size={18} />
              <span>DOWNLOAD [{completedCount}]</span>
            </motion.button>
          </div>
        </div>
        
        {/* Right cluster - PROGRESS + COMPLETE */}
        <div className="flex gap-4 items-end">
          <AnalogGauge 
            label="WARP PROGRESS" 
            value={Math.round(progress)} 
            max={100} 
            suffix="%" 
            color="hsl(45, 100%, 50%)" 
            isActive={isGenerating}
          />
          <AnalogGauge 
            label="PORTRAITS DONE" 
            value={completedCount} 
            max={Math.max(selectedEras.size, 1)} 
            color="hsl(330, 100%, 60%)" 
            isActive={false}
          />
        </div>
        
        {/* Progress bar */}
        {isGenerating && (
          <motion.div
            className="absolute top-0 left-0 h-[2px]"
            style={{
              background: 'linear-gradient(90deg, hsl(185, 100%, 50%), hsl(270, 80%, 60%), hsl(330, 100%, 60%))',
              boxShadow: '0 0 10px hsl(185, 100%, 50%)',
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        )}
      </div>
    </motion.div>
  );
}

interface AnalogGaugeProps {
  label: string;
  value: number;
  max: number;
  suffix?: string;
  color: string;
  isActive?: boolean;
}

function AnalogGauge({ label, value, max, suffix = '', color, isActive = false }: AnalogGaugeProps) {
  const percentage = Math.min((value / max) * 100, 100);
  // Needle rotation: -135° (min) to +135° (max) = 270° sweep
  const needleRotation = ((percentage / 100) * 270) - 135;
  
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-mono text-[8px] tracking-wider opacity-60 uppercase" style={{ color }}>
        {label}
      </span>
      <div className="relative w-20 h-14">
        {/* Gauge background - semicircle */}
        <svg viewBox="0 0 100 60" className="w-full h-full">
          {/* Chrome bezel */}
          <defs>
            <linearGradient id={`bezel-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(200, 200, 210, 0.3)" />
              <stop offset="50%" stopColor="rgba(100, 100, 110, 0.2)" />
              <stop offset="100%" stopColor="rgba(50, 50, 60, 0.3)" />
            </linearGradient>
          </defs>
          
          {/* Outer bezel ring */}
          <path
            d="M 10 55 A 40 40 0 0 1 90 55"
            fill="none"
            stroke={`url(#bezel-${label})`}
            strokeWidth="4"
          />
          
          {/* Background arc */}
          <path
            d="M 15 52 A 35 35 0 0 1 85 52"
            fill="none"
            stroke="rgba(50, 50, 60, 0.5)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          
          {/* Value arc */}
          <motion.path
            d="M 15 52 A 35 35 0 0 1 85 52"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="110"
            initial={{ strokeDashoffset: 110 }}
            animate={{ strokeDashoffset: 110 - (percentage / 100) * 110 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 4px ${color})` }}
          />
          
          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((tick, i) => {
            const angle = ((tick / 100) * 270 - 135) * (Math.PI / 180);
            const x1 = 50 + Math.cos(angle) * 32;
            const y1 = 52 + Math.sin(angle) * 32;
            const x2 = 50 + Math.cos(angle) * 38;
            const y2 = 52 + Math.sin(angle) * 38;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(200, 200, 210, 0.4)"
                strokeWidth="1"
              />
            );
          })}
        </svg>
        
        {/* Animated needle */}
        <motion.div
          className="absolute bottom-[6px] left-1/2 origin-bottom"
          style={{ width: 2, height: 28, marginLeft: -1 }}
          initial={{ rotate: -135 }}
          animate={{ 
            rotate: needleRotation,
            // Add slight oscillation when active
            ...(isActive && { 
              rotate: [needleRotation - 2, needleRotation + 2, needleRotation] 
            })
          }}
          transition={isActive ? { 
            duration: 0.3, 
            repeat: Infinity, 
            repeatType: "reverse" 
          } : { 
            type: "spring", 
            stiffness: 80, 
            damping: 12 
          }}
        >
          {/* Needle body */}
          <div 
            className="w-full h-full rounded-t-full"
            style={{
              background: `linear-gradient(to top, ${color}, rgba(255, 255, 255, 0.9))`,
              boxShadow: `0 0 8px ${color}`,
            }}
          />
          {/* Needle glow tip */}
          <div 
            className="absolute -top-1 left-1/2 w-2 h-2 rounded-full -translate-x-1/2"
            style={{
              background: color,
              boxShadow: `0 0 6px ${color}, 0 0 12px ${color}`,
            }}
          />
        </motion.div>
        
        {/* Center pivot */}
        <div 
          className="absolute bottom-[4px] left-1/2 w-3 h-3 rounded-full -translate-x-1/2"
          style={{
            background: 'linear-gradient(135deg, rgba(100, 100, 110, 0.8), rgba(50, 50, 60, 0.9))',
            border: '1px solid rgba(200, 200, 210, 0.3)',
          }}
        />
        
        {/* Digital value display */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
          <motion.span 
            className="font-mono text-xs font-bold tabular-nums"
            style={{ 
              color,
              textShadow: `0 0 8px ${color}`,
            }}
            animate={isActive ? { opacity: [1, 0.7, 1] } : {}}
            transition={isActive ? { duration: 0.5, repeat: Infinity } : {}}
          >
            {value}{suffix}
          </motion.span>
        </div>
      </div>
    </div>
  );
}

interface DigitalReadoutProps {
  label: string;
  value: string;
  color: string;
}

function DigitalReadout({ label, value, color }: DigitalReadoutProps) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-mono text-[7px] tracking-wider opacity-50 uppercase" style={{ color }}>
        {label}
      </span>
      <motion.div
        className="px-2 py-0.5 rounded"
        style={{
          background: 'rgba(0, 0, 0, 0.5)',
          border: `1px solid ${color}40`,
          boxShadow: `inset 0 0 10px ${color}20`,
        }}
      >
        <motion.span
          className="font-mono text-[10px] font-bold tracking-wider"
          style={{ 
            color,
            textShadow: `0 0 6px ${color}`,
          }}
          animate={{ opacity: [1, 0.8, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {value}
        </motion.span>
      </motion.div>
    </div>
  );
}
