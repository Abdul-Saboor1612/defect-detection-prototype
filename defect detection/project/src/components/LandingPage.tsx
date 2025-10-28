import {
  Play,
  Zap,
  BarChart3,
  Database,
  Brain,
  ArrowRight,
  Settings,
  Eye,
} from "lucide-react";

interface LandingPageProps {
  onNavigate: (page: string) => void;
  isDay?: boolean; // ✅ Optional prop to check for light mode toggle
}

export default function LandingPage({ onNavigate, isDay = false }: LandingPageProps) {
  const features = [
    {
      icon: Eye,
      title: "Real-Time Visual Inspection",
      description: "Instant defect detection with AI-powered computer vision analysis",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive insights with interactive charts and KPI tracking",
    },
    {
      icon: Database,
      title: "Smart Data Storage",
      description: "Secure cloud storage with advanced querying capabilities",
    },
    {
      icon: Brain,
      title: "Deep Learning Models",
      description: "State-of-the-art neural networks trained on industrial datasets",
    },
  ];

  // ✅ Background color logic for toggle (day/night)
  const bgClass = isDay
    ? "bg-gradient-to-b from-[#FFF9F3] to-[#FFEFD5]" // Light cream gradient
    : "gradient-bg"; // Your existing dark gradient

  const textColor = isDay ? "text-gray-800" : "text-white";
  const subText = isDay ? "text-gray-600" : "text-steel-grey";
  const neon = isDay ? "text-[#d97706]" : "text-neon-blue"; // orange glow in day

  return (
    <div className={`min-h-screen ${bgClass} overflow-hidden`}>
      {/* Floating Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-slide-up">
            <div className="inline-block mb-6">
              <Zap className={`h-16 w-16 ${neon} neon-glow mx-auto`} />
            </div>
            <h1
              className={`text-5xl md:text-7xl font-bold mb-6 font-poppins ${textColor}`}
            >
              <span className="neon-text">AI-Powered</span> Defect Detection
            </h1>
            <h2
              className={`text-3xl md:text-4xl font-semibold mb-8 font-poppins ${subText}`}
            >
              for Smart Manufacturing
            </h2>
            <p className={`text-xl ${subText} max-w-3xl mx-auto mb-12`}>
              Automate inspection, improve quality, reduce downtime with cutting-edge
              artificial intelligence and computer vision technology
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate("detection")}
                className="group px-8 py-4 bg-neon-blue text-navy-dark rounded-lg font-semibold text-lg hover:bg-neon-blue/90 transition-all duration-300 neon-glow flex items-center justify-center gap-2"
              >
                Start Detection
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate("dashboard")}
                className="group px-8 py-4 glass-effect text-neon-blue rounded-lg font-semibold text-lg hover:bg-neon-blue/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Play className="h-5 w-5" />
                View Demo
              </button>
            </div>
          </div>

          {/* ✅ Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {features.map((feature, index) => (
              <div
                key={index}
                style={{ animationDelay: `${index * 0.1}s` }}
                className={`
                  relative glass-effect rounded-xl p-6
                  border-2 border-transparent
                  transition-all duration-500 ease-out
                  group animate-slide-up
                  hover:-translate-y-2 hover:shadow-[0_0_25px_#38BDF8]
                  hover:border-neon-blue/60
                  ${
                    isDay
                      ? "bg-white/70 hover:bg-[#FFF6E5]/90 border-[#fcd34d]/40"
                      : "hover:bg-gradient-to-b hover:from-[#1E293B]/60 hover:to-[#0F172A]/90"
                  }
                `}
              >
                {/* Background glow circle */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-neon-blue/10 blur-3xl rounded-full"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-neon-blue/10 blur-2xl rounded-full"></div>
                </div>

                {/* Icon */}
                <div className="relative mb-4 z-10">
                  <feature.icon
                    className={`h-12 w-12 ${
                      isDay ? "text-[#d97706]" : "text-neon-blue"
                    } group-hover:scale-110 transition-transform duration-300`}
                  />
                </div>

                {/* Title */}
                <h3
                  className={`text-xl font-semibold mb-3 font-poppins z-10 relative ${
                    textColor
                  }`}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p className={`${subText} z-10 relative`}>{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Industry 4.0 Section */}
          <div className="glass-effect rounded-2xl p-12 text-center">
            <Settings className="h-16 w-16 text-neon-blue mx-auto mb-6 animate-rotate-slow" />
            <h3 className={`text-3xl font-bold mb-4 font-poppins ${textColor}`}>
              Industry 4.0 Ready
            </h3>
            <p className={`${subText} text-lg max-w-2xl mx-auto`}>
              Built for engineers, inspectors, and operators. Seamlessly integrate with
              your existing manufacturing processes and take quality control to the next
              level.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-neon-blue/30 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="h-px w-64 mx-auto mb-6 bg-gradient-to-r from-transparent via-neon-blue to-transparent animate-pulse-glow"></div>
          <p className={`${subText} font-medium`}>
            © 2025 AI Inspect. Powered by Advanced Machine Learning
          </p>
        </div>
      </footer>
    </div>
  );
}
