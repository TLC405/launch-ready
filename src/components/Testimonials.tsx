import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Marcus Johnson",
    role: "History Teacher",
    content:
      "Absolutely stunning results! I created portraits for my entire family reunion. Everyone was blown away by the quality and attention to historical detail.",
    rating: 5,
  },
  {
    name: "Sarah Chen",
    role: "Social Media Creator",
    content:
      "The 1950s Hollywood glamour era is incredible. My followers couldn't believe the transformation. This is next-level AI technology.",
    rating: 5,
  },
  {
    name: "David Martinez",
    role: "Photography Enthusiast",
    content:
      "As someone who appreciates vintage photography, I'm impressed by the authentic grain and lighting. It truly looks like a photo from the era.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-background film-grain">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-gold text-sm tracking-[0.3em] uppercase">
            Testimonials
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
            Time Travelers <span className="text-gradient-gold">Speak</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands who have experienced the magic of stepping into history.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="relative bg-gradient-card rounded-2xl p-8 border border-border/50 hover:border-gold/30 transition-all duration-500 group"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-gold/20 group-hover:text-gold/40 transition-colors duration-300" />

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-gold text-gold"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div>
                <div className="font-display font-bold text-foreground">
                  {testimonial.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
