import { TrendingUp, BarChart3, Download, Calendar, Filter, FileText } from 'lucide-react';
import { useState } from 'react';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7days');
  const [productId, setProductId] = useState('all');

  const kpis = [
    { label: 'Total Inspections', value: '45,234', change: '+12.5%', trend: 'up' },
    { label: 'Defect Rate', value: '9.6%', change: '-2.3%', trend: 'down' },
    { label: 'Avg Confidence', value: '97.2%', change: '+1.8%', trend: 'up' },
    { label: 'Processing Time', value: '1.1s', change: '-8.5%', trend: 'down' },
  ];

  const accuracyData = [
    { month: 'Jan', accuracy: 94.5 },
    { month: 'Feb', accuracy: 95.2 },
    { month: 'Mar', accuracy: 96.1 },
    { month: 'Apr', accuracy: 96.8 },
    { month: 'May', accuracy: 97.2 },
    { month: 'Jun', accuracy: 97.9 },
  ];

  const defectTypes = [
    { type: 'Surface Crack', count: 523, percentage: 42 },
    { type: 'Discoloration', count: 312, percentage: 25 },
    { type: 'Dent', count: 248, percentage: 20 },
    { type: 'Scratch', count: 165, percentage: 13 },
  ];

  const recentReports = [
    { id: 'RPT-001', date: '2025-10-22', product: 'PCB-A100', defects: 45, status: 'completed' },
    { id: 'RPT-002', date: '2025-10-21', product: 'PCB-B200', defects: 32, status: 'completed' },
    { id: 'RPT-003', date: '2025-10-20', product: 'PCB-C300', defects: 28, status: 'completed' },
  ];

  // Function to export CSV
  const exportCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const rows = data.map((row) => headers.map((field) => row[field]));

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += headers.join(',') + '\n';
    rows.forEach((row) => {
      csvContent += row.join(',') + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen gradient-bg pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-white mb-2 font-poppins neon-text">
            Reports & Analytics
          </h1>
          <p className="text-steel-grey">Comprehensive insights and performance metrics</p>
        </div>

        {/* Filters & Export */}
        <div className="glass-effect rounded-xl p-6 border-2 border-neon-blue/30 mb-8 animate-slide-up">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-neon-blue" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-white/5 border border-neon-blue/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-neon-blue" />
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="bg-white/5 border border-neon-blue/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue"
              >
                <option value="all">All Products</option>
                <option value="pcb-a">PCB-A Series</option>
                <option value="pcb-b">PCB-B Series</option>
                <option value="pcb-c">PCB-C Series</option>
              </select>
            </div>

            <button
              onClick={() => exportCSV(recentReports, 'recent_reports.csv')}
              className="ml-auto px-6 py-2 bg-neon-blue text-navy-dark rounded-lg font-semibold hover:bg-neon-blue/90 transition-all duration-300 neon-glow flex items-center gap-2"
            >
              <Download className="h-5 w-5" />
              Export Report
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => (
            <div
              key={index}
              className="glass-effect rounded-xl p-6 border-2 border-neon-blue/30 hover:border-neon-blue/50 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-steel-grey text-sm">{kpi.label}</span>
                <span
                  className={`text-sm font-semibold ${
                    kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {kpi.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-white neon-text">{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Model Accuracy & Defect Distribution */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-effect rounded-xl p-6 border-2 border-neon-blue/30 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white font-poppins">
                Model Accuracy Trend
              </h2>
              <TrendingUp className="h-6 w-6 text-neon-blue" />
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {accuracyData.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="text-neon-blue text-sm font-semibold mb-2">{item.accuracy}%</div>
                  <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                    <div
                      className="w-full bg-gradient-to-t from-neon-blue to-neon-blue/50 rounded-t-lg neon-glow hover:from-neon-blue hover:to-neon-blue/70 transition-all duration-300 cursor-pointer"
                      style={{ height: `${(item.accuracy / 100) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-steel-grey text-sm mt-2">{item.month}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6 border-2 border-neon-blue/30 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white font-poppins">
                Defect Distribution
              </h2>
              <BarChart3 className="h-6 w-6 text-neon-blue" />
            </div>
            <div className="space-y-4">
              {defectTypes.map((defect, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white font-semibold">{defect.type}</span>
                    <span className="text-neon-blue">{defect.count} defects</span>
                  </div>
                  <div className="relative w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-neon-blue to-neon-blue/70 rounded-full neon-glow transition-all duration-1000"
                      style={{ width: `${defect.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-steel-grey text-xs">{defect.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="glass-effect rounded-xl p-6 border-2 border-neon-blue/30 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white font-poppins">Recent Reports</h2>
            <FileText className="h-6 w-6 text-neon-blue" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentReports.map((report, index) => (
              <div
                key={index}
                className="glass-effect rounded-lg p-4 border-2 border-neon-blue/30 hover:border-neon-blue hover:bg-white/5 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-neon-blue font-semibold font-mono">{report.id}</div>
                    <div className="text-steel-grey text-sm">{report.date}</div>
                  </div>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                    {report.status}
                  </span>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-steel-grey">Product:</span>
                    <span className="text-white font-semibold">{report.product}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-steel-grey">Defects:</span>
                    <span className="text-red-400 font-semibold">{report.defects}</span>
                  </div>
                </div>
                <button
                  onClick={() => exportCSV([report], `${report.id}_report.csv`)}
                  className="w-full px-4 py-2 bg-neon-blue/20 text-neon-blue rounded-lg font-semibold hover:bg-neon-blue hover:text-navy-dark transition-all duration-300 flex items-center justify-center gap-2 group-hover:neon-glow"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
