import { useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import DetectionPage from './components/DetectionPage';
import LiveMonitoring from './components/LiveMonitoring';
import AnalyticsPage from './components/AnalyticsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [darkMode, setDarkMode] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard />;
      case 'detection':
        return <DetectionPage />;
      case 'monitoring':
        return <LiveMonitoring />;
      case 'analytics':
        return <AnalyticsPage />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />
      {renderPage()}
    </div>
  );
}

export default App;
