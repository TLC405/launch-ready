import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Session { id: string; user_id: string | null; started_at: string; browser: string | null; }

export function SessionTable() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    supabase.from('user_sessions').select('*').order('started_at', { ascending: false }).limit(20).then(({ data }) => {
      if (data) setSessions(data);
    });
  }, []);

  return (
    <div className="retro-card p-6">
      <h3 className="text-lg font-display font-bold mb-4">Recent Sessions</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border">
            <th className="text-left py-2">User</th><th className="text-left py-2">Browser</th><th className="text-left py-2">Started</th>
          </tr></thead>
          <tbody>
            {sessions.map(s => (
              <tr key={s.id} className="border-b border-border/50">
                <td className="py-2 font-mono text-xs">{s.user_id?.slice(0, 8) || 'anon'}...</td>
                <td className="py-2">{s.browser || 'Unknown'}</td>
                <td className="py-2">{new Date(s.started_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
