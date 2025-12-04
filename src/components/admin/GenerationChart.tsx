import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function GenerationChart() {
  const [data, setData] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: logs } = await supabase
      .from('generation_logs')
      .select('created_at')
      .eq('success', true)
      .order('created_at', { ascending: false })
      .limit(500);

    if (logs) {
      const grouped: Record<string, number> = {};
      logs.forEach(log => {
        const date = new Date(log.created_at).toLocaleDateString();
        grouped[date] = (grouped[date] || 0) + 1;
      });
      setData(Object.entries(grouped).slice(0, 7).reverse().map(([date, count]) => ({ date, count })));
    }
  };

  return (
    <div className="retro-card p-6">
      <h3 className="text-lg font-display font-bold mb-4">Generations (Last 7 Days)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
