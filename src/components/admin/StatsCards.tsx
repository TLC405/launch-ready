import { Users, Zap, CheckCircle, Activity } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalUsers: number;
    totalGenerations: number;
    successfulGenerations: number;
    activeSessions: number;
    popularEra: string;
  } | null;
  isLoading: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const cards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-primary' },
    { label: 'Total Generations', value: stats?.totalGenerations || 0, icon: Zap, color: 'text-accent' },
    { label: 'Successful', value: stats?.successfulGenerations || 0, icon: CheckCircle, color: 'text-secondary' },
    { label: 'Active Sessions (24h)', value: stats?.activeSessions || 0, icon: Activity, color: 'text-neon-pink' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="retro-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="text-3xl font-display font-bold mt-1">
                {isLoading ? '...' : card.value.toLocaleString()}
              </p>
            </div>
            <card.icon className={`w-8 h-8 ${card.color}`} />
          </div>
        </div>
      ))}
      <div className="retro-card p-6 sm:col-span-2 lg:col-span-4">
        <p className="text-sm text-muted-foreground">Most Popular Era</p>
        <p className="text-2xl font-display font-bold mt-1 text-gradient-retro">
          {isLoading ? '...' : stats?.popularEra || 'N/A'}
        </p>
      </div>
    </div>
  );
}
