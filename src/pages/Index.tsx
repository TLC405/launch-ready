import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { PremiumBackground3D } from '@/components/PremiumBackground3D';
import { BoomboxConsole } from '@/components/BoomboxConsole';

const Index = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>TLC Studios REWIND | Time Travel Photography</title>
        <meta name="description" content="Step into history with TLC Studios REWIND. Create AI-generated portraits across 9 legendary eras." />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden">
        <PremiumBackground3D />

        {/* Floating Navbar - Ultra Minimal */}
        <motion.nav 
          className="fixed top-0 left-0 right-0 z-50 p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="container mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-gold/10 to-transparent blur-xl" />
              <span className="relative text-chrome text-4xl font-bold tracking-[0.4em]">TLC</span>
            </div>
            
            {/* Platinum Badge */}
            <div className="glass-ultra px-6 py-2 rounded-full">
              <span className="text-[10px] tracking-[0.4em] text-gold font-medium">PLATINUM</span>
            </div>
          </div>
        </motion.nav>

        {/* Hero - Cinematic Full Screen */}
        <section className="min-h-screen flex items-center justify-center relative z-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center">
              {/* Boombox Console - Center Stage */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="mb-12"
              >
                <BoomboxConsole />
              </motion.div>

              {/* Tagline - Minimal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="space-y-4"
              >
                {/* Decorative line */}
                <motion.div 
                  className="w-24 h-px mx-auto bg-gradient-to-r from-transparent via-gold to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                />
                
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-[0.15em]">
                  <span className="text-foreground block">REWIND</span>
                  <span className="text-gradient-gold block mt-2">YOUR FACE</span>
                </h1>
                
                <p className="text-base text-muted-foreground/60 tracking-[0.2em] uppercase">
                  9 Legendary Eras • One Photo
                </p>
              </motion.div>

              {/* Single CTA - Premium Glass */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="mt-12"
              >
                <motion.button
                  onClick={() => navigate('/lab')}
                  className="group relative"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Glow */}
                  <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-gold/40 via-gold/60 to-gold/40 blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Button */}
                  <div className="relative px-16 py-5 rounded-xl overflow-hidden">
                    {/* Glass base */}
                    <div className="absolute inset-0 glass-gold" />
                    
                    {/* Shine sweep */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    
                    {/* Content */}
                    <span className="relative flex items-center gap-4 text-background font-bold tracking-[0.3em] text-lg">
                      <Sparkles className="w-5 h-5" />
                      ENTER
                    </span>
                  </div>
                </motion.button>
              </motion.div>

              {/* Subtle stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="flex items-center gap-12 mt-16"
              >
                {[
                  { value: '9', label: 'ERAS' },
                  { value: '∞', label: 'LEGENDS' },
                  { value: '1', label: 'PHOTO' }
                ].map((stat, i) => (
                  <div key={i} className="text-center group">
                    <p className="text-3xl font-bold text-gradient-gold group-hover:scale-110 transition-transform">
                      {stat.value}
                    </p>
                    <p className="text-[8px] tracking-[0.4em] text-muted-foreground/40 mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="w-px h-16 bg-gradient-to-b from-gold/50 to-transparent" />
          </motion.div>
        </section>

        {/* Footer - Minimal */}
        <footer className="fixed bottom-0 left-0 right-0 z-50 p-4">
          <div className="text-center">
            <p className="text-[8px] tracking-[0.5em] text-muted-foreground/30">
              TLC STUDIOS • REWIND • PLATINUM EDITION
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;