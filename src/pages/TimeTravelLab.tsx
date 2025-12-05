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

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSourceImage(base64);
      setResults(new Map());
      toast({
        title: '📼 Master Tape Loaded',
        description: 'Your face is locked. Ready to rewind through history.'
      });
    };
    reader.readAsDataURL(file);
  }, [toast]);

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
    <div className="min-h-screen relative overflow-hidden">
      <PremiumBackground3D />

      {/* Header */}
      <header className="relative z-50 p-4 sm:p-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <div className="w-10 h-10 rounded-full glass-ultra flex items-center justify-center group-hover:ring-1 ring-gold/30 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-xs tracking-[0.2em] hidden sm:inline font-mono">EXIT LAB</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Sparkles className="w-5 h-5 text-gold" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-[0.15em] text-gradient-gold">
              TLC REWIND LAB
            </h1>
          </div>
          
          <div className="glass-ultra px-4 py-2 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-[10px] tracking-[0.2em] text-emerald-400 font-mono hidden sm:inline">ONLINE</span>
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
            
            {/* Upload Panel */}
            <motion.div 
              className="glass-panel rounded-2xl p-5 sm:p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse" />
                  <h3 className="text-lg font-bold tracking-[0.15em]">MASTER TAPE</h3>
                </div>
                {sourceImage && (
                  <button
                    onClick={() => {
                      setSourceImage(null);
                      setResults(new Map());
                    }}
                    className="w-8 h-8 rounded-full glass-ultra flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleImageUpload}
                className="hidden"
              />

              {sourceImage ? (
                <div className="flex items-center gap-5">
                  <div className="relative flex-shrink-0">
                    {/* Glow */}
                    <div className="absolute -inset-2 rounded-full bg-gold/20 blur-xl" />
                    {/* Image */}
                    <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-gold shadow-2xl">
                      <img src={sourceImage} alt="Your photo" className="w-full h-full object-cover" />
                    </div>
                    {/* Check badge */}
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gold tracking-wider">FACE LOCKED</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Your features will be preserved exactly across all eras.
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-3 text-xs text-muted-foreground hover:text-gold underline underline-offset-4 transition-colors"
                    >
                      Change photo
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video glass-card rounded-xl border-2 border-dashed border-muted hover:border-gold/50 transition-all flex flex-col items-center justify-center gap-4 group"
                >
                  <div className="relative">
                    <div className="absolute -inset-4 rounded-full bg-gold/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative w-16 h-16 rounded-full glass-ultra flex items-center justify-center group-hover:ring-1 ring-gold/30 transition-all">
                      <Upload className="w-7 h-7 text-gold" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium tracking-wider">DROP YOUR PHOTO</p>
                    <p className="text-xs text-muted-foreground mt-1">Your face will be preserved exactly</p>
                  </div>
                </button>
              )}
            </motion.div>

            {/* Era Selection */}
            <motion.div 
              className="glass-panel rounded-2xl p-5 sm:p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold tracking-[0.15em]">ERA SELECTOR</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedEras(new Set(eraOrder))}
                    className="text-xs text-gold hover:text-gold/80 px-3 py-1.5 rounded-lg hover:bg-gold/10 transition-all tracking-wider"
                  >
                    ALL
                  </button>
                  <span className="text-muted-foreground/30">|</span>
                  <button
                    onClick={() => setSelectedEras(new Set())}
                    className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted/30 transition-all tracking-wider"
                  >
                    NONE
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {eraOrder.map(era => {
                  const isSelected = selectedEras.has(era);
                  const isComplete = results.get(era)?.success;
                  const isGen = generatingEras.has(era);
                  
                  return (
                    <button
                      key={era}
                      onClick={() => toggleEra(era)}
                      disabled={isGen}
                      className={`relative px-2 py-3 rounded-lg text-xs font-bold tracking-wider transition-all ${
                        isSelected
                          ? `bg-gradient-to-br ${eraConfig[era].gradient} text-white shadow-lg`
                          : 'glass-card text-muted-foreground hover:text-foreground'
                      } ${isGen ? 'animate-pulse' : ''}`}
                    >
                      {isComplete && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                      {isGen && <Loader2 className="w-3 h-3 animate-spin mx-auto" />}
                      {!isGen && <span>{eraConfig[era].year}</span>}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  <span className="text-gold font-bold">{selectedEras.size}</span> eras selected
                </p>
                <p className="text-xs text-muted-foreground">
                  <span className="text-gold font-bold">{selectedEras.size * 12}+</span> legends
                </p>
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
    </div>
  );
}