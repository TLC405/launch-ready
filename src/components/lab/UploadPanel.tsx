import { useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Zap, CheckSquare, Loader2 } from 'lucide-react';

interface UploadPanelProps {
  sourceImage: string | null;
  onImageUpload: (base64: string) => void;
  onBlitzAll: () => void;
  onSelectAll: () => void;
  isGenerating: boolean;
  progress: { completed: number; total: number };
}

export function UploadPanel({
  sourceImage,
  onImageUpload,
  onBlitzAll,
  onSelectAll,
  isGenerating,
  progress
}: UploadPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onImageUpload(base64);
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onImageUpload(base64);
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const progressMessages = [
    "Flux capacitor charging...",
    "Calibrating temporal circuits...",
    "Warping through time...",
    "Stabilizing quantum fluctuations...",
    "Almost there, time traveler...",
    "Great Scott! Nearly done..."
  ];

  const getMessage = () => {
    if (progress.total === 0) return progressMessages[0];
    const index = Math.floor((progress.completed / progress.total) * progressMessages.length);
    return progressMessages[Math.min(index, progressMessages.length - 1)];
  };

  return (
    <div className="retro-card p-6 space-y-6">
      <h2 className="text-xl font-display font-bold text-foreground">
        Control Cockpit
      </h2>

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center
          transition-all cursor-pointer
          ${sourceImage 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50'
          }
        `}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {sourceImage ? (
          <div className="space-y-3">
            <div className="polaroid mx-auto w-32 h-32">
              <img
                src={sourceImage}
                alt="Your photo"
                className="w-full h-full object-cover rounded-sm"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Click to change photo
            </p>
          </div>
        ) : (
          <div className="space-y-3 py-4">
            <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">
                Drop your photo here
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={onBlitzAll}
          disabled={!sourceImage || isGenerating}
          className="w-full retro-button gradient-retro text-white h-12 text-lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              {progress.completed}/{progress.total}
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2" />
              BLITZ ALL ERAS
            </>
          )}
        </Button>

        <Button
          onClick={onSelectAll}
          variant="outline"
          className="w-full"
          disabled={isGenerating}
        >
          <CheckSquare className="w-4 h-4 mr-2" />
          Select All Eras
        </Button>
      </div>

      {/* Progress Message */}
      {isGenerating && (
        <div className="text-center py-4">
          <div className="w-full bg-muted rounded-full h-2 mb-3">
            <div 
              className="gradient-retro h-2 rounded-full transition-all duration-500"
              style={{ width: `${(progress.completed / progress.total) * 100}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">
            {getMessage()}
          </p>
        </div>
      )}
    </div>
  );
}
