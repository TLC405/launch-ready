import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Zap, Download, ArrowLeft, Check, X, 
  ChevronDown, ChevronUp, Loader2, Sparkles, Camera
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SynthwaveBackground } from '@/components/SynthwaveBackground';
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
      description: `Generating ${erasToGenerate.length} legendary portraits with ${erasToGenerate.length * 10}+ legends...`
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
      <SynthwaveBackground />

      {/* Header - Responsive */}
      <header className="relative z-50 p-3 sm:p-4 border-b border-border/30 bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm tracking-wider hidden sm:inline">BACK TO HQ</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            <h1 className="text-lg sm:text-2xl font-bold tracking-[0.1em] sm:tracking-[0.15em] text-gradient-gold">
              TLC REWIND LAB
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground hidden sm:inline">ONLINE</span>
          </div>
        </div>
      </header>

      {/* Mobile View Toggle */}
      <div className="lg:hidden relative z-40 p-2 bg-card/50 backdrop-blur-sm border-b border-border/20">
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setMobileView('console')}
            className={`px-4 py-2 rounded-lg text-xs font-medium tracking-wider transition-all ${
              mobileView === 'console' 
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-black' 
                : 'bg-muted/30 text-muted-foreground'
            }`}
          >
            <Camera className="w-4 h-4 inline mr-2" />
            UPLOAD & GENERATE
          </button>
          <button
            onClick={() => setMobileView('wall')}
            className={`px-4 py-2 rounded-lg text-xs font-medium tracking-wider transition-all ${
              mobileView === 'wall' 
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-black' 
                : 'bg-muted/30 text-muted-foreground'
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-2" />
            ERA TV WALL
          </button>
        </div>
      </div>

      {/* Main Content - Responsive Grid */}
      <main className="relative z-10 container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          
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

          {/* Right - BOOMBOX CONSOLE */}
          <div className={`lg:col-span-5 space-y-3 sm:space-y-4 ${mobileView === 'console' ? 'block' : 'hidden lg:block'}`}>
            
            {/* Upload Panel */}
            <motion.div 
              className="surface-metal rounded-xl p-4 sm:p-5 border-metallic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-bold tracking-wider flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  MASTER TAPE
                </h3>
                {sourceImage && (
                  <button
                    onClick={() => {
                      setSourceImage(null);
                      setResults(new Map());
                    }}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors p-1"
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
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-amber-500/50 flex-shrink-0">
                    <img src={sourceImage} alt="Your photo" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-amber-500">FACE LOCKED ✓</p>
                    <p className="text-xs text-muted-foreground mt-1">Ready to rewind through history with your exact features preserved.</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2 text-xs text-muted-foreground hover:text-foreground underline"
                    >
                      Change photo
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-[16/9] sm:aspect-video surface-inset rounded-lg border-2 border-dashed border-border/50 hover:border-amber-500/50 transition-all flex flex-col items-center justify-center gap-2 sm:gap-3 group"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm sm:text-base font-medium">DROP YOUR PHOTO</p>
                    <p className="text-xs text-muted-foreground mt-1">Your face will be preserved exactly</p>
                  </div>
                </button>
              )}
            </motion.div>

            {/* Era Selection - Responsive Grid */}
            <motion.div 
              className="surface-metal rounded-xl p-4 sm:p-5 border-metallic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-bold tracking-wider">ERA SELECTOR</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedEras(new Set(eraOrder))}
                    className="text-xs text-amber-500 hover:text-amber-400 px-2 py-1 rounded hover:bg-amber-500/10 transition-colors"
                  >
                    ALL
                  </button>
                  <span className="text-muted-foreground">/</span>
                  <button
                    onClick={() => setSelectedEras(new Set())}
                    className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted/30 transition-colors"
                  >
                    NONE
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2">
                {eraOrder.map(era => {
                  const isSelected = selectedEras.has(era);
                  const isComplete = results.get(era)?.success;
                  const isGenerating = generatingEras.has(era);
                  
                  return (
                    <button
                      key={era}
                      onClick={() => toggleEra(era)}
                      disabled={isGenerating}
                      className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded text-xs font-medium tracking-wider transition-all flex items-center justify-center gap-1 ${
                        isSelected
                          ? `bg-gradient-to-r ${eraConfig[era].gradient} text-white shadow-lg`
                          : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                      } ${isGenerating ? 'animate-pulse' : ''}`}
                    >
                      {isComplete && <Check className="w-3 h-3" />}
                      {isGenerating && <Loader2 className="w-3 h-3 animate-spin" />}
                      <span className="truncate">{eraConfig[era].year}</span>
                    </button>
                  );
                })}
              </div>

              {/* Era info preview */}
              <div className="mt-3 pt-3 border-t border-border/30">
                <p className="text-xs text-muted-foreground">
                  <span className="text-amber-500">{selectedEras.size}</span> eras selected • 
                  <span className="text-amber-500 ml-1">{selectedEras.size * 12}+</span> legends will appear
                </p>
              </div>
            </motion.div>

            {/* Generate Controls */}
            <motion.div 
              className="space-y-2 sm:space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={generateAll}
                disabled={!sourceImage || isGenerating || selectedEras.size === 0}
                className="w-full btn-gold py-3 sm:py-4 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 relative overflow-hidden group"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                    <span>GENERATING {generatingEras.size} ERAS...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-pulse" />
                    <span>GENERATE {selectedEras.size} ERAS</span>
                  </>
                )}
                
                {/* Progress bar */}
                {isGenerating && (
                  <div className="absolute bottom-0 left-0 h-1 bg-black/30 w-full">
                    <motion.div 
                      className="h-full bg-white/50"
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
                className="w-full btn-record py-2.5 sm:py-3 text-foreground disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>DOWNLOAD ALL ({completedCount})</span>
              </button>
            </motion.div>

            {/* Album Preview - Responsive Grid */}
            <AnimatePresence>
              {completedCount > 0 && (
                <motion.div 
                  className="surface-metal rounded-xl p-4 sm:p-5 border-metallic"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <h3 className="text-base sm:text-lg font-bold tracking-wider mb-3 sm:mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    YOUR ALBUM ({completedCount} PORTRAITS)
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    {eraOrder.map(era => {
                      const result = results.get(era);
                      if (!result?.success || !result.imageUrl) return null;
                      
                      return (
                        <motion.button
                          key={era}
                          onClick={() => setActiveEra(era)}
                          className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            activeEra === era ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-transparent hover:border-amber-500/50'
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
                  className="surface-metal rounded-xl overflow-hidden border-metallic"
                >
                  <div className="relative">
                    <img 
                      src={activeResult.imageUrl}
                      alt={activeEra ? eraConfig[activeEra].name : 'Generated portrait'}
                      className="w-full aspect-square object-cover"
                    />
                    {/* TLC Watermark */}
                    <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded text-xs text-white/70 backdrop-blur-sm">
                      TLC STUDIOS REWIND™
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <p className="text-base sm:text-lg font-bold">{activeEra && eraConfig[activeEra].name}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{activeEra && eraConfig[activeEra].tagline}</p>
                    <p className="text-xs text-amber-500/70 mt-1">Featuring: {activeEra && eraConfig[activeEra].featuring}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Prompt Viewer - Collapsible */}
            {activeEra && (
              <motion.div 
                className="surface-metal rounded-xl p-4 sm:p-5 border-metallic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <button
                  onClick={() => setShowPrompt(!showPrompt)}
                  className="w-full flex items-center justify-between"
                >
                  <h3 className="text-base sm:text-lg font-bold tracking-wider">PROMPT VIEWER</h3>
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
                      <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                        <button
                          onClick={() => setShowGlobalStyle(!showGlobalStyle)}
                          className="w-full surface-inset rounded-lg p-2 sm:p-3 text-left"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs tracking-wider text-amber-500">GLOBAL STYLE (TRIBUTE TO LEGENDS)</span>
                            {showGlobalStyle ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                          {showGlobalStyle && (
                            <p className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap font-mono max-h-40 overflow-y-auto">
                              {GLOBAL_STYLE}
                            </p>
                          )}
                        </button>

                        <div className="surface-inset rounded-lg p-2 sm:p-3 max-h-60 overflow-y-auto">
                          <p className="text-xs tracking-wider text-amber-500 mb-2">
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

        {/* Stats Bar */}
        <div className="mt-4 sm:mt-6 surface-metal rounded-xl p-3 sm:p-4 border-metallic">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm">
            <div className="text-center">
              <span className="text-muted-foreground">TOTAL:</span>
              <span className="ml-2 text-amber-500 font-bold">{eraOrder.length}</span>
            </div>
            <div className="text-center">
              <span className="text-muted-foreground">COMPLETE:</span>
              <span className="ml-2 text-emerald-500 font-bold">{completedCount}</span>
            </div>
            <div className="text-center">
              <span className="text-muted-foreground">GENERATING:</span>
              <span className="ml-2 text-cyan-500 font-bold">{generatingEras.size}</span>
            </div>
            <div className="text-center hidden sm:block">
              <span className="text-muted-foreground">LEGENDS FEATURED:</span>
              <span className="ml-2 text-amber-500 font-bold">100+</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
