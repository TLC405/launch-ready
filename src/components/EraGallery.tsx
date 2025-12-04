import { useState } from "react";
import { ArrowRight } from "lucide-react";
import era1900s from "@/assets/era-1900s.jpg";
import era1950s from "@/assets/era-1950s.jpg";
import era1950sGlamour from "@/assets/era-1950s-glamour.jpg";
import era1960s from "@/assets/era-1960s.jpg";
import era1970s from "@/assets/era-1970s.jpg";

interface Era {
  id: string;
  decade: string;
  title: string;
  description: string;
  image: string;
  color: string;
}

const eras: Era[] = [
  {
    id: "1900s",
    decade: "1900s",
    title: "The Age of Innovation",
    description: "Stand alongside the great inventors and visionaries who shaped the modern world.",
    image: era1900s,
    color: "from-amber-900/80",
  },
  {
    id: "1950s-jazz",
    decade: "1950s",
    title: "The Jazz Age",
    description: "Experience the smoky jazz clubs and the birth of cool in post-war America.",
    image: era1950s,
    color: "from-neutral-900/80",
  },
  {
    id: "1950s-glamour",
    decade: "1950s",
    title: "Hollywood Glamour",
    description: "Walk the red carpet with the golden age of cinema's biggest stars.",
    image: era1950sGlamour,
    color: "from-zinc-900/80",
  },
  {
    id: "1960s",
    decade: "1960s",
    title: "The Movement",
    description: "Join the voices that changed history during the civil rights era.",
    image: era1960s,
    color: "from-stone-900/80",
  },
  {
    id: "1970s",
    decade: "1970s",
    title: "Disco Fever",
    description: "Dance the night away at Studio 54 with the icons of the disco era.",
    image: era1970s,
    color: "from-rose-950/80",
  },
];

const EraGallery = () => {
  const [hoveredEra, setHoveredEra] = useState<string | null>(null);

  return (
    <section id="eras" className="py-24 bg-gradient-cinematic film-grain">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-gold text-sm tracking-[0.3em] uppercase">
            Choose Your Destination
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
            Journey Through <span className="text-gradient-gold">Time</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select an era and let our AI transport you to a different time. 
            Each decade has its own unique aesthetic and atmosphere.
          </p>
        </div>

        {/* Era Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eras.map((era, index) => (
            <div
              key={era.id}
              className="group relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredEra(era.id)}
              onMouseLeave={() => setHoveredEra(null)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <img
                src={era.image}
                alt={era.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${era.color} via-transparent to-transparent opacity-90`}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/90" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                {/* Decade Badge */}
                <div className="self-start">
                  <span className="inline-block px-3 py-1 bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-full text-gold text-sm font-medium">
                    {era.decade}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2 group-hover:text-gold transition-colors duration-300">
                    {era.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {era.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-gold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span className="text-sm font-medium">Explore Era</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Border Glow on Hover */}
              <div className="absolute inset-0 rounded-xl border border-gold/0 group-hover:border-gold/50 transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EraGallery;
