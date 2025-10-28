import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: 'up' | 'down';
  delay?: number;
}

export default function StatCard({ title, value, change, icon: Icon, trend, delay = 0 }: StatCardProps) {
  return (
    <div
      className="glass-effect rounded-xl p-6 border-2 border-neon-blue/30 hover:border-neon-blue/50 transition-all duration-300 hover:scale-105 animate-slide-up group"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 glass-effect rounded-lg group-hover:bg-neon-blue/20 transition-colors">
          <Icon className="h-6 w-6 text-neon-blue" />
        </div>
        <span
          className={`text-sm font-semibold ${
            trend === 'up' ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {change}
        </span>
      </div>
      <h3 className="text-steel-grey text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white neon-text">{value}</p>
    </div>
  );
}
