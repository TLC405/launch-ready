import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#f97316', '#ec4899', '#8b5cf6', '#06b6d4', '#22c55e', '#eab308', '#ef4444', '#3b82f6', '#6366f1', '#14b8a6'];

export function EraPopularityChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: logs } = await supabase.from('generation_logs').select('era').eq('success', true);
    if (logs) {
      const counts: Record<string, number> = {};
      logs.forEach(l => { counts[l.era] = (counts[l.era] || 0) + 1; });
      setData(Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value));
    }
  };

  return (
    <div className="retro-card p-6">
      <h3 className="text-lg font-display font-bold mb-4">Era Popularity</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {data.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
