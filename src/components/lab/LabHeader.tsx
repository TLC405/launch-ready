import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Terminal, LogOut, Shield, Home } from 'lucide-react';

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
    <header className="border-b border-border bg-card sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <Home className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold text-gradient-retro">
              TLC REWIND
            </h1>
            <p className="text-xs text-muted-foreground">
              Time Travel Lab
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onTerminalToggle}
            className="hidden sm:flex"
          >
            <Terminal className="w-4 h-4 mr-2" />
            Master Terminal
          </Button>

          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')}
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </Button>
          )}

          {user ? (
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          ) : (
            <Button variant="default" size="sm" onClick={() => navigate('/auth')}>
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
