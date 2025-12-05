import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import { SynthwaveBackground } from '@/components/SynthwaveBackground';
import { BoomboxConsole } from '@/components/BoomboxConsole';
import { EraChannelCarousel } from '@/components/EraChannelCarousel';

const Index = () => {
  const navigate = useNavigate();

  const scrollToEras = () => {
    document.getElementById('era-channels')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>TLC Studios REWIND | Time Travel Photography</title>
        <meta name="description" content="Step into history with TLC Studios REWIND. Create AI-generated portraits across 9 legendary eras." />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden">
        <SynthwaveBackground />

        {/* Premium floating particles */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-amber-500/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.1, 0.4, 0.1],
                scale: [1, 1.5, 1],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 4,
              }}
            />
          ))}
        </div>

        {/* Floating Navbar - Minimal */}
        <nav className="fixed top-0 left-0 right-0 z-50 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <span className="text-chrome text-3xl font-bold tracking-[0.3em]">TLC</span>
              <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative px-5 py-2 rounded-full overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 backdrop-blur-md" />
              <div className="absolute inset-0 border border-amber-500/30 rounded-full" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
              <span className="relative text-[10px] tracking-[0.3em] text-amber-400 font-medium">PLATINUM</span>
            </motion.div>
          </div>
        </nav>

        {/* Hero Section - Minimal Text, Max Visual */}
        <section className="min-h-screen flex items-center relative z-10 pt-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left - Boombox Console */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <BoomboxConsole />
              </motion.div>

              {/* Right - Minimal Copy & CTAs */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="text-center lg:text-left"
              >
                {/* Decorative line */}
                <motion.div 
                  className="w-16 h-px bg-gradient-to-r from-amber-500 to-transparent mb-6 mx-auto lg:mx-0"
                  initial={{ width: 0 }}
                  animate={{ width: 64 }}
                  transition={{ delay: 0.8 }}
                />

                <motion.h1
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-wider mb-4 leading-none"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <span className="text-foreground block">REWIND</span>
                  <span className="text-gradient-gold block mt-2">YOUR FACE</span>
                </motion.h1>

                <motion.p
                  className="text-base text-muted-foreground mb-10 max-w-sm mx-auto lg:mx-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  9 legendary eras. One photo.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <motion.button
                    onClick={() => navigate('/lab')}
                    className="group relative btn-gold flex items-center justify-center gap-3 overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <Sparkles className="w-5 h-5" />
                    <span>BEGIN</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={scrollToEras}
                    className="group relative btn-record flex items-center justify-center gap-3 text-foreground overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span>PREVIEW</span>
                    <ChevronDown className="w-4 h-4" />
                  </motion.button>
                </motion.div>

                {/* Minimal Stats - Visual Icons Only */}
                <motion.div
                  className="flex items-center gap-8 mt-12 justify-center lg:justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  {[
                    { value: '9', icon: '◈' },
                    { value: '∞', icon: '◇' },
                    { value: '0', icon: '◆' }
                  ].map((stat, i) => (
                    <div key={i} className="relative group">
                      <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
                      <div className="relative text-center">
                        <p className="text-2xl font-bold text-gradient-gold">{stat.value}</p>
                        <p className="text-[8px] text-amber-500/50 mt-1">{stat.icon}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-amber-500/10 blur-md" />
              <ChevronDown className="relative w-6 h-6 text-amber-500/60" />
            </div>
          </motion.div>
        </section>

        {/* Era Channels Section */}
        <section id="era-channels" className="relative z-10 py-16">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/50 to-transparent" />
          <EraChannelCarousel />
        </section>

        {/* How It Works - Icons Only, Minimal Text */}
        <section className="relative z-10 py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-card/30 via-background to-card/30" />
          <div className="container mx-auto px-4 relative">
            <div className="flex items-center justify-center gap-8 md:gap-16 lg:gap-24">
              {[
                { step: '1', icon: '↑', hint: 'UPLOAD' },
                { step: '2', icon: '✦', hint: 'GENERATE' },
                { step: '3', icon: '↓', hint: 'DOWNLOAD' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="relative group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  viewport={{ once: true }}
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-8 rounded-full bg-gradient-radial from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                  
                  {/* Circle */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full surface-metal border-metallic flex items-center justify-center group-hover:border-amber-500/50 transition-colors duration-500">
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-amber-500/10 to-transparent" />
                    <span className="text-3xl md:text-4xl text-amber-500">{item.icon}</span>
                  </div>
                  
                  {/* Label */}
                  <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.3em] text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.hint}
                  </p>
                  
                  {/* Connector line */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-8 lg:-right-12 w-8 lg:w-12 h-px bg-gradient-to-r from-border to-transparent" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA - Ultra Minimal */}
        <section className="relative z-10 py-24">
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          <div className="container mx-auto px-4 text-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              {/* Decorative element */}
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-amber-500/50 to-transparent mx-auto mb-8" />
              
              <motion.button
                onClick={() => navigate('/lab')}
                className="group relative btn-gold text-lg px-12 py-6 overflow-hidden"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center gap-4">
                  <Sparkles className="w-6 h-6" />
                  ENTER
                </span>
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Footer - Ultra Minimal */}
        <footer className="relative z-10 py-6 border-t border-border/20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-[9px] tracking-[0.4em] text-muted-foreground/50">
              TLC • REWIND • PLATINUM
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;