import { motion } from 'framer-motion';
import { Camera, Upload, Check, X, Scan } from 'lucide-react';
import { useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface HoloUploadPanelProps {
  sourceImage: string | null;
  onImageUpload: (base64: string) => void;
  onClear: () => void;
}

export function HoloUploadPanel({ sourceImage, onImageUpload, onClear }: HoloUploadPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image under 10MB',
        variant: 'destructive',
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onImageUpload(base64);
      toast({
        title: 'FACE LOCKED',
        description: 'Biometric scan complete',
      });
    };
    reader.readAsDataURL(file);
  }, [onImageUpload, toast]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };
  
  return (
    <motion.div
      className="fixed top-24 right-6 z-40"
      initial={{ opacity: 0, x: 50, rotateY: -30 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {/* Holographic container */}
      <div
        className="relative w-44 h-52 cursor-pointer group"
        onClick={() => !sourceImage && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {/* Holographic glow effect */}
        <motion.div
          className="absolute -inset-2 rounded-lg opacity-50"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.3), rgba(168, 85, 247, 0.3), rgba(255, 41, 117, 0.3))',
            filter: 'blur(10px)',
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Main panel */}
        <div
          className="relative w-full h-full rounded-lg overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(0, 10, 20, 0.85) 0%, rgba(0, 20, 40, 0.9) 100%)',
            border: '1px solid rgba(0, 240, 255, 0.4)',
            boxShadow: `
              0 0 20px rgba(0, 240, 255, 0.2),
              inset 0 0 30px rgba(0, 240, 255, 0.05),
              0 20px 40px rgba(0, 0, 0, 0.5)
            `,
          }}
        >
          {/* Grid overlay */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />
          
          {/* Header */}
          <div 
            className="h-8 flex items-center justify-between px-3"
            style={{
              borderBottom: '1px solid rgba(0, 240, 255, 0.3)',
              background: 'rgba(0, 240, 255, 0.05)',
            }}
          >
            <span className="font-mono text-[10px] text-[hsl(185,100%,50%)] tracking-wider">
              BIOMETRIC.SCAN
            </span>
            {sourceImage && (
              <motion.button
                onClick={(e) => { e.stopPropagation(); onClear(); }}
                className="text-[hsl(330,100%,60%)] hover:text-[hsl(330,100%,70%)]"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={14} />
              </motion.button>
            )}
          </div>
          
          {/* Content area */}
          <div className="flex-1 flex items-center justify-center p-4">
            {sourceImage ? (
              <div className="relative w-full aspect-square">
                <img
                  src={sourceImage}
                  alt="Uploaded face"
                  className="w-full h-full object-cover rounded"
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.3))',
                  }}
                />
                {/* Scan animation */}
                <motion.div
                  className="absolute inset-0 rounded"
                  style={{
                    background: 'linear-gradient(180deg, rgba(0, 240, 255, 0.2) 0%, transparent 20%, transparent 80%, rgba(0, 240, 255, 0.2) 100%)',
                  }}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            ) : (
              <motion.div
                className="flex flex-col items-center gap-3 text-center"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    border: '2px dashed rgba(0, 240, 255, 0.5)',
                    background: 'rgba(0, 240, 255, 0.05)',
                  }}
                >
                  <Camera className="w-8 h-8 text-[hsl(185,100%,50%)]" />
                </div>
                <div className="font-mono text-[10px] text-[hsl(185,100%,50%)] tracking-wider opacity-80">
                  UPLOAD FACE
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Status bar */}
          <div 
            className="h-8 flex items-center justify-center gap-2 px-3"
            style={{
              borderTop: '1px solid rgba(0, 240, 255, 0.3)',
              background: 'rgba(0, 240, 255, 0.05)',
            }}
          >
            {sourceImage ? (
              <>
                <Check size={12} className="text-[hsl(152,70%,50%)]" />
                <span className="font-mono text-[10px] text-[hsl(152,70%,50%)] tracking-wider">
                  FACE LOCKED
                </span>
              </>
            ) : (
              <>
                <Scan size={12} className="text-[hsl(38,92%,50%)]" />
                <span className="font-mono text-[10px] text-[hsl(38,92%,50%)] tracking-wider">
                  AWAITING INPUT
                </span>
              </>
            )}
          </div>
        </div>
        
        {/* Hover effect */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            border: '2px solid rgba(0, 240, 255, 0.6)',
          }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </motion.div>
  );
}
