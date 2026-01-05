import { Helmet } from 'react-helmet-async';
import { useState, useCallback } from 'react';
import { OKCNightscape } from '@/components/hud/OKCNightscape';
import { Scanlines } from '@/components/hud/Scanlines';
import { GlitchEffects, DataFragments } from '@/components/hud/GlitchEffects';
import { WindshieldFrame } from '@/components/hud/WindshieldFrame';
import { UltraTitle } from '@/components/hud/UltraTitle';
import { HoloUploadPanel } from '@/components/hud/HoloUploadPanel';
import { HoloSceneSelector } from '@/components/hud/HoloSceneSelector';
import { DashboardCluster } from '@/components/hud/DashboardCluster';
import { useToast } from '@/hooks/use-toast';
import generationService, { GenerationResult } from '@/services/generationService';

const ALL_ERAS = ['1865', '1900s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', 'Homeless', 'Day One'];

const Index = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [selectedEras, setSelectedEras] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<Map<string, GenerationResult>>(new Map());
  const { toast } = useToast();
  
  const handleImageUpload = useCallback((base64: string) => {
    setSourceImage(base64);
  }, []);
  
  const handleClearImage = useCallback(() => {
    setSourceImage(null);
    setResults(new Map());
    setProgress(0);
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
    
    // Process sequentially for better UX
    for (const era of erasArray) {
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
    
    const successCount = Array.from(results.values()).filter(r => r.success).length;
    toast({
      title: 'TIME WARP COMPLETE',
      description: `${successCount}/${erasArray.length} portraits generated successfully`,
    });
  }, [sourceImage, selectedEras, isGenerating, toast, results]);
  
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
        {/* Background layers */}
        <OKCNightscape />
        
        {/* HUD effects */}
        <Scanlines />
        <GlitchEffects />
        <DataFragments />
        <WindshieldFrame />
        
        {/* Ultra title */}
        <UltraTitle />
        
        {/* Holographic upload panel - top right */}
        <HoloUploadPanel
          sourceImage={sourceImage}
          onImageUpload={handleImageUpload}
          onClear={handleClearImage}
        />
        
        {/* Scene selector dropdown */}
        <HoloSceneSelector
          selectedEras={selectedEras}
          onToggleEra={handleToggleEra}
          onSelectAll={handleSelectAll}
          onSelectNone={handleSelectNone}
        />
        
        {/* Dashboard cluster */}
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
