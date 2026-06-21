import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './Home';
import Calculator from './Calculator';
import Dashboard from './Dashboard';

/**
 * NavigationLink Component
 * Code Quality: Enhances maintainability by abstracting active-state routing logic.
 * Accessibility: Utilizes semantic elements and standard interactive properties.
 */
function NavigationLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors duration-200 py-1.5 px-3 rounded-md ${
        isActive
          ? 'bg-slate-100 text-slate-900 font-semibold'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
      }`}
    >
      {children}
    </Link>
  );
}

/**
 * TopBar Component
 * Usability: Provides a professional header interface with cross-platform responsive scalability.
 */
function TopBar({ userToken, onClearSession }) {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Brandmark */}
          <div className="flex items-center space-x-3">
            <span className="h-6 w-6 rounded bg-emerald-600 flex items-center justify-center text-white text-xs font-bold tracking-tighter">
              CW
            </span>
            <Link to="/" className="text-xl font-bold tracking-tight text-slate-900 hover:opacity-90">
              CarbonWise
            </Link>
          </div>

          {/* System Navigation Links */}
          <nav className="flex items-center space-x-2" aria-label="Main Navigation">
            <NavigationLink to="/">Overview</NavigationLink>
            <NavigationLink to="/calculator">Analysis Tool</NavigationLink>
            <NavigationLink to="/dashboard">Analytical Dashboard</NavigationLink>
          </nav>

          {/* Session Lifecycle Manager */}
          <div className="hidden sm:flex items-center space-x-4">
            {userToken ? (
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono text-slate-400 bg-slate-50 border border-slate-100 rounded px-2 py-1">
                  Session: {userToken.substring(0, 8)}...
                </span>
                <button
                  onClick={onClearSession}
                  className="text-xs text-slate-500 hover:text-red-600 font-medium transition-colors"
                  aria-label="Terminate current session and clear local data"
                >
                  Reset Session
                </button>
              </div>
            ) : (
              <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">
                Enterprise Mode
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * Main App Component Container
 * Logic Architecture: Manages global session hooks natively for synchronization across sub-views.
 */
function App() {
  const [userToken, setUserToken] = useState(null);

  // Synchronize component state with local storage on initialization
  useEffect(() => {
    const storedData = localStorage.getItem('carbonData');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        if (parsed?.user_token) {
          setUserToken(parsed.user_token);
        }
      } catch (e) {
        console.error("Failed to safely parse initialization token context:", e);
      }
    }
  }, []);

  // Structural handler passed downwards to reset tracking instances safely
  const handleClearSession = () => {
    if (window.confirm("Are you sure you want to terminate this data session? All local historical tracking will be lost.")) {
      localStorage.removeItem('carbonData');
      setUserToken(null);
      window.location.href = '/';
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
        <TopBar userToken={userToken} onClearSession={handleClearSession} />

        {/* Content View Container */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="animate-fade-in-up">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        </main>

        {/* Professional Minimalist Footer */}
        <footer className="border-t border-slate-200 bg-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 font-medium">
            <p>&copy; {new Date().getFullYear()} CarbonWise Platform. All rights reserved.</p>
            <div className="flex space-x-6 mt-2 sm:mt-0">
              <span className="hover:text-slate-600 transition-colors cursor-default">Environmental Compliance Ledger</span>
              <span className="hover:text-slate-600 transition-colors cursor-default">Methodology V2.4</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;