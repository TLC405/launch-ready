import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PremiumBackground3D from '@/components/PremiumBackground3D';
import { AmbientMusic } from '@/components/AmbientMusic';
import { TimeCircuitSelector } from '@/components/lab/TimeCircuitSelector';
import { PhotoUploader } from '@/components/lab/PhotoUploader';
import { ResultsGallery } from '@/components/lab/ResultsGallery';
import { eraConfig, eraOrder, EraId } from '@/lib/decadePrompts';
import generationService, { GenerationResult } from '@/services/generationService';

export default function TimeTravelLab() {
  const { toast } = useToast();
  
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

      {/* Minimal Header */}
      <header className="relative z-50 py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            className="flex items-center justify-between"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <Link 
              to="/" 
              className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <motion.div 
                className="w-10 h-10 rounded-xl bg-zinc-900/80 border border-zinc-700/50 flex items-center justify-center group-hover:border-gold/30 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.div>
              <span className="text-sm tracking-wider hidden sm:block">BACK</span>
            </Link>
            
            <div className="text-center">
              <div className="flex items-center gap-3 justify-center">
                <Sparkles className="w-5 h-5 text-gold" />
                <h1 className="text-2xl sm:text-3xl font-bold tracking-[0.15em] text-gradient-gold">
                  TLC REWIND
                </h1>
                <Sparkles className="w-5 h-5 text-gold" />
              </div>
              <p className="text-[9px] tracking-[0.3em] text-muted-foreground/50 font-mono mt-1">
                TIME CIRCUIT LABORATORY
              </p>
            </div>
            
            <motion.div 
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-success/10 border border-success/20"
              animate={{ 
                borderColor: ['hsla(var(--success), 0.2)', 'hsla(var(--success), 0.4)', 'hsla(var(--success), 0.2)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div 
                className="w-2 h-2 rounded-full bg-success"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-[10px] tracking-wider text-success font-mono hidden sm:block">ONLINE</span>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Main Content - Simple 2 Column Layout */}
      <main className="relative z-10 container mx-auto px-4 pb-8">
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
      </main>

      <AmbientMusic />
    </div>
  );
}
