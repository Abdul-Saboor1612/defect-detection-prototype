import { Activity, TrendingUp, AlertTriangle, CheckCircle, Clock, Cpu } from 'lucide-react';
import StatCard from './StatCard';
import GaugeChart from './GaugeChart';
import MiniChart from './MiniChart';

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Inspections',
      value: '12,847',
      change: '+12.5%',
      icon: Activity,
      trend: 'up',
    },
    {
      title: 'Defects Detected',
      value: '1,234',
      change: '-8.2%',
      icon: AlertTriangle,
      trend: 'down',
    },
    {
      title: 'Accuracy Rate',
      value: '98.7%',
      change: '+2.1%',
      icon: CheckCircle,
      trend: 'up',
    },
    {
      title: 'Avg Processing Time',
      value: '1.2s',
      change: '-15.3%',
      icon: Clock,
      trend: 'down',
    },
  ];

  const recentDefects = [
    { id: 'DEF-001', type: 'Surface Crack', confidence: 97.5, time: '2m ago', severity: 'high' },
    { id: 'DEF-002', type: 'Discoloration', confidence: 89.2, time: '5m ago', severity: 'medium' },
    { id: 'DEF-003', type: 'Dent', confidence: 95.8, time: '12m ago', severity: 'high' },
    { id: 'DEF-004', type: 'Scratch', confidence: 82.3, time: '18m ago', severity: 'low' },
  ];

  return (
    <div className="min-h-screen gradient-bg pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-white mb-2 font-poppins neon-text">
            Control Dashboard
          </h1>
          <p className="text-steel-grey">Real-time monitoring and analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  {stats.map((stat, index) => (
    <div
      key={index}
      className="
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-[0_0_20px_#38BDF8]
        hover:border-neon-blue/50
        rounded-xl
      "
    >
      <StatCard {...stat} delay={index * 0.1} />
    </div>
  ))}
</div>


        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 glass-effect rounded-xl p-6 border-2 border-neon-blue/30 hover:border-neon-blue/50 transition-all duration-300 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white font-poppins">
                Detection Performance
              </h2>
              <Activity className="h-6 w-6 text-neon-blue" />
            </div>
            <MiniChart />
          </div>

          <div className="glass-effect rounded-xl p-6 border-2 border-neon-blue/30 hover:border-neon-blue/50 transition-all duration-300 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white font-poppins">
                Model Confidence
              </h2>
              <Cpu className="h-6 w-6 text-neon-blue" />
            </div>
            <GaugeChart value={98.7} />
            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-steel-grey">Current Model</span>
                <span className="text-neon-blue font-semibold">YOLOv8-Ultra</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-steel-grey">Inference Time</span>
                <span className="text-neon-blue font-semibold">1.2ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-steel-grey">GPU Utilization</span>
                <span className="text-neon-blue font-semibold">67%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6 border-2 border-neon-blue/30 hover:border-neon-blue/50 transition-all duration-300 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white font-poppins">
              Recent Detections
            </h2>
            <TrendingUp className="h-6 w-6 text-neon-blue" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neon-blue/30">
                  <th className="text-left py-3 px-4 text-steel-grey font-semibold">ID</th>
                  <th className="text-left py-3 px-4 text-steel-grey font-semibold">Defect Type</th>
                  <th className="text-left py-3 px-4 text-steel-grey font-semibold">Confidence</th>
                  <th className="text-left py-3 px-4 text-steel-grey font-semibold">Time</th>
                  <th className="text-left py-3 px-4 text-steel-grey font-semibold">Severity</th>
                </tr>
              </thead>
              <tbody>
                {recentDefects.map((defect) => (
                  <tr
                    key={defect.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-4 text-neon-blue font-mono text-sm">{defect.id}</td>
                    <td className="py-3 px-4 text-white">{defect.type}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white/10 rounded-full h-2 max-w-[100px]">
                          <div
                            className="bg-neon-blue h-2 rounded-full neon-glow"
                            style={{ width: `${defect.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-neon-blue text-sm font-semibold">
                          {defect.confidence}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-steel-grey text-sm">{defect.time}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          defect.severity === 'high'
                            ? 'bg-red-500/20 text-red-400'
                            : defect.severity === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}
                      >
                        {defect.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
