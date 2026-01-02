import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Upload, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PremiumBackground3D from '@/components/PremiumBackground3D';
import { BoomboxConsole } from '@/components/BoomboxConsole';
import { TimeCircuitSelector } from '@/components/lab/TimeCircuitSelector';
import { PhotoUploader } from '@/components/lab/PhotoUploader';
import { ResultsGallery } from '@/components/lab/ResultsGallery';
import { eraConfig, eraOrder, EraId } from '@/lib/decadePrompts';
import generationService, { GenerationResult } from '@/services/generationService';

const Index = () => {
  const { toast } = useToast();
  
  // Lab state
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [selectedEras, setSelectedEras] = useState<Set<EraId>>(new Set(eraOrder));
  const [generatingEras, setGeneratingEras] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<Map<string, GenerationResult>>(new Map());
  const [activeEra, setActiveEra] = useState<EraId | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Process image file
  const processImageFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please upload an image file (JPG, PNG, etc.)',
        variant: 'destructive'
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image under 10MB',
        variant: 'destructive'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSourceImage(base64);
      setResults(new Map());
      setActiveEra(null);
      toast({
        title: '⚡ FACE LOCKED',
        description: 'Ready to engage time warp!'
      });
    };
    reader.onerror = () => {
      toast({
        title: 'Upload failed',
        description: 'Could not read the image file.',
        variant: 'destructive'
      });
    };
    reader.readAsDataURL(file);
  }, [toast]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  }, [processImageFile]);

  const toggleEra = useCallback((era: EraId) => {
    setSelectedEras(prev => {
      const next = new Set(prev);
      if (next.has(era)) {
        next.delete(era);
      } else {
        next.add(era);
      }
      return next;
    });
  }, []);

  const generateAll = useCallback(async () => {
    if (!sourceImage) {
      toast({
        title: 'No photo uploaded',
        description: 'Upload your photo first to engage time warp.',
        variant: 'destructive'
      });
      return;
    }

    const erasToGenerate = Array.from(selectedEras);
    if (erasToGenerate.length === 0) {
      toast({
        title: 'No eras selected',
        description: 'Select at least one era to generate.',
        variant: 'destructive'
      });
      return;
    }
    
    setGeneratingEras(new Set(erasToGenerate));

    toast({
      title: '⚡ TIME WARP ENGAGED',
      description: `Generating ${erasToGenerate.length} legendary portraits...`
    });

    await generationService.generateAll(
      erasToGenerate,
      sourceImage,
      (completed, total, result) => {
        setResults(prev => new Map(prev).set(result.era, result));
        setGeneratingEras(prev => {
          const next = new Set(prev);
          next.delete(result.era);
          return next;
        });
        if (!activeEra && result.success) {
          setActiveEra(result.era as EraId);
        }
      }
    );

    toast({
      title: '🎬 TIME WARP COMPLETE!',
      description: 'Your legendary album is ready!'
    });
  }, [sourceImage, selectedEras, toast, activeEra]);

  const downloadAll = useCallback(() => {
    eraOrder.forEach(era => {
      const result = results.get(era);
      if (result?.imageUrl) {
        const link = document.createElement('a');
        link.href = result.imageUrl;
        link.download = `tlc-rewind-${era}-${eraConfig[era].name.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.click();
      }
    });
  }, [results]);

  const scrollToLab = () => {
    document.getElementById('lab')?.scrollIntoView({ behavior: 'smooth' });
  };

  const isGenerating = generatingEras.size > 0;

  return (
    <>
      <Helmet>
        <title>TLC Studios REWIND | Time Travel Photography</title>
        <meta name="description" content="Step into history with TLC Studios REWIND. Create AI-generated portraits across 9 legendary eras." />
      </Helmet>

      <div 
        className="min-h-screen relative overflow-x-hidden"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <PremiumBackground3D />

        {/* Global drag overlay */}
        <AnimatePresence>
          {isDragging && (
            <motion.div 
              className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-2xl flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="text-center space-y-6"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
              >
                <motion.div 
                  className="w-24 h-24 mx-auto rounded-2xl bg-gold/10 border-2 border-dashed border-gold/40 flex items-center justify-center"
                  animate={{ 
                    borderColor: ['hsla(var(--gold), 0.4)', 'hsla(var(--gold), 0.8)', 'hsla(var(--gold), 0.4)'],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Upload className="w-10 h-10 text-gold" />
                </motion.div>
                
                <div>
                  <motion.p 
                    className="text-2xl font-bold tracking-[0.2em] text-gradient-gold"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    DROP YOUR PHOTO
                  </motion.p>
                  <p className="text-sm text-muted-foreground mt-2">Release to upload</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Navbar */}
        <motion.nav 
          className="fixed top-0 left-0 right-0 z-50 p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-gold/10 to-transparent blur-xl" />
              <span className="relative text-chrome text-4xl font-bold tracking-[0.4em]">TLC</span>
            </div>
            
            <div className="glass-ultra px-6 py-2 rounded-full">
              <span className="text-[10px] tracking-[0.4em] text-gold font-medium">PLATINUM</span>
            </div>
          </div>
        </motion.nav>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 1: HERO */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section id="hero" className="min-h-screen flex items-center justify-center relative z-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center">
              {/* Boombox Console */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="mb-12"
              >
                <BoomboxConsole />
              </motion.div>

              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="space-y-4"
              >
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

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="mt-12"
              >
                <motion.button
                  onClick={scrollToLab}
                  className="group relative"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-gold/40 via-gold/60 to-gold/40 blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative px-16 py-5 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 glass-gold" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    
                    <span className="relative flex items-center gap-4 text-background font-bold tracking-[0.3em] text-lg">
                      <Sparkles className="w-5 h-5" />
                      ENTER
                    </span>
                  </div>
                </motion.button>
              </motion.div>

              {/* Stats */}
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
            className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
            animate={{ opacity: [0.3, 0.6, 0.3], y: [0, 8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            onClick={scrollToLab}
          >
            <ChevronDown className="w-8 h-8 text-gold/50" />
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 2: TIME TRAVEL LAB */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section id="lab" className="min-h-screen relative z-10 py-20">
          <div className="container mx-auto px-4">
            {/* Lab Header */}
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 justify-center mb-4">
                <Sparkles className="w-5 h-5 text-gold" />
                <h2 className="text-3xl sm:text-4xl font-bold tracking-[0.15em] text-gradient-gold">
                  TIME CIRCUIT LABORATORY
                </h2>
                <Sparkles className="w-5 h-5 text-gold" />
              </div>
              <p className="text-sm tracking-[0.2em] text-muted-foreground/50 font-mono">
                UPLOAD • SELECT ERAS • ENGAGE TIME WARP
              </p>
            </motion.div>

            {/* Lab Content - 2 Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {/* Left Column - Upload + Results */}
              <div className="space-y-6">
                <PhotoUploader
                  sourceImage={sourceImage}
                  onImageUpload={(base64) => {
                    setSourceImage(base64);
                    setResults(new Map());
                    setActiveEra(null);
                  }}
                  onClear={() => {
                    setSourceImage(null);
                    setResults(new Map());
                  }}
                />
                
                <ResultsGallery
                  results={results}
                  activeEra={activeEra}
                  onSelectEra={setActiveEra}
                />
              </div>

              {/* Right Column - Time Circuit Selector */}
              <div>
                <TimeCircuitSelector
                  selectedEras={selectedEras}
                  generatingEras={generatingEras}
                  results={results}
                  sourceImage={sourceImage}
                  isGenerating={isGenerating}
                  onToggleEra={toggleEra}
                  onSelectAll={() => setSelectedEras(new Set(eraOrder))}
                  onSelectNone={() => setSelectedEras(new Set())}
                  onGenerate={generateAll}
                  onDownload={downloadAll}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* FOOTER */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <footer className="relative z-10 py-8">
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
