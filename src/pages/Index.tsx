import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Clock, Sparkles } from "lucide-react";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>TLC Studios REWIND | Time Travel Photography</title>
        <meta
          name="description"
          content="Step into history with TLC Studios REWIND. Create AI-generated portraits of yourself across legendary eras."
        />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden bg-[#0a0a0f]">
        {/* Synthwave Grid Background */}
        <div className="absolute inset-0 synthwave-grid opacity-40" />
        
        {/* Neon Glow Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-pink/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric-blue/20 rounded-full blur-[120px] animate-pulse delay-500" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-chrome-purple/30 rounded-full blur-[100px]" />

        {/* Sun/Horizon Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[300px] bg-gradient-to-t from-neon-pink/30 via-retro-orange/20 to-transparent rounded-t-full" />
        </div>

        {/* Scanlines Effect */}
        <div className="absolute inset-0 scanlines pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
          {/* TLC Easter Egg Badge */}
          <div className="mb-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-pink/50 bg-neon-pink/10 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-neon-pink animate-pulse" />
              <span className="text-sm text-neon-pink tracking-widest uppercase font-display">
                TLC Labs • Est. 2024
              </span>
            </div>
          </div>

          {/* Main Title - Chrome/Neon Style */}
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold text-center mb-4 animate-fade-up delay-100">
            <span className="text-chrome block leading-tight">REWIND</span>
          </h1>

          {/* Subtitle with neon glow */}
          <p className="text-xl md:text-2xl text-electric-blue font-display tracking-[0.3em] uppercase mb-2 animate-fade-up delay-200 text-glow-blue">
            Time Travel Lab
          </p>

          {/* TLC Hidden in tagline */}
          <p className="text-muted-foreground text-center max-w-xl mb-12 animate-fade-up delay-300">
            <span className="text-neon-pink">T</span>ransform yourself. 
            <span className="text-electric-blue"> L</span>egendary eras await. 
            <span className="text-chrome-purple"> C</span>reate your history.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-400">
            <Button
              onClick={() => navigate("/lab")}
              className="retro-button bg-gradient-to-r from-neon-pink to-chrome-purple text-white border-0 px-8 py-6 text-lg group"
              size="lg"
            >
              <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Enter The Lab
            </Button>
            <Button
              onClick={() => navigate("/auth")}
              variant="outline"
              className="border-electric-blue/50 text-electric-blue hover:bg-electric-blue/10 px-8 py-6 text-lg"
              size="lg"
            >
              <Clock className="w-5 h-5 mr-2" />
              Sign In
            </Button>
          </div>

          {/* Era Preview Strip */}
          <div className="mt-16 flex gap-4 animate-fade-up delay-500">
            {["1900s", "1950s", "1960s", "1970s", "1980s", "1990s", "2000s"].map((era, i) => (
              <div
                key={era}
                className="px-4 py-2 rounded-lg bg-card/30 backdrop-blur-sm border border-border/30 hover:border-neon-pink/50 transition-all cursor-default"
                style={{ animationDelay: `${600 + i * 100}ms` }}
              >
                <span className="font-display text-sm text-foreground">{era}</span>
              </div>
            ))}
          </div>

          {/* TLC Footer Easter Egg */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <p className="text-xs text-muted-foreground/50 tracking-widest">
              POWERED BY <span className="text-neon-pink">T</span>IME <span className="text-electric-blue">L</span>OOP <span className="text-chrome-purple">C</span>IRCUITS™
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
