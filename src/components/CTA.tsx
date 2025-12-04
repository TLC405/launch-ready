import { useNavigate } from "react-router-dom";
import { Play, ArrowRight } from "lucide-react";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary">Testing Phase • Limited Access</span>
          </div>

          {/* Headline */}
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6">
            <span className="text-chrome">READY TO</span>{" "}
            <span className="text-gradient-gold">REWIND</span>
            <span className="text-chrome">?</span>
          </h2>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Press record and step into history. Your greatest hits collection awaits.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/lab")}
              className="btn-gold flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" fill="currentColor" />
              <span>START YOUR SESSION</span>
            </button>
            <button
              onClick={() => document.getElementById("eras")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-record flex items-center justify-center gap-2 text-silver"
            >
              <span>VIEW COLLECTION</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Trust Note */}
          <p className="mt-8 text-sm text-muted-foreground/70">
            For testing with friends only. Your photos are processed securely.
          </p>

          {/* TLC Easter Egg */}
          <div className="mt-12">
            <p className="text-xs text-muted-foreground/40 tracking-[0.2em]">
              LAST CALL TO PRESS YOUR LEGEND TO WAX
            </p>
            <p className="text-[10px] text-muted-foreground/30 mt-2 tracking-widest">
              <span className="text-primary/50">T</span>LC STUDIOS •{" "}
              <span className="text-silver/50">L</span>EGACY{" "}
              <span className="text-accent/50">C</span>OLLECTION
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
