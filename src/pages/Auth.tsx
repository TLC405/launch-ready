import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [quickAccess, setQuickAccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, checkAdminAccess } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: isLogin ? 'Welcome back!' : 'Account created!',
          description: isLogin ? 'Redirecting to the lab...' : 'You can now access the time machine!'
        });
        navigate('/lab');
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAccess = async () => {
    if (!quickAccess.includes(':')) {
      toast({
        title: 'Invalid format',
        description: 'Quick access code should be in format username:password',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    const isAdmin = await checkAdminAccess(quickAccess);
    
    if (isAdmin) {
      toast({
        title: '🔓 Admin Access Granted',
        description: 'Welcome to the control room!'
      });
      navigate('/admin');
    } else {
      toast({
        title: 'Access Denied',
        description: 'Invalid quick access code',
        variant: 'destructive'
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Synthwave Background */}
      <div className="fixed inset-0 synthwave-grid opacity-20 pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-electric-blue/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed inset-0 scanlines pointer-events-none opacity-30" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-neon-pink to-chrome-purple mb-4 glow-pink">
            <span className="font-display font-bold text-white text-xl">TLC</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-chrome mb-2">
            REWIND
          </h1>
          <p className="text-muted-foreground text-sm">
            <span className="text-neon-pink">T</span>ime <span className="text-electric-blue">L</span>oop <span className="text-chrome-purple">C</span>redentials
          </p>
        </div>

        {/* Auth Card */}
        <div className="retro-card p-8">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6 text-center">
            {isLogin ? 'Login' : 'Create Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              className="w-full retro-button gradient-retro text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
            </button>
          </div>

          {/* Quick Access (Secret Admin) */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="space-y-2">
              <Label htmlFor="quick-access" className="text-xs text-muted-foreground">
                Quick Access
              </Label>
              <div className="flex gap-2">
                <Input
                  id="quick-access"
                  type="password"
                  value={quickAccess}
                  onChange={(e) => setQuickAccess(e.target.value)}
                  placeholder="code"
                  className="text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleQuickAccess}
                  disabled={isLoading || !quickAccess}
                >
                  Go
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Back to home link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
