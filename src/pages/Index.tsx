import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ChevronDown, Upload, Sparkles, Download, HelpCircle } from 'lucide-react';
import { SynthwaveBackground } from '@/components/SynthwaveBackground';
import { BoomboxConsole } from '@/components/BoomboxConsole';
import { EraChannelCarousel } from '@/components/EraChannelCarousel';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const Index = () => {
  const navigate = useNavigate();

  const scrollToEras = () => {
    document.getElementById('era-channels')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>TLC Studios REWIND | Time Travel Photography</title>
        <meta
          name="description"
          content="Step into history with TLC Studios REWIND. Create AI-generated portraits of yourself across 9 legendary eras."
        />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden">
        <SynthwaveBackground />

        {/* Floating Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-chrome text-2xl font-bold tracking-[0.2em]"
            >
              TLC
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50"
            >
              <span className="text-xs tracking-[0.2em] text-amber-500">REWIND PLATINUM EDITION</span>
            </motion.div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center relative z-10 pt-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left - Boombox Console */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <BoomboxConsole />
              </motion.div>

              {/* Right - Copy & CTAs */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-center lg:text-left"
              >
                <motion.p
                  className="text-sm tracking-[0.3em] text-amber-500/80 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  SINGULARITY PROTOCOL • LEGACY EDITION
                </motion.p>

                <motion.h1
                  className="text-5xl lg:text-6xl font-bold tracking-wider mb-6 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <span className="text-foreground">PUT YOUR FACE IN</span>
                  <br />
                  <span className="text-gradient-gold">EVERY LEGENDARY ERA</span>
                </motion.h1>

                <motion.p
                  className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  One photo. 9 illustrated timelines. Stand alongside Tesla, Marilyn, 
                  Tupac, and legends across history—rendered as epic movie poster art.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <button
                    onClick={() => navigate('/lab')}
                    className="btn-gold flex items-center justify-center gap-3"
                  >
                    <Sparkles className="w-5 h-5" />
                    BEGIN REWIND
                  </button>
                  
                  <button
                    onClick={scrollToEras}
                    className="btn-record flex items-center justify-center gap-3 text-foreground"
                  >
                    Preview Era TV Wall
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </motion.div>

                {/* Stats */}
                <motion.div
                  className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  {[
                    { value: '9', label: 'LEGENDARY ERAS' },
                    { value: '∞', label: 'POSSIBILITIES' },
                    { value: '0', label: 'SIGNUP REQUIRED' }
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <p className="text-3xl font-bold text-gradient-gold">{stat.value}</p>
                      <p className="text-[10px] tracking-[0.2em] text-muted-foreground mt-1">{stat.label}</p>
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
            <ChevronDown className="w-8 h-8 text-muted-foreground" />
          </motion.div>
        </section>

        {/* Era Channels Section */}
        <section id="era-channels" className="relative z-10 py-20 bg-gradient-to-b from-transparent via-background/80 to-background">
          <EraChannelCarousel />
        </section>

        {/* How It Works */}
        <section className="relative z-10 py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.3em] text-amber-500/80 mb-2">SIMPLE AS</p>
              <h2 className="text-4xl font-bold tracking-wider text-gradient-gold">1, 2, 3</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  icon: Upload,
                  step: '01',
                  title: 'DROP ONE SELFIE',
                  description: 'Upload any clear photo of your face. We handle the rest.'
                },
                {
                  icon: Sparkles,
                  step: '02',
                  title: 'AI DOES THE MAGIC',
                  description: 'Our SINGULARITY PROTOCOL transforms you into epic illustrated art.'
                },
                {
                  icon: Download,
                  step: '03',
                  title: 'DOWNLOAD 9 POSTERS',
                  description: 'Get legendary movie-poster-quality portraits across all eras.'
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="surface-metal rounded-xl p-6 border-metallic text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-amber-500" />
                  </div>
                  <p className="text-xs tracking-[0.3em] text-amber-500/60 mb-2">STEP {item.step}</p>
                  <h3 className="text-xl font-bold tracking-wider text-foreground mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative z-10 py-20 bg-background">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="text-center mb-12">
              <HelpCircle className="w-8 h-8 text-amber-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold tracking-wider text-foreground">QUESTIONS?</h2>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  q: 'Is this really free?',
                  a: 'Yes! TLC Studios REWIND is currently in testing mode. Generate as many portraits as you want.'
                },
                {
                  q: 'How does the AI work?',
                  a: 'We use advanced AI illustration models with our SINGULARITY PROTOCOL to create cinematic, non-photorealistic art that preserves your facial features while placing you in legendary historical scenes.'
                },
                {
                  q: 'Are these deepfakes?',
                  a: 'No. These are illustrated artworks, not photorealistic images. Think movie posters or graphic novel covers, not fake photographs.'
                },
                {
                  q: 'What happens to my photos?',
                  a: 'Your uploaded photos are processed in real-time and not permanently stored. We take privacy seriously.'
                },
                {
                  q: 'Can I use these commercially?',
                  a: 'The generated portraits are for personal use only. They feature likenesses of public figures and are intended as artistic tributes.'
                }
              ].map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="surface-inset rounded-lg border-metallic px-4">
                  <AccordionTrigger className="text-left font-medium text-foreground hover:text-amber-500 transition-colors">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative z-10 py-20 bg-gradient-to-t from-card to-background">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold tracking-wider mb-6">
                <span className="text-foreground">READY TO</span>{' '}
                <span className="text-gradient-gold">REWIND?</span>
              </h2>
              <button
                onClick={() => navigate('/lab')}
                className="btn-gold text-lg px-10 py-5"
              >
                <Sparkles className="w-6 h-6 inline mr-3" />
                BEGIN YOUR JOURNEY
              </button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 py-8 bg-card border-t border-border/30">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs tracking-[0.2em] text-muted-foreground">
              TLC STUDIOS REWIND • SINGULARITY PROTOCOL™ • PLATINUM EDITION
            </p>
            <p className="text-[10px] text-muted-foreground/50 mt-2">
              For entertainment purposes only. All celebrity likenesses are artistic interpretations.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
