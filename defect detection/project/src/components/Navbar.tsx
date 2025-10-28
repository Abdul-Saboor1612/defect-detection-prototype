import { Menu, X, Scan, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Navbar({ currentPage, onNavigate, darkMode, toggleDarkMode }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'detection', label: 'Detection' },
    { id: 'monitoring', label: 'Live Monitor' },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-neon-blue/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Scan className="h-8 w-8 text-neon-blue animate-pulse-glow" />
              <div className="absolute inset-0 bg-neon-blue/30 blur-xl rounded-full"></div>
            </div>
            <span className="text-xl font-bold text-white neon-text font-poppins">
              AI Inspect
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  currentPage === item.id
                    ? 'bg-neon-blue/20 text-neon-blue neon-glow'
                    : 'text-steel-grey hover:text-neon-blue hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg glass-effect hover:bg-neon-blue/20 transition-all duration-300"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-neon-blue" />
              ) : (
                <Moon className="h-5 w-5 text-neon-blue" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg glass-effect hover:bg-neon-blue/20"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-neon-blue" />
              ) : (
                <Menu className="h-6 w-6 text-neon-blue" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden glass-effect border-t border-neon-blue/30">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 ${
                  currentPage === item.id
                    ? 'bg-neon-blue/20 text-neon-blue'
                    : 'text-steel-grey hover:text-neon-blue hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
