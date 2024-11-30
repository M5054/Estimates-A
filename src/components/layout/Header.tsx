import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BarChart2, Users, FileText, Building2, LogOut, ArrowUpCircle, Calendar, Grid } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAuth();
  const location = useLocation();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Logout initiated');
    
    try {
      setIsOpen(false);
      await signOut();
      console.log('Logout completed');
      
      // Redirect to landing page with pricing for mobile devices
      if (window.innerWidth <= 640) { // sm breakpoint in Tailwind
        const url = new URL(window.location.href);
        const baseUrl = `${url.protocol}//${url.host}`;
        window.location.replace(`${baseUrl}/?upgrade=true#pricing`);
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleUpgrade = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Upgrade initiated');
    
    try {
      setIsOpen(false);
      await signOut();
      window.location.replace('/?upgrade=true#pricing');
      console.log('Upgrade completed');
    } catch (error) {
      console.error('Error during upgrade:', error);
    }
  };

  const handleMobileNavClick = () => {
    setIsOpen(false);
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart2 },
    { path: '/estimates', label: 'Estimates', icon: FileText },
    { path: '/appointments', label: 'Appointments', icon: Calendar },
    { path: '/clients', label: 'Clients', icon: Users },
    { path: '/floor-plan', label: 'Floor Plan', icon: Grid },
    { path: '/business', label: 'Business', icon: Building2 },
  ];

  if (['/login', '/signup', '/'].includes(location.pathname)) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/dashboard" className="flex items-center" onClick={handleMobileNavClick}>
              <BarChart2 className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">EstimadoPro</span>
            </Link>
          </div>

          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {navItems.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className="text-gray-700 hover:text-indigo-600"
              >
                {label}
              </Link>
            ))}
            <button
              onClick={handleUpgrade}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <ArrowUpCircle className="h-4 w-4 mr-2" />
              Upgrade Plan
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-700 hover:text-indigo-600"
            >
              <LogOut className="h-5 w-5 mr-1" />
              <span>Log Out</span>
            </button>
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              aria-expanded={isOpen}
            >
              <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={handleMobileNavClick}
                className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              >
                <Icon className="h-5 w-5 mr-3" />
                {label}
              </Link>
            ))}
            <button
              onClick={handleUpgrade}
              className="w-full flex items-center px-3 py-2 text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <ArrowUpCircle className="h-5 w-5 mr-3" />
              Upgrade Plan
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;