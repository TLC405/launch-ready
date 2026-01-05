import { motion } from 'framer-motion';

export function WindshieldFrame() {
  return (
    <>
      {/* Windshield border/frame */}
      <div className="pointer-events-none fixed inset-0 z-20">
        {/* Top frame */}
        <div 
          className="absolute top-0 left-0 right-0 h-16"
          style={{
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, transparent 100%)',
            borderBottom: '1px solid rgba(0, 240, 255, 0.2)',
          }}
        />
        
        {/* Bottom dashboard frame */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background: 'linear-gradient(0deg, rgba(10, 10, 20, 0.95) 0%, rgba(10, 10, 20, 0.8) 70%, transparent 100%)',
            borderTop: '2px solid rgba(0, 240, 255, 0.3)',
            boxShadow: 'inset 0 2px 30px rgba(0, 240, 255, 0.1)',
          }}
        />
        
        {/* Left pillar */}
        <div 
          className="absolute top-0 bottom-0 left-0 w-8"
          style={{
            background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.6) 0%, transparent 100%)',
          }}
        />
        
        {/* Right pillar */}
        <div 
          className="absolute top-0 bottom-0 right-0 w-8"
          style={{
            background: 'linear-gradient(-90deg, rgba(0, 0, 0, 0.6) 0%, transparent 100%)',
          }}
        />
      </div>
      
      {/* Corner HUD elements */}
      <HUDCorners />
      
      {/* Targeting reticle center */}
      <TargetingReticle />
    </>
  );
}

function HUDCorners() {
  return (
    <div className="pointer-events-none fixed inset-0 z-20 p-4">
      {/* Top-left corner bracket */}
      <div className="absolute top-4 left-4">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path
            d="M0 20 L0 0 L20 0"
            stroke="rgba(0, 240, 255, 0.5)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M5 15 L5 5 L15 5"
            stroke="rgba(0, 240, 255, 0.3)"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>
      
      {/* Top-right corner bracket */}
      <div className="absolute top-4 right-4">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path
            d="M60 20 L60 0 L40 0"
            stroke="rgba(0, 240, 255, 0.5)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M55 15 L55 5 L45 5"
            stroke="rgba(0, 240, 255, 0.3)"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>
      
      {/* Bottom-left corner bracket */}
      <div className="absolute bottom-36 left-4">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path
            d="M0 40 L0 60 L20 60"
            stroke="rgba(255, 41, 117, 0.5)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>
      
      {/* Bottom-right corner bracket */}
      <div className="absolute bottom-36 right-4">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path
            d="M60 40 L60 60 L40 60"
            stroke="rgba(255, 41, 117, 0.5)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}

function TargetingReticle() {
  return (
    <motion.div 
      className="pointer-events-none fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
      animate={{ opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        {/* Outer ring */}
        <circle
          cx="60"
          cy="60"
          r="55"
          stroke="rgba(0, 240, 255, 0.2)"
          strokeWidth="1"
          strokeDasharray="8 4"
          fill="none"
        />
        
        {/* Inner ring */}
        <circle
          cx="60"
          cy="60"
          r="35"
          stroke="rgba(0, 240, 255, 0.3)"
          strokeWidth="1"
          fill="none"
        />
        
        {/* Crosshairs */}
        <line x1="60" y1="0" x2="60" y2="25" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" />
        <line x1="60" y1="95" x2="60" y2="120" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" />
        <line x1="0" y1="60" x2="25" y2="60" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" />
        <line x1="95" y1="60" x2="120" y2="60" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" />
        
        {/* Center dot */}
        <circle cx="60" cy="60" r="3" fill="rgba(0, 240, 255, 0.5)" />
      </svg>
    </motion.div>
  );
}
