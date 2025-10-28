export default function MiniChart() {
  const data = [
    { label: 'Mon', value: 85 },
    { label: 'Tue', value: 92 },
    { label: 'Wed', value: 78 },
    { label: 'Thu', value: 95 },
    { label: 'Fri', value: 88 },
    { label: 'Sat', value: 91 },
    { label: 'Sun', value: 97 },
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full h-64">
      <div className="flex items-end justify-between h-full gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1 h-full">
            <div className="flex-1 w-full flex items-end">
              <div
                className="w-full bg-gradient-to-t from-neon-blue to-neon-blue/50 rounded-t-lg transition-all duration-1000 hover:from-neon-blue hover:to-neon-blue/70 neon-glow cursor-pointer"
                style={{
                  height: `${(item.value / maxValue) * 100}%`,
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="w-full h-full flex items-start justify-center pt-2">
                  <span className="text-white font-semibold text-sm">{item.value}%</span>
                </div>
              </div>
            </div>
            <div className="text-steel-grey text-sm mt-2">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
