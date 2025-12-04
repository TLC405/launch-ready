import { useNavigate } from "react-router-dom";
import { Play, Disc3, Radio } from "lucide-react";
import era1950sGlamour from "@/assets/era-1950s-glamour.jpg";
import era1960s from "@/assets/era-1960s.jpg";
import era1970s from "@/assets/era-1970s.jpg";
import era1900s from "@/assets/era-1900s.jpg";

const eraTiles = [
  { id: "1900s", label: "Tesla & Einstein", image: era1900s },
  { id: "1950s", label: "Marilyn Monroe", image: era1950sGlamour },
  { id: "1960s", label: "The Movement", image: era1960s },
  { id: "1970s", label: "Disco Era", image: era1970s },
];

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 px-6">
      <div className="max-w-7xl w-full mx-auto">
        <div className="grid lg:grid-cols-[1.4fr,1fr] gap-12 lg:gap-16 items-center">
          
          {/* Hi-Fi Unit / Boombox Body */}
          <div className="relative">
            {/* Main Unit */}
            <div className="surface-metal rounded-3xl p-8 lg:p-10 border-metallic">
              
              {/* Top Bar - Logo & Status */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Disc3 className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl tracking-wider text-platinum">REWIND</h2>
                    <p className="text-xs text-muted-foreground tracking-widest">PLATINUM PLAYER</p>
                  </div>
                </div>
                
                {/* VU Meters */}
                <div className="hidden sm:flex items-end gap-1 h-8">
                  {[0.4, 0.7, 0.9, 0.6, 0.8, 0.5, 0.7].map((h, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-gradient-to-t from-emerald-600 via-yellow-500 to-red-500 rounded-full"
                      style={{ 
                        height: `${h * 100}%`,
                        animation: `vuPulse ${0.5 + i * 0.1}s ease-in-out infinite`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Screen / Era Display */}
              <div className="surface-inset rounded-xl p-4 mb-8 screen-glow">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {eraTiles.map((era, i) => (
                    <button
                      key={era.id}
                      onClick={() => navigate("/lab")}
                      className="album-tile group relative aspect-square rounded-lg overflow-hidden"
                    >
                      <img
                        src={era.image}
                        alt={era.label}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-[10px] text-silver-muted uppercase tracking-wider">{era.id}</p>
                        <p className="text-xs text-foreground font-medium truncate">{era.label}</p>
                      </div>
                      {/* Silver frame on hover */}
                      <div className="absolute inset-0 border border-transparent group-hover:border-silver/40 rounded-lg transition-colors duration-300" />
                    </button>
                  ))}
                </div>
                
                {/* Now Playing Bar */}
                <div className="mt-4 flex items-center gap-3 px-2">
                  <Radio className="w-4 h-4 text-primary animate-pulse" />
                  <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-gradient-to-r from-primary to-accent rounded-full" />
                  </div>
                  <span className="text-xs text-muted-foreground">8 ERAS</span>
                </div>
              </div>

              {/* Control Panel */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate("/lab")}
                  className="btn-gold flex items-center gap-2"
                >
                  <Play className="w-5 h-5" fill="currentColor" />
                  <span>ENTER LAB</span>
                </button>
                
                <button
                  onClick={() => navigate("/auth")}
                  className="btn-record flex items-center gap-2 text-silver"
                >
                  <span>SIGN IN</span>
                </button>

                {/* Indicator Lights */}
                <div className="ml-auto flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                    <span className="text-[10px] text-muted-foreground uppercase">Ready</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_hsla(var(--primary),0.6)]" />
                    <span className="text-[10px] text-muted-foreground uppercase">AI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TLC Badge */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-card border border-border rounded-full">
              <p className="text-[10px] text-muted-foreground tracking-[0.2em]">
                <span className="text-primary">T</span>LC STUDIOS • PLATINUM COLLECTION
              </p>
            </div>
          </div>

          {/* Right Side - Copy & Info */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 animate-fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-primary tracking-wide">
                AI-Powered Time Travel
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl animate-fade-up delay-100">
              <span className="text-chrome block">STEP INTO</span>
              <span className="text-gradient-gold">HISTORY</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-md animate-fade-up delay-200">
              Experience legendary moments from the 1900s to today. 
              Our AI seamlessly places you alongside history's greatest icons.
            </p>

            {/* TLC Easter Egg */}
            <p className="text-sm text-muted-foreground/70 animate-fade-up delay-300">
              <span className="text-primary">T</span>ransform yourself. 
              <span className="text-silver"> L</span>egendary eras await. 
              <span className="text-accent"> C</span>reate your history.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-4 animate-fade-up delay-400">
              {[
                { value: "10+", label: "Celebrity Scenes" },
                { value: "8", label: "Historic Eras" },
                { value: "∞", label: "Possibilities" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="font-display text-2xl md:text-3xl text-platinum">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
