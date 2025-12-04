import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import era1900s from "@/assets/era-1900s.jpg";
import era1950s from "@/assets/era-1950s.jpg";
import era1950sGlamour from "@/assets/era-1950s-glamour.jpg";
import era1960s from "@/assets/era-1960s.jpg";
import era1970s from "@/assets/era-1970s.jpg";

const galleryImages = [
  { src: era1900s, era: "1900s", title: "The Inventors" },
  { src: era1950s, era: "1950s", title: "Jazz Legends" },
  { src: era1950sGlamour, era: "1950s", title: "Hollywood Nights" },
  { src: era1960s, era: "1960s", title: "Civil Rights Era" },
  { src: era1970s, era: "1970s", title: "Disco Fever" },
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedImage(index);
  const closeLightbox = () => setSelectedImage(null);
  const goToPrevious = () =>
    setSelectedImage((prev) =>
      prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null
    );
  const goToNext = () =>
    setSelectedImage((prev) =>
      prev !== null ? (prev + 1) % galleryImages.length : null
    );

  return (
    <section id="gallery" className="py-24 bg-background film-grain">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-gold text-sm tracking-[0.3em] uppercase">
            Our Work
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
            Portrait <span className="text-gradient-gold">Gallery</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse through some of our favorite time travel portraits created for our clients.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
              <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-colors duration-300" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-xs text-gold">{image.era}</span>
                <h4 className="font-display font-bold text-foreground">
                  {image.title}
                </h4>
              </div>
              <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/50 rounded-lg transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-6 right-6 text-foreground hover:text-gold transition-colors"
            onClick={closeLightbox}
          >
            <X className="w-8 h-8" />
          </button>

          <button
            className="absolute left-4 md:left-8 text-foreground hover:text-gold transition-colors p-2"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            className="absolute right-4 md:right-8 text-foreground hover:text-gold transition-colors p-2"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div
            className="max-w-4xl max-h-[80vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryImages[selectedImage].src}
              alt={galleryImages[selectedImage].title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background to-transparent">
              <span className="text-sm text-gold">
                {galleryImages[selectedImage].era}
              </span>
              <h3 className="font-display text-2xl font-bold text-foreground">
                {galleryImages[selectedImage].title}
              </h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
