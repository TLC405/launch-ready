import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Reliable royalty-free ambient tracks from verified working sources
const AMBIENT_TRACKS = [
  {
    name: "Ethereal Ambience",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    name: "Cosmic Flow",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    name: "Deep Space",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export function AmbientMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showControls, setShowControls] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    const audio = new Audio();
    audio.loop = true;
    audio.volume = volume;
    audio.preload = 'auto';
    
    audio.addEventListener('canplaythrough', () => {
      setIsLoaded(true);
    });

    audio.addEventListener('ended', () => {
      // Move to next track
      setCurrentTrack(prev => (prev + 1) % AMBIENT_TRACKS.length);
    });

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = AMBIENT_TRACKS[currentTrack].url;
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.src = AMBIENT_TRACKS[currentTrack].url;
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log('Audio playback failed:', error);
      setIsPlaying(false);
    }
  };

  const nextTrack = () => {
    setCurrentTrack(prev => (prev + 1) % AMBIENT_TRACKS.length);
  };

  return (
    <div 
      className="fixed bottom-4 right-4 z-50"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full right-0 mb-2 p-3 rounded-xl surface-metal border-metallic min-w-[200px]"
          >
            <p className="text-xs text-amber-500 mb-2 font-medium tracking-wider">NOW PLAYING</p>
            <p className="text-sm text-foreground mb-3 truncate">
              {AMBIENT_TRACKS[currentTrack].name}
            </p>
            
            {/* Volume slider */}
            <div className="flex items-center gap-2 mb-2">
              <VolumeX className="w-3 h-3 text-muted-foreground" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 h-1 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:rounded-full"
              />
              <Volume2 className="w-3 h-3 text-muted-foreground" />
            </div>

            <button
              onClick={nextTrack}
              className="w-full text-xs text-muted-foreground hover:text-foreground py-1 transition-colors"
            >
              Skip Track →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.button
        onClick={togglePlay}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
          isPlaying 
            ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-black shadow-lg shadow-amber-500/30' 
            : 'surface-metal border-metallic text-muted-foreground hover:text-foreground'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isPlaying ? (
          <motion.div
            className="flex items-center gap-0.5"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div className="w-1 h-3 bg-black rounded-full" style={{ animation: 'vuPulse 0.4s ease-in-out infinite' }} />
            <div className="w-1 h-4 bg-black rounded-full" style={{ animation: 'vuPulse 0.3s ease-in-out infinite 0.1s' }} />
            <div className="w-1 h-2 bg-black rounded-full" style={{ animation: 'vuPulse 0.5s ease-in-out infinite 0.2s' }} />
          </motion.div>
        ) : (
          <Music className="w-5 h-5" />
        )}
      </motion.button>

      {/* Subtle label */}
      <AnimatePresence>
        {!isPlaying && !showControls && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -top-6 right-0 text-xs text-muted-foreground whitespace-nowrap"
          >
            ♪ Ambient
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
