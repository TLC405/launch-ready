import { Button } from '@/components/ui/button';
import { Check, Loader2, Play } from 'lucide-react';
import { eraConfig, eraOrder } from '@/lib/decadePrompts';

interface EraTimelineProps {
  selectedEras: Set<string>;
  generatingEras: Set<string>;
  completedEras: Set<string>;
  onToggle: (era: string) => void;
  onGenerate: (era: string) => void;
}

export function EraTimeline({
  selectedEras,
  generatingEras,
  completedEras,
  onToggle,
  onGenerate
}: EraTimelineProps) {
  return (
    <div className="retro-card p-6">
      <h2 className="text-xl font-display font-bold text-foreground mb-4">
        Era Timeline
      </h2>

      <div className="space-y-3">
        {eraOrder.map((eraKey) => {
          const era = eraConfig[eraKey];
          const isSelected = selectedEras.has(eraKey);
          const isGenerating = generatingEras.has(eraKey);
          const isCompleted = completedEras.has(eraKey);

          return (
            <div
              key={eraKey}
              className={`
                relative rounded-xl p-4 border-2 transition-all cursor-pointer
                ${isSelected 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
                }
                ${isCompleted ? 'ring-2 ring-green-500/50' : ''}
              `}
              onClick={() => onToggle(eraKey)}
            >
              {/* Era Badge */}
              <div className={`
                absolute -top-2 -left-2 px-2 py-0.5 rounded-full text-xs font-bold
                bg-gradient-to-r ${era.gradient} text-white
              `}>
                {era.year}
              </div>

              {/* Status Icon */}
              <div className="absolute -top-2 -right-2">
                {isGenerating && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  </div>
                )}
                {isCompleted && !isGenerating && (
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <div className="pt-2">
                <h3 className="font-display font-bold text-foreground">
                  {era.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {era.celebrity}
                </p>

                {/* Generate Button */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="mt-2 w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onGenerate(eraKey);
                  }}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-1" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
