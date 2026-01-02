import synthwaveBackground from '@/assets/synthwave-background.png';

function PremiumBackground3D() {
  return (
    <div className="fixed inset-0 z-0">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${synthwaveBackground})`,
        }}
      />
      
      {/* Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-start pt-[8vh]">
        {/* REWIND Title */}
        <h1
          className="text-[12vw] md:text-[10vw] font-black tracking-wider"
          style={{
            fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
            background: 'linear-gradient(180deg, #00f0ff 0%, #a855f7 50%, #ff2975 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 30px rgba(0, 240, 255, 0.8)) drop-shadow(0 6px 0 rgba(168, 85, 247, 0.7)) drop-shadow(0 12px 0 rgba(255, 41, 117, 0.5))',
            letterSpacing: '0.05em',
          }}
        >
          REWIND
        </h1>
        
        {/* by TLC */}
        <p
          className="text-[3vw] md:text-[2vw] font-semibold tracking-[0.4em] -mt-2 md:-mt-4"
          style={{
            fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
            background: 'linear-gradient(180deg, #00f0ff 0%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 15px rgba(0, 240, 255, 0.6))',
          }}
        >
          by TLC
        </p>
      </div>
    </div>
  );
}

export default PremiumBackground3D;
