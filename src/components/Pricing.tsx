import { Button } from "@/components/ui/button";
import { Check, Sparkles, Crown, Zap } from "lucide-react";

const plans = [
  {
    name: "Single Portrait",
    price: "$9",
    period: "one-time",
    description: "Perfect for trying out the experience",
    icon: Zap,
    features: [
      "1 high-resolution portrait",
      "Choice of any era",
      "Standard processing (24hrs)",
      "Digital download",
    ],
    cta: "Get Started",
    variant: "subtle" as const,
  },
  {
    name: "Rewind Pack",
    price: "$29",
    period: "5 portraits",
    description: "Most popular choice for enthusiasts",
    icon: Sparkles,
    features: [
      "5 high-resolution portraits",
      "All eras unlocked",
      "Priority processing (2hrs)",
      "Digital downloads",
      "Print-ready files",
      "Revision included",
    ],
    cta: "Choose Pack",
    variant: "gold" as const,
    popular: true,
  },
  {
    name: "Time Traveler",
    price: "$79",
    period: "unlimited/month",
    description: "For the serious history buff",
    icon: Crown,
    features: [
      "Unlimited portraits",
      "All eras + early access",
      "Instant processing",
      "All file formats",
      "Commercial license",
      "Dedicated support",
      "Custom era requests",
    ],
    cta: "Go Unlimited",
    variant: "gold-outline" as const,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-gradient-cinematic film-grain">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-gold text-sm tracking-[0.3em] uppercase">
            Investment
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
            Choose Your <span className="text-gradient-gold">Plan</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan for your time-traveling needs. 
            All plans include our signature AI quality.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-gradient-card rounded-2xl p-8 border transition-all duration-500 hover:shadow-gold ${
                plan.popular
                  ? "border-gold/50 scale-105 md:scale-110"
                  : "border-border/50 hover:border-gold/30"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold text-primary-foreground text-xs font-bold rounded-full">
                  Most Popular
                </div>
              )}

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-6">
                <plan.icon className="w-6 h-6 text-gold" />
              </div>

              {/* Plan Name */}
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                {plan.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span className="font-display text-4xl font-bold text-gold">
                  {plan.price}
                </span>
                <span className="text-muted-foreground text-sm ml-2">
                  /{plan.period}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button variant={plan.variant} className="w-full" size="lg">
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-muted-foreground text-sm">
          {["Secure Payments", "Instant Delivery", "30-Day Guarantee", "24/7 Support"].map(
            (badge) => (
              <div key={badge} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-gold" />
                <span>{badge}</span>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
