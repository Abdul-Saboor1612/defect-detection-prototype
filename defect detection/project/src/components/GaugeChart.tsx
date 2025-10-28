interface GaugeChartProps {
  value: number;
}

export default function GaugeChart({ value }: GaugeChartProps) {
  const rotation = (value / 100) * 180 - 90;

  return (
    <div className="relative w-full aspect-square max-w-[250px] mx-auto">
      <svg viewBox="0 0 200 120" className="w-full">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="1" />
          </linearGradient>
        </defs>

        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="rgba(56, 189, 248, 0.2)"
          strokeWidth="20"
          strokeLinecap="round"
        />

        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * 251.2} 251.2`}
          className="drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]"
        />

        <circle cx="100" cy="100" r="8" fill="#38BDF8" className="drop-shadow-[0_0_10px_rgba(56,189,248,1)]">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 100 100`}
            to={`${rotation} 100 100`}
            dur="2s"
            fill="freeze"
          />
        </circle>

        <line
          x1="100"
          y1="100"
          x2="100"
          y2="40"
          stroke="#38BDF8"
          strokeWidth="3"
          strokeLinecap="round"
          className="drop-shadow-[0_0_10px_rgba(56,189,248,1)]"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 100 100`}
            to={`${rotation} 100 100`}
            dur="2s"
            fill="freeze"
          />
        </line>
      </svg>

      <div className="absolute inset-0 flex items-center justify-center pt-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-white neon-text">{value}%</div>
          <div className="text-steel-grey text-sm mt-1">Confidence</div>
        </div>
      </div>
    </div>
  );
}
