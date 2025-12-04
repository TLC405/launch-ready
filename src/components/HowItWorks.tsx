import { Upload, ListMusic, Disc, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Load Your Master Tape",
    subtitle: "Upload",
    description:
      "Drop in 1-3 clear photos with your face visible. No sunglasses, no heavy filters. This is your master recording.",
  },
  {
    icon: ListMusic,
    number: "02",
    title: "Choose Your Tracklist",
    subtitle: "Select Eras",
    description:
      "Pick from our collection of legendary moments. Each track features you alongside history's greatest icons.",
  },
  {
    icon: Disc,
    number: "03",
    title: "Press Record",
    subtitle: "AI Magic",
    description:
      "Our AI seamlessly integrates you into your chosen eras, preserving your likeness with cinema-quality results.",
  },
  {
    icon: Download,
    number: "04",
    title: "Receive Your Greatest Hits",
    subtitle: "Download",
    description:
      "Get your high-resolution portraits ready to download, print, frame, or share with the world.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative">
      {/* Subtle gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm text-primary tracking-[0.3em] uppercase mb-4">
            Recording Session
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl">
            <span className="text-chrome">HOW</span>{" "}
            <span className="text-gradient-gold">REWIND</span>{" "}
            <span className="text-chrome">WORKS</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mt-4">
            Four steps to rewrite history with yourself as the star.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={step.number} className="relative group">
              {/* Connector Line (desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-1/2 w-full h-px bg-gradient-to-r from-border via-primary/30 to-border" />
              )}

              {/* Card */}
              <div className="relative surface-metal rounded-2xl p-6 border-metallic hover:border-primary/30 transition-all duration-500">
                {/* Number Badge */}
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
                  <span className="font-display text-sm text-primary">{step.number}</span>
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>

                {/* Subtitle */}
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  {step.subtitle}
                </p>

                {/* Title */}
                <h3 className="font-display text-xl text-foreground mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* TLC Easter Egg */}
        <div className="text-center mt-12">
          <p className="text-xs text-muted-foreground/50 tracking-widest">
            <span className="text-primary">T</span>IME{" "}
            <span className="text-silver">L</span>OOP{" "}
            <span className="text-accent">C</span>IRCUITS™ POWERED
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
