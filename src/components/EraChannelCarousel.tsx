import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { eraConfig, eraOrder } from '@/lib/decadePrompts';

export function EraChannelCarousel() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs tracking-[0.3em] text-amber-500/80 mb-2">CHANNELS ON YOUR</p>
            <h2 className="text-4xl font-bold tracking-wider text-gradient-gold">TIMELINE DIAL</h2>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-3 rounded-full surface-metal border-metallic hover:bg-muted/50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-3 rounded-full surface-metal border-metallic hover:bg-muted/50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="vinyl-crate -mx-4 px-4"
        >
          {eraOrder.map((eraId, index) => {
            const era = eraConfig[eraId];
            
            return (
              <motion.div
                key={eraId}
                className="flex-shrink-0 w-72 scroll-snap-align-start album-tile"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <div className="surface-metal rounded-xl overflow-hidden border-metallic group cursor-pointer"
                  onClick={() => navigate('/lab')}
                >
                  {/* Album cover area */}
                  <div className="relative aspect-square overflow-hidden">
                    {/* Gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${era.gradient} opacity-60`} />
                    
                    {/* Pattern overlay */}
                    <div 
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                      }}
                    />
                    
                    {/* Center content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <span className="text-5xl font-bold text-white/90 drop-shadow-lg mb-2">
                        {era.year}
                      </span>
                      <h4 className="text-xl font-bold text-white tracking-wide drop-shadow-lg">
                        {era.name}
                      </h4>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <motion.div
                        className="p-4 rounded-full bg-amber-500 text-black"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Play className="w-8 h-8 fill-current" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Info strip */}
                  <div className="p-4 bg-card/50">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {era.shortTagline}
                    </p>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <span className={`text-xs font-bold tracking-wider px-2 py-1 rounded bg-gradient-to-r ${era.gradient} text-white`}>
                        {era.id.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">CHANNEL {index + 1}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
