import { Upload, Wand2, Download, Share2 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Upload Your Photo",
    description:
      "Start by uploading a clear photo of yourself. Our AI works best with front-facing portraits with good lighting.",
  },
  {
    icon: Wand2,
    number: "02",
    title: "Choose Your Era",
    description:
      "Select from our collection of historic eras. Each one has been meticulously crafted to capture the authentic aesthetic of the time.",
  },
  {
    icon: Download,
    number: "03",
    title: "AI Magic",
    description:
      "Our advanced AI seamlessly integrates you into your chosen era, preserving your likeness while adding period-accurate styling.",
  },
  {
    icon: Share2,
    number: "04",
    title: "Download & Share",
    description:
      "Receive your high-resolution portrait ready to download, print, or share with friends and family.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background film-grain">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-gold text-sm tracking-[0.3em] uppercase">
            Simple Process
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
            How <span className="text-gradient-gold">Rewind</span> Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transform yourself into a time traveler in just four simple steps.
            Our AI handles all the heavy lifting.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-px bg-gradient-to-r from-gold/50 to-transparent" />
              )}

              {/* Card */}
              <div className="relative bg-gradient-card rounded-2xl p-8 border border-border/50 hover:border-gold/30 transition-all duration-500 group-hover:shadow-gold">
                {/* Number */}
                <div className="absolute -top-4 -right-4 font-display text-6xl font-bold text-gold/10 group-hover:text-gold/20 transition-colors duration-300">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors duration-300">
                  <step.icon className="w-7 h-7 text-gold" />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
