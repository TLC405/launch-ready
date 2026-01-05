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
    </div>
  );
}
