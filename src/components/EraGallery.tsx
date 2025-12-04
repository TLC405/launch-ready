import { useNavigate } from "react-router-dom";
import { Play, Star } from "lucide-react";
import era1900s from "@/assets/era-1900s.jpg";
import era1950s from "@/assets/era-1950s.jpg";
import era1950sGlamour from "@/assets/era-1950s-glamour.jpg";
import era1960s from "@/assets/era-1960s.jpg";
import era1970s from "@/assets/era-1970s.jpg";

interface Era {
  id: string;
  decade: string;
  title: string;
  featuring: string;
  shotStyle: string;
  image: string;
}

const eras: Era[] = [
  {
    id: "1900s",
    decade: "1900s",
    title: "The Laboratory",
    featuring: "Tesla & Einstein",
    shotStyle: "Sepia Portrait",
    image: era1900s,
  },
  {
    id: "1950s-glamour",
    decade: "1950s",
    title: "Hollywood Nights",
    featuring: "Marilyn Monroe",
    shotStyle: "35mm B&W Glamour",
    image: era1950sGlamour,
  },
  {
    id: "1950s-jazz",
    decade: "1950s",
    title: "The Jazz Age",
    featuring: "Jazz Legends",
    shotStyle: "Noir Photography",
    image: era1950s,
  },
  {
    id: "1960s",
    decade: "1960s",
    title: "The Movement",
    featuring: "MLK, Malcolm X, Beatles",
    shotStyle: "Documentary B&W",
    image: era1960s,
  },
  {
    id: "1970s",
    decade: "1970s",
    title: "Disco Fever",
    featuring: "Studio 54 Icons",
    shotStyle: "Kodachrome Film",
    image: era1970s,
  },
];

const EraGallery = () => {
  const navigate = useNavigate();

  return (
    <section id="eras" className="py-24 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-sm text-primary tracking-[0.3em] uppercase mb-4">
            Your Timeline, Pressed On Wax
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl">
            <span className="text-chrome">THE</span>{" "}
            <span className="text-gradient-gold">COLLECTION</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mt-4">
            Browse legendary LPs from history's greatest moments. 
            Each one starring you.
          </p>
        </div>

        {/* Vinyl Crate - Horizontal Scroll */}
        <div className="vinyl-crate pb-4 -mx-6 px-6">
          {eras.map((era, index) => (
            <div
              key={era.id}
              className="flex-shrink-0 w-72 scroll-snap-align-start"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Album Card */}
              <div className="album-tile group relative bg-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300">
                {/* Album Cover */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={era.image}
                    alt={era.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  
                  {/* Play Button Overlay */}
                  <button
                    onClick={() => navigate("/lab")}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"
                  >
                    <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
                  </button>

                  {/* Decade Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-platinum font-medium">
                      {era.decade}
                    </span>
                  </div>
                </div>

                {/* Album Info */}
                <div className="p-4 space-y-2">
                  <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors">
                    {era.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="w-3 h-3 text-primary" />
                    <span>{era.featuring}</span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground/70">
                    Shot style: {era.shotStyle}
                  </p>

                  {/* Generate Button */}
                  <button
                    onClick={() => navigate("/lab")}
                    className="mt-3 w-full py-2 px-4 rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-sm text-foreground transition-colors"
                  >
                    Generate This Era
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* "More Coming" Card */}
          <div className="flex-shrink-0 w-72">
            <div className="relative aspect-square bg-gradient-to-br from-muted to-card rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="font-display text-2xl text-primary">+</span>
              </div>
              <p className="font-display text-xl text-foreground mb-2">MORE ERAS</p>
              <p className="text-sm text-muted-foreground">
                1980s, 1990s, 2000s & special scenes coming soon
              </p>
            </div>
          </div>
        </div>

        {/* TLC Easter Egg */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground/50 tracking-widest">
            <span className="text-primary">T</span>EMPORAL{" "}
            <span className="text-silver">L</span>INE{" "}
            <span className="text-accent">C</span>ATALOG™
          </p>
        </div>
      </div>
    </section>
  );
};

export default EraGallery;
