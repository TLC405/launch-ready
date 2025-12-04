import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { StatsCards } from '@/components/admin/StatsCards';
import { GenerationChart } from '@/components/admin/GenerationChart';
import { EraPopularityChart } from '@/components/admin/EraPopularityChart';
import { SessionTable } from '@/components/admin/SessionTable';
import { ArrowLeft, RefreshCw, Download } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalGenerations: number;
  successfulGenerations: number;
  activeSessions: number;
  popularEra: string;
}

export default function AdminDashboard() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/auth');
    }
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      // Fetch total users
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch generation stats
      const { data: genLogs } = await supabase
        .from('generation_logs')
        .select('success, era');

      const totalGenerations = genLogs?.length || 0;
      const successfulGenerations = genLogs?.filter(g => g.success).length || 0;

      // Find popular era
      const eraCounts: Record<string, number> = {};
      genLogs?.forEach(g => {
        if (g.success) {
          eraCounts[g.era] = (eraCounts[g.era] || 0) + 1;
        }
      });
      const popularEra = Object.entries(eraCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

      // Fetch active sessions (last 24 hours)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count: sessionCount } = await supabase
        .from('user_sessions')
        .select('*', { count: 'exact', head: true })
        .gte('started_at', yesterday);

      setStats({
        totalUsers: userCount || 0,
        totalGenerations,
        successfulGenerations,
        activeSessions: sessionCount || 0,
        popularEra
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async () => {
    try {
      const { data: generations } = await supabase
        .from('generation_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (generations) {
        const csv = [
          ['ID', 'User ID', 'Era', 'Success', 'Time (ms)', 'Created At'].join(','),
          ...generations.map(g => [
            g.id,
            g.user_id || 'anonymous',
            g.era,
            g.success,
            g.generation_time_ms || 0,
            g.created_at
          ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tlc-generations-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
      }
    } catch (err) {
      console.error('Error exporting data:', err);
    }
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-2xl font-display">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/lab')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-display font-bold text-gradient-retro">
                Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                TLC Studios REWIND Analytics
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchStats}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <StatsCards stats={stats} isLoading={isLoading} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GenerationChart />
          <EraPopularityChart />
        </div>

        {/* Sessions Table */}
        <SessionTable />
      </main>
    </div>
  );
}
