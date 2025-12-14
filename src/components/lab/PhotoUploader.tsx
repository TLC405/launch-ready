import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Check, X, Camera, Scan } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploaderProps {
  sourceImage: string | null;
  onImageUpload: (base64: string) => void;
  onClear: () => void;
}

export function PhotoUploader({ sourceImage, onImageUpload, onClear }: PhotoUploaderProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const processFile = useCallback((file: File) => {
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
      onImageUpload(base64);
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
  }, [onImageUpload, toast]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };
  
  return (
    <motion.div 
      className="photo-uploader-panel rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="photo-uploader-header px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              className={`scan-indicator ${sourceImage ? 'scan-indicator-active' : ''}`}
              animate={sourceImage ? { 
                boxShadow: [
                  '0 0 15px hsla(var(--success), 0.4)',
                  '0 0 30px hsla(var(--success), 0.8)',
                  '0 0 15px hsla(var(--success), 0.4)'
                ]
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Scan className={`w-5 h-5 ${sourceImage ? 'text-success' : 'text-muted-foreground'}`} />
            </motion.div>
            
            <div>
              <h3 className="photo-uploader-title">FACE SCAN</h3>
              <p className="photo-uploader-subtitle">
                {sourceImage ? 'LOCKED & LOADED' : 'AWAITING INPUT'}
              </p>
            </div>
          </div>
          
          {sourceImage && (
            <motion.button
              onClick={onClear}
              className="clear-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 sm:p-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="user"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {sourceImage ? (
          <div className="flex items-center gap-5">
            {/* Photo preview */}
            <div className="relative flex-shrink-0">
              <motion.div 
                className="absolute -inset-3 rounded-2xl bg-success/20 blur-xl"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="relative w-24 h-24 rounded-xl overflow-hidden ring-2 ring-success/60 shadow-2xl">
                <img src={sourceImage} alt="Your photo" className="w-full h-full object-cover" />
                {/* Scan lines */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-b from-success/20 via-transparent to-transparent"
                  animate={{ y: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              {/* Lock badge */}
              <motion.div 
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg bg-success flex items-center justify-center shadow-lg"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                <Check className="w-4 h-4 text-success-foreground" strokeWidth={3} />
              </motion.div>
            </div>
            
            {/* Status text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <motion.div 
                  className="w-2 h-2 rounded-full bg-success shadow-[0_0_10px_hsla(var(--success),0.9)]"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <p className="text-sm font-bold text-success tracking-wider">FACE LOCKED</p>
              </div>
              <p className="text-xs text-muted-foreground/80">
                Ready to travel through time
              </p>
              <motion.button
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 text-xs text-muted-foreground hover:text-gold flex items-center gap-2 transition-colors"
                whileHover={{ x: 2 }}
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="underline underline-offset-4">Change photo</span>
              </motion.button>
            </div>
          </div>
        ) : (
          <motion.button
            onClick={() => fileInputRef.current?.click()}
            className="upload-zone w-full"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {/* Scan effect */}
            <motion.div 
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent"
              animate={{ y: [0, 120, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            
            <div className="relative z-10 py-8">
              <motion.div 
                className="w-16 h-16 mx-auto rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-4"
                animate={{ borderColor: ['hsla(var(--gold), 0.2)', 'hsla(var(--gold), 0.5)', 'hsla(var(--gold), 0.2)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Upload className="w-7 h-7 text-gold" />
              </motion.div>
              <p className="text-sm font-bold tracking-[0.15em] text-foreground">DROP YOUR PHOTO</p>
              <p className="text-xs text-muted-foreground/60 mt-1">or click to upload</p>
            </div>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
