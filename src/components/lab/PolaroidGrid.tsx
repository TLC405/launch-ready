import { eraConfig, eraOrder } from '@/lib/decadePrompts';
import { GenerationResult } from '@/services/generationService';
import { Download } from 'lucide-react';

interface PolaroidGridProps {
  results: Map<string, GenerationResult>;
  onSelect: (era: string) => void;
  activeEra: string | null;
}

export function PolaroidGrid({ results, onSelect, activeEra }: PolaroidGridProps) {
  const successfulResults = eraOrder.filter(era => results.get(era)?.success);

  if (successfulResults.length === 0) {
    return null;
  }

  const downloadAll = () => {
    successfulResults.forEach((era, index) => {
      const result = results.get(era);
      if (result?.imageUrl) {
        setTimeout(() => {
          const link = document.createElement('a');
          link.href = result.imageUrl!;
          link.download = `tlc-rewind-${era}-${Date.now()}.png`;
          link.click();
        }, index * 500);
      }
    });
  };

  return (
    <div className="retro-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-display font-bold text-foreground">
          Your Album ({successfulResults.length} portraits)
        </h2>
        <button
          onClick={downloadAll}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <Download className="w-4 h-4" />
          Download All
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {successfulResults.map((eraKey, index) => {
          const result = results.get(eraKey);
          const era = eraConfig[eraKey];
          const isActive = activeEra === eraKey;
          
          // Random rotation for polaroid effect
          const rotation = ((index % 5) - 2) * 3;

          return (
            <div
              key={eraKey}
              className={`
                polaroid cursor-pointer transition-all duration-300 hover:scale-105
                ${isActive ? 'ring-4 ring-primary scale-105' : ''}
              `}
              style={{ '--rotation': `${rotation}deg` } as React.CSSProperties}
              onClick={() => onSelect(eraKey)}
            >
              <div className="aspect-square overflow-hidden rounded-sm bg-muted">
                {result?.imageUrl && (
                  <img
                    src={result.imageUrl}
                    alt={era.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="polaroid-label font-body">
                {era.year}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
