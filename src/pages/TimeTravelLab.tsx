import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Zap, Download, ArrowLeft, Check, X, 
  ImageIcon, ChevronDown, ChevronUp, Loader2 
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

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSourceImage(base64);
      setResults(new Map());
      toast({
        title: 'Photo Loaded',
        description: 'Your master tape is ready for recording.'
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
        description: 'Please upload a photo first!',
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
        title: 'Portrait Complete!',
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
        description: 'Please upload a photo first!',
        variant: 'destructive'
      });
      return;
    }

    const erasToGenerate = Array.from(selectedEras);
    if (erasToGenerate.length === 0) {
      toast({
        title: 'No eras selected',
        description: 'Please select at least one era.',
        variant: 'destructive'
      });
      return;
    }
    
    setGeneratingEras(new Set(erasToGenerate));

    toast({
      title: 'REWIND INITIATED',
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
      title: 'REWIND COMPLETE!',
      description: 'All portraits have been generated!'
    });
  }, [sourceImage, selectedEras, toast, activeEra]);

  const completedCount = Array.from(results.values()).filter(r => r.success).length;
  const activeResult = activeEra ? results.get(activeEra) : null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SynthwaveBackground />

      {/* Header */}
      <header className="relative z-50 p-4 border-b border-border/30 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm tracking-wider">BACK TO HQ</span>
          </Link>
          
          <h1 className="text-2xl font-bold tracking-[0.15em] text-gradient-gold">TLC REWIND LAB</h1>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">ONLINE</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left - ERA TV WALL */}
          <div className="lg:col-span-7">
            <EraTVWall
              activeEra={activeEra}
              generatingEras={generatingEras}
              results={results}
              onSelectEra={(era) => setActiveEra(era)}
              onGenerateEra={generateSingle}
            />
          </div>

          {/* Right - BOOMBOX CONSOLE */}
          <div className="lg:col-span-5 space-y-4">
            {/* Upload Panel */}
            <div className="surface-metal rounded-xl p-5 border-metallic">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold tracking-wider">MASTER TAPE</h3>
                {sourceImage && (
                  <button
                    onClick={() => {
                      setSourceImage(null);
                      setResults(new Map());
                    }}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {sourceImage ? (
                <div className="relative aspect-square w-32 mx-auto rounded-full overflow-hidden border-4 border-amber-500/50">
                  <img src={sourceImage} alt="Your photo" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video surface-inset rounded-lg border-2 border-dashed border-border/50 hover:border-amber-500/50 transition-colors flex flex-col items-center justify-center gap-3"
                >
                  <Upload className="w-10 h-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">DROP YOUR PHOTO</p>
                </button>
              )}
            </div>

            {/* Era Selection */}
            <div className="surface-metal rounded-xl p-5 border-metallic">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold tracking-wider">ERA SELECTOR</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedEras(new Set(eraOrder))}
                    className="text-xs text-amber-500 hover:text-amber-400"
                  >
                    ALL
                  </button>
                  <span className="text-muted-foreground">/</span>
                  <button
                    onClick={() => setSelectedEras(new Set())}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    NONE
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {eraOrder.map(era => (
                  <button
                    key={era}
                    onClick={() => toggleEra(era)}
                    className={`px-3 py-1.5 rounded text-xs font-medium tracking-wider transition-all ${
                      selectedEras.has(era)
                        ? `bg-gradient-to-r ${eraConfig[era].gradient} text-white`
                        : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    {results.get(era)?.success && <Check className="w-3 h-3 inline mr-1" />}
                    {eraConfig[era].year}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Viewer */}
            {activeEra && (
              <div className="surface-metal rounded-xl p-5 border-metallic">
                <button
                  onClick={() => setShowPrompt(!showPrompt)}
                  className="w-full flex items-center justify-between"
                >
                  <h3 className="text-lg font-bold tracking-wider">PROMPT VIEWER</h3>
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
                        {/* Global Style Toggle */}
                        <button
                          onClick={() => setShowGlobalStyle(!showGlobalStyle)}
                          className="w-full surface-inset rounded-lg p-3 text-left"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs tracking-wider text-amber-500">GLOBAL STYLE</span>
                            {showGlobalStyle ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                          {showGlobalStyle && (
                            <p className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                              {GLOBAL_STYLE}
                            </p>
                          )}
                        </button>

                        {/* Era Prompt */}
                        <div className="surface-inset rounded-lg p-3">
                          <p className="text-xs tracking-wider text-amber-500 mb-2">
                            {eraConfig[activeEra].name.toUpperCase()} PROMPT
                          </p>
                          <p className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                            {eraConfig[activeEra].prompt}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Controls */}
            <div className="space-y-3">
              <button
                onClick={generateAll}
                disabled={!sourceImage || generatingEras.size > 0 || selectedEras.size === 0}
                className="w-full btn-gold py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {generatingEras.size > 0 ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    GENERATING {generatingEras.size} ERAS...
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6" />
                    GENERATE {selectedEras.size} ERAS
                  </>
                )}
              </button>

              <button
                onClick={() => eraOrder.forEach(era => {
                  const result = results.get(era);
                  if (result?.imageUrl) {
                    const link = document.createElement('a');
                    link.href = result.imageUrl;
                    link.download = `tlc-rewind-${era}.png`;
                    link.click();
                  }
                })}
                disabled={completedCount === 0}
                className="w-full btn-record py-3 text-foreground disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <Download className="w-5 h-5" />
                DOWNLOAD ALL ({completedCount})
              </button>
            </div>

            {/* Album Preview */}
            {completedCount > 0 && (
              <div className="surface-metal rounded-xl p-5 border-metallic">
                <h3 className="text-lg font-bold tracking-wider mb-4">
                  YOUR ALBUM ({completedCount} PORTRAITS)
                </h3>
                
                <div className="grid grid-cols-3 gap-2">
                  {eraOrder.map(era => {
                    const result = results.get(era);
                    if (!result?.success || !result.imageUrl) return null;
                    
                    return (
                      <motion.button
                        key={era}
                        onClick={() => setActiveEra(era)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          activeEra === era ? 'border-amber-500' : 'border-transparent'
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
              </div>
            )}

            {/* Active Result Preview */}
            {activeResult?.success && activeResult.imageUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="surface-metal rounded-xl overflow-hidden border-metallic"
              >
                <img 
                  src={activeResult.imageUrl}
                  alt={activeEra ? eraConfig[activeEra].name : 'Generated portrait'}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-4">
                  <p className="text-lg font-bold">{activeEra && eraConfig[activeEra].name}</p>
                  <p className="text-sm text-muted-foreground">{activeEra && eraConfig[activeEra].shortTagline}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
