import { Download, Share2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { eraConfig } from '@/lib/decadePrompts';
import { GenerationResult } from '@/services/generationService';

interface ResultsStageProps {
  activeEra: string | null;
  result: GenerationResult | null | undefined;
  isGenerating: boolean;
}

export function ResultsStage({ activeEra, result, isGenerating }: ResultsStageProps) {
  const era = activeEra ? eraConfig[activeEra] : null;

  const handleDownload = () => {
    if (!result?.imageUrl) return;
    
    const link = document.createElement('a');
    link.href = result.imageUrl;
    link.download = `tlc-rewind-${activeEra}-${Date.now()}.png`;
    link.click();
  };

  const handleShare = async () => {
    if (!result?.imageUrl) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `TLC REWIND - ${era?.name}`,
          text: `Check out my time travel portrait from ${era?.year}!`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="retro-card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-display font-bold text-foreground">
          Results Stage
        </h2>
        {result?.success && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
            <Button size="sm" variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>
        )}
      </div>

      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
        {!activeEra && !isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center text-center p-6">
            <div>
              <div className="text-6xl mb-4">🕰️</div>
              <p className="text-muted-foreground">
                Select an era and generate to see your time travel portrait
              </p>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {/* Time tunnel animation */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
                <div className="absolute inset-2 rounded-full border-4 border-accent/30 animate-ping animation-delay-100" />
                <div className="absolute inset-4 rounded-full border-4 border-secondary/40 animate-ping animation-delay-200" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                </div>
              </div>
              <p className="text-lg font-display text-foreground">
                Traveling to {era?.year}...
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Meeting {era?.celebrity}
              </p>
            </div>
          </div>
        )}

        {result?.success && result.imageUrl && !isGenerating && (
          <>
            <img
              src={result.imageUrl}
              alt={`${era?.name} portrait`}
              className="w-full h-full object-contain animate-fade-in"
            />
            {/* Era badge overlay */}
            <div className={`
              absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-bold
              bg-gradient-to-r ${era?.gradient} text-white shadow-lg
            `}>
              {era?.name} • {era?.year}
            </div>
          </>
        )}

        {result && !result.success && !isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center text-center p-6">
            <div>
              <div className="text-6xl mb-4">😔</div>
              <p className="text-destructive font-medium">
                Generation Failed
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {result.error || 'Please try again'}
              </p>
            </div>
          </div>
        )}
      </div>

      {result?.generationTimeMs && result.success && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          Generated in {(result.generationTimeMs / 1000).toFixed(1)}s
        </p>
      )}
    </div>
  );
}
