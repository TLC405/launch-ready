import { Helmet } from 'react-helmet-async';
import { useState, useCallback, useRef } from 'react';
import { OKCNightscape } from '@/components/hud/OKCNightscape';
import { Scanlines } from '@/components/hud/Scanlines';
import { GlitchEffects, DataFragments } from '@/components/hud/GlitchEffects';
import { WindshieldFrame } from '@/components/hud/WindshieldFrame';
import { UltraTitle } from '@/components/hud/UltraTitle';
import { HoloUploadPanel } from '@/components/hud/HoloUploadPanel';
import { HoloSceneSelector } from '@/components/hud/HoloSceneSelector';
import { DashboardCluster } from '@/components/hud/DashboardCluster';
import { HoloResultsGallery } from '@/components/hud/HoloResultsGallery';
import { useToast } from '@/hooks/use-toast';
import generationService, { GenerationResult } from '@/services/generationService';

const ALL_ERAS = ['1865', '1900s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', 'Homeless', 'Day One'];

const Index = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [selectedEras, setSelectedEras] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<Map<string, GenerationResult>>(new Map());
  const [currentGeneratingEra, setCurrentGeneratingEra] = useState<string | undefined>();
  const { toast } = useToast();
  
  const handleImageUpload = useCallback((base64: string) => {
    setSourceImage(base64);
  }, []);
  
  const handleClearImage = useCallback(() => {
    setSourceImage(null);
    setResults(new Map());
    setProgress(0);
    setCurrentGeneratingEra(undefined);
  }, []);
  
  const handleToggleEra = useCallback((era: string) => {
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
  
  const handleSelectAll = useCallback(() => {
    setSelectedEras(new Set(ALL_ERAS));
  }, []);
  
  const handleSelectNone = useCallback(() => {
    setSelectedEras(new Set());
  }, []);
  
  const handleEngage = useCallback(async () => {
    if (!sourceImage || selectedEras.size === 0 || isGenerating) return;
    
    setIsGenerating(true);
    setProgress(0);
    setResults(new Map());
    
    const erasArray = Array.from(selectedEras);
    let completed = 0;
    
    toast({
      title: 'TIME WARP ENGAGED',
      description: `Generating ${erasArray.length} portraits...`,
    });
    
    // Process sequentially for better UX and to show current era
    for (const era of erasArray) {
      setCurrentGeneratingEra(era);
      
      try {
        const result = await generationService.generatePortrait(era, sourceImage);
        setResults(prev => new Map(prev).set(era, result));
        completed++;
        setProgress((completed / erasArray.length) * 100);
      } catch (error) {
        console.error(`Failed to generate ${era}:`, error);
        setResults(prev => new Map(prev).set(era, {
          era,
          imageUrl: null,
          success: false,
          error: error instanceof Error ? error.message : 'Generation failed',
        }));
        completed++;
        setProgress((completed / erasArray.length) * 100);
      }
    }
    
    setIsGenerating(false);
    setCurrentGeneratingEra(undefined);
    
    // Count successes from final results
    const finalResults = new Map(results);
    erasArray.forEach(era => {
      if (!finalResults.has(era)) {
        // This shouldn't happen, but just in case
      }
    });
    
    toast({
      title: 'TIME WARP COMPLETE',
      description: `Portraits generated successfully`,
    });
  }, [sourceImage, selectedEras, isGenerating, toast]);
  
  const handleDownload = useCallback(async () => {
    const successfulResults = Array.from(results.entries()).filter(([, r]) => r.success && r.imageUrl);
    
    if (successfulResults.length === 0) {
      toast({
        title: 'No images to download',
        description: 'Generate some portraits first',
        variant: 'destructive',
      });
      return;
    }
    
    for (const [era, result] of successfulResults) {
      if (result.imageUrl) {
        const link = document.createElement('a');
        link.href = result.imageUrl;
        link.download = `REWIND_${era.replace(/\s+/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Small delay between downloads
        await new Promise(r => setTimeout(r, 500));
      }
    }
    
    toast({
      title: 'DOWNLOAD COMPLETE',
      description: `${successfulResults.length} portraits saved`,
    });
  }, [results, toast]);
  
  const completedCount = Array.from(results.values()).filter(r => r.success).length;
  
  return (
    <>
      <Helmet>
        <title>TLC Studios REWIND | Time Travel Photography</title>
        <meta name="description" content="Step into history with TLC Studios REWIND. Create AI-generated portraits across legendary eras." />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden">
        {/* Layer 1: Background */}
        <OKCNightscape />
        
        {/* Layer 2: HUD effects */}
        <Scanlines />
        <GlitchEffects />
        <DataFragments />
        <WindshieldFrame />
        
        {/* Layer 3: Title - center top */}
        <UltraTitle />
        
        {/* Layer 4: Results gallery - left side (appears when generating/results exist) */}
        <HoloResultsGallery
          results={results}
          isGenerating={isGenerating}
          selectedEras={selectedEras}
          currentGeneratingEra={currentGeneratingEra}
        />
        
        {/* Layer 5: Upload panel - top right */}
        <HoloUploadPanel
          sourceImage={sourceImage}
          onImageUpload={handleImageUpload}
          onClear={handleClearImage}
        />
        
        {/* Layer 6: Scene selector - below upload panel */}
        <HoloSceneSelector
          selectedEras={selectedEras}
          onToggleEra={handleToggleEra}
          onSelectAll={handleSelectAll}
          onSelectNone={handleSelectNone}
        />
        
        {/* Layer 7: Dashboard cluster - bottom */}
        <DashboardCluster
          sourceImage={sourceImage}
          selectedEras={selectedEras}
          isGenerating={isGenerating}
          progress={progress}
          completedCount={completedCount}
          onEngage={handleEngage}
          onDownload={handleDownload}
        />
      </div>
    </>
  );
};

export default Index;
