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
  
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7 }}
    >
      {/* Dashboard background */}
      <div
        className="relative h-28 flex items-center justify-center gap-8 px-8"
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
        
        {/* Left gauges */}
        <div className="flex gap-6 items-center">
          <Gauge label="ERAS" value={selectedEras.size} max={10} color="hsl(185, 100%, 50%)" />
          <Gauge label="READY" value={sourceImage ? 100 : 0} max={100} suffix="%" color="hsl(152, 70%, 50%)" />
        </div>
        
        {/* Center buttons */}
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
        
        {/* Right gauges */}
        <div className="flex gap-6 items-center">
          <Gauge label="PROGRESS" value={Math.round(progress)} max={100} suffix="%" color="hsl(270, 80%, 60%)" />
          <Gauge label="COMPLETE" value={completedCount} max={selectedEras.size || 1} color="hsl(330, 100%, 60%)" />
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

interface GaugeProps {
  label: string;
  value: number;
  max: number;
  suffix?: string;
  color: string;
}

function Gauge({ label, value, max, suffix = '', color }: GaugeProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-mono text-[9px] tracking-wider opacity-50" style={{ color }}>
        {label}
      </span>
      <div className="relative w-16 h-16">
        {/* Background ring */}
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="26"
            fill="none"
            stroke="rgba(100, 100, 110, 0.2)"
            strokeWidth="4"
          />
          <motion.circle
            cx="32"
            cy="32"
            r="26"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 26}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - percentage / 100) }}
            transition={{ duration: 0.5 }}
            style={{
              filter: `drop-shadow(0 0 4px ${color})`,
            }}
          />
        </svg>
        {/* Value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-sm font-bold" style={{ color }}>
            {value}{suffix}
          </span>
        </div>
      </div>
    </div>
  );
}
