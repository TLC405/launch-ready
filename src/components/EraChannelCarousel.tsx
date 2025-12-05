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
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-4">
        {/* Header - Minimal */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-px h-8 bg-gradient-to-b from-amber-500 to-transparent" />
            <h2 className="text-2xl font-bold tracking-[0.2em] text-gradient-gold">ERAS</h2>
          </div>
          
          <div className="flex gap-2">
            <motion.button
              onClick={() => scroll('left')}
              className="group relative w-10 h-10 rounded-full overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-600 group-hover:border-zinc-500 transition-colors" />
              <ChevronLeft className="relative w-4 h-4 mx-auto text-zinc-400" />
            </motion.button>
            <motion.button
              onClick={() => scroll('right')}
              className="group relative w-10 h-10 rounded-full overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-600 group-hover:border-zinc-500 transition-colors" />
              <ChevronRight className="relative w-4 h-4 mx-auto text-zinc-400" />
            </motion.button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scroll-smooth scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {eraOrder.map((eraId, index) => {
            const era = eraConfig[eraId];
            
            return (
              <motion.div
                key={eraId}
                className="flex-shrink-0 w-56 scroll-snap-align-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="group relative rounded-xl overflow-hidden cursor-pointer aspect-[3/4]"
                  onClick={() => navigate('/lab')}
                  whileHover={{ scale: 1.03, y: -8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${era.gradient}`} />
                  
                  {/* Noise texture */}
                  <div 
                    className="absolute inset-0 opacity-30 mix-blend-overlay"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
                  />
                  
                  {/* Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    {/* Year - Big visual */}
                    <span className="text-5xl font-bold text-white/95 drop-shadow-2xl tracking-wider">
                      {era.year}
                    </span>
                    
                    {/* Name */}
                    <h4 className="text-sm font-bold text-white/80 tracking-[0.15em] mt-2 text-center">
                      {era.name}
                    </h4>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <motion.div
                      className="relative"
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileHover={{ scale: 1 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      {/* Glow ring */}
                      <div className="absolute -inset-4 rounded-full bg-amber-500/30 blur-xl" />
                      <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl">
                        <Play className="w-6 h-6 text-black fill-current ml-1" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Border glow on hover */}
                  <div className="absolute inset-0 rounded-xl border border-white/0 group-hover:border-amber-500/50 transition-colors" />
                  
                  {/* Corner accent */}
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-white/30 group-hover:bg-amber-400 transition-colors shadow-lg" />
                </motion.div>

                {/* Channel indicator */}
                <div className="mt-3 flex items-center justify-center gap-2">
                  <div className="w-4 h-px bg-zinc-700" />
                  <span className="text-[9px] tracking-[0.3em] text-zinc-600">{String(index + 1).padStart(2, '0')}</span>
                  <div className="w-4 h-px bg-zinc-700" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}