import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden film-grain">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-gold/5 to-background" />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/5 mb-8">
            <Sparkles className="w-4 h-4 text-gold animate-shimmer" />
            <span className="text-sm text-gold">Limited Time: 20% Off All Plans</span>
          </div>

          {/* Headline */}
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to <span className="text-gradient-gold">Rewind</span>?
          </h2>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join over 50,000 time travelers who have already discovered what 
            they would look like in history's most iconic moments.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="cinematic" size="xl">
              <Sparkles className="w-5 h-5" />
              Start Your Journey Now
            </Button>
            <Button variant="subtle" size="xl">
              View Gallery
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Trust Note */}
          <p className="mt-8 text-sm text-muted-foreground">
            No credit card required to preview. Your photos are processed securely.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
