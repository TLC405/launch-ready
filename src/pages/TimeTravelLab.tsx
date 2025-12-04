import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { UploadPanel } from '@/components/lab/UploadPanel';
import { EraTimeline } from '@/components/lab/EraTimeline';
import { ResultsStage } from '@/components/lab/ResultsStage';
import { PolaroidGrid } from '@/components/lab/PolaroidGrid';
import { MasterTerminal } from '@/components/lab/MasterTerminal';
import { LabHeader } from '@/components/lab/LabHeader';
import generationService, { GenerationResult } from '@/services/generationService';
import trackingService from '@/services/trackingService';
import { eraOrder } from '@/lib/decadePrompts';

export default function TimeTravelLab() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [selectedEras, setSelectedEras] = useState<Set<string>>(new Set());
  const [generatingEras, setGeneratingEras] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<Map<string, GenerationResult>>(new Map());
  const [activeEra, setActiveEra] = useState<string | null>(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });

  const handleImageUpload = useCallback((base64: string) => {
    setSourceImage(base64);
    setResults(new Map());
    setActiveEra(null);
  }, []);

  const toggleEra = useCallback((era: string) => {
    setSelectedEras(prev => {
      const next = new Set(prev);
      if (next.has(era)) {
        next.delete(era);
      } else {
        next.add(era);
        trackingService.trackEraSelection(era, user?.id);
      }
      return next;
    });
  }, [user?.id]);

  const selectAllEras = useCallback(() => {
    setSelectedEras(new Set(eraOrder));
    eraOrder.forEach(era => trackingService.trackEraSelection(era, user?.id));
  }, [user?.id]);

  const generateSingle = useCallback(async (era: string) => {
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

    const result = await generationService.generatePortrait(era, sourceImage, user?.id);
    
    setResults(prev => new Map(prev).set(era, result));
    setGeneratingEras(prev => {
      const next = new Set(prev);
      next.delete(era);
      return next;
    });

    if (result.success) {
      toast({
        title: '🎉 Portrait Generated!',
        description: `Your ${era} portrait is ready!`
      });
    } else {
      toast({
        title: 'Generation Failed',
        description: result.error || 'Please try again',
        variant: 'destructive'
      });
    }
  }, [sourceImage, user?.id, toast]);

  const blitzAll = useCallback(async () => {
    if (!sourceImage) {
      toast({
        title: 'No photo uploaded',
        description: 'Please upload a photo first!',
        variant: 'destructive'
      });
      return;
    }

    const erasToGenerate = selectedEras.size > 0 ? Array.from(selectedEras) : eraOrder;
    
    setGeneratingEras(new Set(erasToGenerate));
    setProgress({ completed: 0, total: erasToGenerate.length });

    toast({
      title: '⚡ BLITZ MODE ACTIVATED',
      description: `Generating ${erasToGenerate.length} portraits...`
    });

    await generationService.generateAll(
      erasToGenerate,
      sourceImage,
      (completed, total, result) => {
        setProgress({ completed, total });
        setResults(prev => new Map(prev).set(result.era, result));
        setGeneratingEras(prev => {
          const next = new Set(prev);
          next.delete(result.era);
          return next;
        });
        if (!activeEra && result.success) {
          setActiveEra(result.era);
        }
      },
      user?.id
    );

    toast({
      title: '🎊 BLITZ COMPLETE!',
      description: 'All portraits have been generated!'
    });
  }, [sourceImage, selectedEras, user?.id, toast, activeEra]);

  const activeResult = activeEra ? results.get(activeEra) : null;

  return (
    <div className="min-h-screen bg-background">
      <LabHeader onTerminalToggle={() => setShowTerminal(!showTerminal)} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Upload & Controls */}
          <div className="lg:col-span-3 space-y-6">
            <UploadPanel 
              sourceImage={sourceImage}
              onImageUpload={handleImageUpload}
              onBlitzAll={blitzAll}
              onSelectAll={selectAllEras}
              isGenerating={generatingEras.size > 0}
              progress={progress}
            />
          </div>

          {/* Center Panel - Results */}
          <div className="lg:col-span-6">
            <ResultsStage
              activeEra={activeEra}
              result={activeResult}
              isGenerating={activeEra ? generatingEras.has(activeEra) : false}
            />
            
            <PolaroidGrid 
              results={results}
              onSelect={(era) => setActiveEra(era)}
              activeEra={activeEra}
            />
          </div>

          {/* Right Panel - Era Timeline */}
          <div className="lg:col-span-3">
            <EraTimeline
              selectedEras={selectedEras}
              generatingEras={generatingEras}
              completedEras={new Set(Array.from(results.entries()).filter(([_, r]) => r.success).map(([e]) => e))}
              onToggle={toggleEra}
              onGenerate={generateSingle}
            />
          </div>
        </div>
      </main>

      {/* Master Terminal Overlay */}
      <MasterTerminal
        isOpen={showTerminal}
        onClose={() => setShowTerminal(false)}
      />
    </div>
  );
}
