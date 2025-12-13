import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Terminal, LogOut, Shield, Home, Sparkles } from 'lucide-react';

interface LabHeaderProps {
  onTerminalToggle: () => void;
}

export function LabHeader({ onTerminalToggle }: LabHeaderProps) {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <motion.header 
      className="glass-panel border-b border-border/30 sticky top-0 z-40"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button 
            onClick={() => navigate('/')} 
            className="w-10 h-10 rounded-xl glass-ultra flex items-center justify-center hover:bg-gold/10 hover:border-gold/30 border border-transparent transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home className="w-5 h-5 text-muted-foreground" />
          </motion.button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-display font-bold text-gradient-gold tracking-wider">
                TLC REWIND
              </h1>
              <Sparkles className="w-4 h-4 text-gold animate-pulse" />
            </div>
            <p className="text-[10px] tracking-[0.2em] text-muted-foreground/60 font-mono">
              TIME TRAVEL LAB
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <motion.button
            onClick={onTerminalToggle}
            className="hidden sm:flex glass-ultra px-4 py-2.5 rounded-xl items-center gap-2 text-xs font-medium tracking-wider hover:bg-gold/10 hover:border-gold/30 border border-transparent transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Terminal className="w-4 h-4 text-gold" />
            <span>TERMINAL</span>
          </motion.button>

          {isAdmin && (
            <motion.button
              onClick={() => navigate('/admin')}
              className="glass-ultra px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-medium tracking-wider hover:bg-gold/10 hover:border-gold/30 border border-transparent transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Shield className="w-4 h-4 text-gold" />
              <span className="hidden sm:inline">ADMIN</span>
            </motion.button>
          )}

          {user ? (
            <motion.button 
              onClick={handleSignOut}
              className="glass-ultra px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-medium tracking-wider hover:bg-destructive/10 hover:border-destructive/30 border border-transparent transition-all text-muted-foreground hover:text-destructive"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">LOGOUT</span>
            </motion.button>
          ) : (
            <motion.button 
              onClick={() => navigate('/auth')}
              className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              LOGIN
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
