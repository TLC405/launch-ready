import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Zap, Download, ArrowLeft, Check, X, 
  ChevronDown, ChevronUp, Loader2, Sparkles, Camera
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PremiumBackground3D from '@/components/PremiumBackground3D';
import { EraTVWall } from '@/components/EraTVWall';
import { AmbientMusic } from '@/components/AmbientMusic';
import { eraConfig, eraOrder, EraId, GLOBAL_STYLE, getFullPrompt } from '@/lib/decadePrompts';
import generationService, { GenerationResult } from '@/services/generationService';

export default function TimeTravelLab() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [selectedEras, setSelectedEras] = useState<Set<EraId>>(new Set(eraOrder));
  const [generatingEras, setGeneratingEras] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<Map<string, GenerationResult>>(new Map());
  const [activeEra, setActiveEra] = useState<EraId | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showGlobalStyle, setShowGlobalStyle] = useState(false);
  const [mobileView, setMobileView] = useState<'wall' | 'console'>('console');
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
        title: '📼 Master Tape Loaded',
        description: 'Your face is locked. Ready to rewind through history.'
      });
    };
    reader.onerror = () => {
      toast({
        title: 'Upload failed',
        description: 'Could not read the image file. Please try again.',
        variant: 'destructive'
      });
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  }, [processImageFile]);

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

  const generateSingle = useCallback(async (era: EraId) => {
    if (!sourceImage) {
      toast({
        title: 'No photo uploaded',
        description: 'Drop your photo first to begin the rewind.',
        variant: 'destructive'
      });
      return;
    }

    setGeneratingEras(prev => new Set(prev).add(era));
    setActiveEra(era);

    const result = await generationService.generatePortrait(era, sourceImage);
    
    setResults(prev => new Map(prev).set(era, result));
    setGeneratingEras(prev => {
      const next = new Set(prev);
      next.delete(era);
      return next;
    });

    if (result.success) {
      toast({
        title: '✨ Portrait Complete!',
        description: `Your ${eraConfig[era].name} portrait is ready!`
      });
    } else {
      toast({
        title: 'Generation Failed',
        description: result.error || 'Please try again',
        variant: 'destructive'
      });
    }
  }, [sourceImage, toast]);

  const generateAll = useCallback(async () => {
    if (!sourceImage) {
      toast({
        title: 'No photo uploaded',
        description: 'Drop your photo first to begin the rewind.',
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
      title: '⚡ REWIND INITIATED',
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
      title: '🎬 REWIND COMPLETE!',
      description: 'Your legendary album is ready for download!'
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

  const completedCount = Array.from(results.values()).filter(r => r.success).length;
  const activeResult = activeEra ? results.get(activeEra) : null;
  const isGenerating = generatingEras.size > 0;

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <PremiumBackground3D />
      
      {/* Global drag overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-xl flex items-center justify-center">
          <div className="text-center space-y-6 animate-pulse">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mx-auto ring-2 ring-gold/30 ring-dashed">
              <Upload className="w-12 h-12 text-gold" />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-wider text-gold">DROP YOUR PHOTO</p>
              <p className="text-sm text-muted-foreground mt-2">Release to upload your master tape</p>
            </div>
          </div>
        </div>
      )}

      {/* Premium Header */}
      <header className="relative z-50 py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="glass-panel rounded-2xl px-6 py-4 flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-all group"
            >
              <div className="w-12 h-12 rounded-xl glass-ultra flex items-center justify-center group-hover:ring-1 ring-gold/40 group-hover:bg-gold/5 transition-all">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </div>
              <div className="hidden sm:block">
                <span className="text-[10px] tracking-[0.3em] text-muted-foreground/60 font-mono block">RETURN TO</span>
                <span className="text-xs tracking-[0.15em] font-semibold">MAIN CONSOLE</span>
              </div>
            </Link>
            
            <div className="flex items-center gap-5">
              <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-gold/5 border border-gold/10">
                <div className="w-2 h-2 rounded-full bg-gold animate-pulse shadow-[0_0_12px_hsla(var(--gold),0.6)]" />
                <span className="text-[10px] tracking-[0.2em] text-gold font-mono">SINGULARITY PROTOCOL</span>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-3 justify-center">
                  <Sparkles className="w-6 h-6 text-gold animate-pulse" />
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-[0.1em] text-gradient-gold">
                    TLC REWIND LAB
                  </h1>
                  <Sparkles className="w-6 h-6 text-gold animate-pulse" />
                </div>
                <p className="text-[10px] tracking-[0.3em] text-muted-foreground/50 font-mono mt-1 hidden sm:block">
                  TEMPORAL LOOP CONTROL™
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="glass-ultra px-5 py-3 rounded-xl flex items-center gap-3 border border-emerald-500/20">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-50" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-[10px] tracking-[0.2em] text-emerald-400 font-mono block">SYSTEM</span>
                  <span className="text-xs tracking-[0.1em] text-emerald-300 font-semibold">ONLINE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile View Toggle */}
      <div className="lg:hidden relative z-40 px-4 pb-4">
        <div className="glass-ultra rounded-xl p-2 flex gap-2">
          <button
            onClick={() => setMobileView('console')}
            className={`flex-1 px-4 py-3 rounded-lg text-xs font-medium tracking-wider transition-all flex items-center justify-center gap-2 ${
              mobileView === 'console' 
                ? 'bg-gradient-to-r from-gold to-gold-muted text-background' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Camera className="w-4 h-4" />
            CONTROLS
          </button>
          <button
            onClick={() => setMobileView('wall')}
            className={`flex-1 px-4 py-3 rounded-lg text-xs font-medium tracking-wider transition-all flex items-center justify-center gap-2 ${
              mobileView === 'wall' 
                ? 'bg-gradient-to-r from-gold to-gold-muted text-background' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            ERA WALL
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left - ERA TV WALL */}
          <div className={`lg:col-span-7 ${mobileView === 'wall' ? 'block' : 'hidden lg:block'}`}>
            <EraTVWall
              activeEra={activeEra}
              generatingEras={generatingEras}
              results={results}
              onSelectEra={(era) => setActiveEra(era)}
              onGenerateEra={generateSingle}
            />
          </div>

          {/* Right - CONTROL CONSOLE */}
          <div className={`lg:col-span-5 space-y-4 ${mobileView === 'console' ? 'block' : 'hidden lg:block'}`}>
            
            {/* Upload Panel - Premium */}
            <motion.div 
              className="glass-panel rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Panel Header */}
              <div className="px-5 py-4 border-b border-border/30 bg-gradient-to-r from-red-500/5 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse" />
                      <div className="absolute inset-0 w-4 h-4 rounded-full bg-red-500 animate-ping opacity-30" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold tracking-[0.15em]">MASTER TAPE</h3>
                      <p className="text-[10px] tracking-[0.2em] text-muted-foreground/60 font-mono">FACE LOCK PROTOCOL</p>
                    </div>
                  </div>
                  {sourceImage && (
                    <button
                      onClick={() => {
                        setSourceImage(null);
                        setResults(new Map());
                      }}
                      className="w-10 h-10 rounded-xl glass-ultra flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-5 sm:p-6">

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleImageUpload}
                className="hidden"
              />

                {sourceImage ? (
                  <div className="flex items-center gap-6">
                    <div className="relative flex-shrink-0">
                      {/* Multi-layer glow */}
                      <div className="absolute -inset-4 rounded-full bg-gold/10 blur-2xl" />
                      <div className="absolute -inset-2 rounded-full bg-gold/20 blur-xl" />
                      {/* Image */}
                      <div className="relative w-28 h-28 rounded-2xl overflow-hidden ring-2 ring-gold/50 shadow-2xl shadow-gold/20">
                        <img src={sourceImage} alt="Your photo" className="w-full h-full object-cover" />
                        {/* Scanline overlay */}
                        <div className="absolute inset-0 scanlines opacity-30" />
                      </div>
                      {/* Check badge */}
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-sm font-bold text-emerald-400 tracking-wider">FACE LOCKED</p>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Your exact facial features will be preserved across all eras. Hair and styling will transform to match each decade.
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-4 text-xs text-muted-foreground hover:text-gold flex items-center gap-2 transition-colors group"
                      >
                        <Camera className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                        <span className="underline underline-offset-4">Change photo</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-[16/9] glass-card rounded-2xl border-2 border-dashed border-muted/50 hover:border-gold/40 transition-all flex flex-col items-center justify-center gap-5 group relative overflow-hidden"
                  >
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-5 synthwave-grid" />
                    <div className="relative z-10">
                      <div className="absolute -inset-6 rounded-full bg-gold/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative w-20 h-20 rounded-2xl glass-ultra flex items-center justify-center group-hover:ring-2 ring-gold/30 group-hover:scale-105 transition-all duration-300">
                        <Upload className="w-9 h-9 text-gold group-hover:animate-bounce" />
                      </div>
                    </div>
                    <div className="text-center relative z-10">
                      <p className="text-base font-bold tracking-[0.15em] group-hover:text-gold transition-colors">DROP YOUR PHOTO</p>
                      <p className="text-xs text-muted-foreground mt-2">Drag & drop or click to upload</p>
                      <p className="text-[10px] text-muted-foreground/50 mt-1 font-mono tracking-wider">MAX 10MB • JPG, PNG</p>
                    </div>
                  </button>
                )}
              </div>
            </motion.div>

            {/* Era Selector 1 - Quick Select Grid */}
            <motion.div 
              className="glass-panel rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="px-5 py-4 border-b border-border/30 bg-gradient-to-r from-gold/5 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-gold animate-pulse shadow-[0_0_10px_hsla(var(--gold),0.6)]" />
                    <div>
                      <h3 className="text-lg font-bold tracking-[0.15em]">ERA SELECTOR</h3>
                      <p className="text-[10px] tracking-[0.2em] text-muted-foreground/60 font-mono">TEMPORAL LINE CATALOG</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedEras(new Set(eraOrder))}
                      className="text-xs text-gold hover:text-background px-4 py-2 rounded-lg hover:bg-gold transition-all tracking-wider font-semibold"
                    >
                      ALL
                    </button>
                    <button
                      onClick={() => setSelectedEras(new Set())}
                      className="text-xs text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg hover:bg-muted/30 transition-all tracking-wider"
                    >
                      NONE
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-5 sm:p-6">

                <div className="grid grid-cols-5 gap-2.5">
                  {eraOrder.map(era => {
                    const isSelected = selectedEras.has(era);
                    const isComplete = results.get(era)?.success;
                    const isGen = generatingEras.has(era);
                    
                    return (
                      <motion.button
                        key={era}
                        onClick={() => toggleEra(era)}
                        disabled={isGen}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative px-2 py-4 rounded-xl text-xs font-bold tracking-wider transition-all ${
                          isSelected
                            ? `bg-gradient-to-br ${eraConfig[era].gradient} text-white shadow-lg shadow-black/30`
                            : 'glass-card text-muted-foreground hover:text-foreground hover:ring-1 ring-white/10'
                        } ${isGen ? 'animate-pulse' : ''}`}
                      >
                        {isComplete && (
                          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                        {isGen && <Loader2 className="w-4 h-4 animate-spin mx-auto" />}
                        {!isGen && <span>{eraConfig[era].year}</span>}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="mt-5 pt-4 border-t border-border/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                    <p className="text-xs text-muted-foreground">
                      <span className="text-gold font-bold text-sm">{selectedEras.size}</span> eras selected
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-gold" />
                    <p className="text-xs text-muted-foreground">
                      <span className="text-gold font-bold text-sm">{selectedEras.size * 12}+</span> legends
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Era Selector 2 - Visual Cards */}
            <motion.div 
              className="glass-panel rounded-2xl p-5 sm:p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-lg font-bold tracking-[0.15em]">ERA DETAILS</h3>
              </div>

              <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-premium">
                {eraOrder.map(era => {
                  const isSelected = selectedEras.has(era);
                  const isComplete = results.get(era)?.success;
                  const isGen = generatingEras.has(era);
                  const config = eraConfig[era];
                  
                  return (
                    <button
                      key={era}
                      onClick={() => toggleEra(era)}
                      disabled={isGen}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                        isSelected
                          ? 'glass-card ring-1 ring-gold/50 bg-gold/5'
                          : 'hover:bg-muted/20'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                        {config.year}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{config.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{config.featuring}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isComplete && (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Check className="w-3 h-3 text-emerald-500" />
                          </div>
                        )}
                        {isGen && <Loader2 className="w-4 h-4 text-gold animate-spin" />}
                        <div className={`w-4 h-4 rounded border-2 transition-all ${
                          isSelected ? 'bg-gold border-gold' : 'border-muted-foreground/30'
                        }`}>
                          {isSelected && <Check className="w-full h-full text-background" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Generate Controls */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={generateAll}
                disabled={!sourceImage || isGenerating || selectedEras.size === 0}
                className="w-full btn-gold py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>GENERATING {generatingEras.size} ERAS...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6 group-hover:animate-pulse" />
                    <span>GENERATE {selectedEras.size} ERAS</span>
                  </>
                )}
                
                {isGenerating && (
                  <div className="absolute bottom-0 left-0 h-1 bg-black/20 w-full">
                    <motion.div 
                      className="h-full bg-white/40"
                      initial={{ width: 0 }}
                      animate={{ width: `${((selectedEras.size - generatingEras.size) / selectedEras.size) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </button>

              <button
                onClick={downloadAll}
                disabled={completedCount === 0}
                className="w-full btn-record py-3.5 text-foreground disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <Download className="w-5 h-5" />
                <span>DOWNLOAD ALL ({completedCount})</span>
              </button>
            </motion.div>

            {/* Album Preview */}
            <AnimatePresence>
              {completedCount > 0 && (
                <motion.div 
                  className="glass-panel rounded-2xl p-5 sm:p-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <h3 className="text-lg font-bold tracking-[0.15em] mb-4 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-gold" />
                    YOUR ALBUM ({completedCount})
                  </h3>
                  
                  <div className="grid grid-cols-5 gap-2">
                    {eraOrder.map(era => {
                      const result = results.get(era);
                      if (!result?.success || !result.imageUrl) return null;
                      
                      return (
                        <motion.button
                          key={era}
                          onClick={() => setActiveEra(era)}
                          className={`aspect-square rounded-lg overflow-hidden transition-all ${
                            activeEra === era 
                              ? 'ring-2 ring-gold shadow-[0_0_20px_hsla(var(--gold),0.4)]' 
                              : 'ring-1 ring-border/50 hover:ring-gold/50'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <img 
                            src={result.imageUrl} 
                            alt={eraConfig[era].name}
                            className="w-full h-full object-cover"
                          />
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active Result Preview */}
            <AnimatePresence>
              {activeResult?.success && activeResult.imageUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-panel rounded-2xl overflow-hidden"
                >
                  <div className="relative">
                    <img 
                      src={activeResult.imageUrl}
                      alt={activeEra ? eraConfig[activeEra].name : 'Generated portrait'}
                      className="w-full aspect-square object-cover"
                    />
                    {/* TLC Watermark */}
                    <div className="absolute bottom-3 right-3 glass-ultra px-3 py-1.5 rounded-lg">
                      <span className="text-[10px] tracking-[0.2em] text-white/80 font-mono">TLC STUDIOS REWIND™</span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <p className="text-xl font-bold">{activeEra && eraConfig[activeEra].name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{activeEra && eraConfig[activeEra].tagline}</p>
                    <p className="text-xs text-gold/70 mt-2">Featuring: {activeEra && eraConfig[activeEra].featuring}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Prompt Viewer */}
            {activeEra && (
              <motion.div 
                className="glass-panel rounded-2xl p-5 sm:p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <button
                  onClick={() => setShowPrompt(!showPrompt)}
                  className="w-full flex items-center justify-between"
                >
                  <h3 className="text-lg font-bold tracking-[0.15em]">PROMPT VIEWER</h3>
                  {showPrompt ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>

                <AnimatePresence>
                  {showPrompt && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 space-y-3">
                        <button
                          onClick={() => setShowGlobalStyle(!showGlobalStyle)}
                          className="w-full glass-card rounded-xl p-4 text-left"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs tracking-wider text-gold font-mono">GLOBAL STYLE</span>
                            {showGlobalStyle ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                          {showGlobalStyle && (
                            <p className="mt-3 text-xs text-muted-foreground whitespace-pre-wrap font-mono max-h-40 overflow-y-auto scrollbar-premium">
                              {GLOBAL_STYLE}
                            </p>
                          )}
                        </button>

                        <div className="glass-card rounded-xl p-4 max-h-60 overflow-y-auto scrollbar-premium">
                          <p className="text-xs tracking-wider text-gold mb-3 font-mono">
                            {eraConfig[activeEra].name.toUpperCase()} PROMPT
                          </p>
                          <p className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                            {getFullPrompt(activeEra)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      
      {/* Ambient Music Player */}
      <AmbientMusic />
    </div>
  );
}