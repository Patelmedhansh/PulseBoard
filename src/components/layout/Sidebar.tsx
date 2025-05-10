import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import {
  Activity,
  BarChart2,
  Settings,
  PlusCircle,
  ChevronRight,
  Database,
  Bell,
  AlertCircle,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: BarChart2, path: '/dashboard' },
  { name: 'Applications', icon: Activity, path: '/applications' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

interface SidebarProps {
  onAddApplication: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onAddApplication }) => {
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const toggleMobile = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogoClick = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <button
          onClick={toggleMobile}
          className="p-2 bg-background-light rounded-md text-gray-300 hover:text-white focus:outline-none"
        >
          <Menu size={24} />
        </button>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      <motion.aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen bg-background-light shadow-lg transition-all',
          expanded ? 'w-64' : 'w-20',
          'md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
        initial={false}
        animate={{
          width: expanded ? 256 : 80,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-3 group"
            >
              <div className="relative">
                <Activity className="h-8 w-8 text-primary-500 transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full animate-pulse" />
              </div>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col"
                >
                  <span className="font-display font-bold text-xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    PulseBoard
                  </span>
                  <span className="text-xs text-primary-400">by CLOUD CRAFT LLP</span>
                </motion.div>
              )}
            </button>
            <div className="flex">
              <button
                onClick={toggleSidebar}
                className="text-gray-400 hover:text-white md:block hidden"
              >
                <ChevronRight
                  className={cn('transform transition-transform', !expanded && 'rotate-180')}
                  size={20}
                />
              </button>
              <button
                onClick={toggleMobile}
                className="text-gray-400 hover:text-white md:hidden"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center p-3 rounded-md group transition-all duration-200',
                    isActive || (item.path === '/applications' && location.pathname.startsWith('/applications/'))
                      ? 'bg-primary-900/50 text-primary-400 shadow-glow'
                      : 'text-gray-400 hover:text-white hover:bg-background/60'
                  )
                }
                onClick={() => setMobileOpen(false)}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="ml-3 font-medium"
                  >
                    {item.name}
                  </motion.span>
                )}
              </NavLink>
            ))}

            <div className="pt-6 px-3">
              <div
                className={cn(
                  'text-xs uppercase text-gray-500 font-semibold',
                  !expanded && 'sr-only'
                )}
              >
                Quick Access
              </div>
            </div>

            <button
              onClick={() => {
                onAddApplication();
                setMobileOpen(false);
              }}
              className="flex items-center w-full p-3 rounded-md text-gray-400 hover:text-white hover:bg-background/60 transition-all duration-200"
            >
              <PlusCircle size={20} className="flex-shrink-0" />
              {expanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="ml-3 font-medium"
                >
                  Add Application
                </motion.span>
              )}
            </button>
          </div>

          <div className="p-4 border-t border-gray-700">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center">
                <Database size={16} className="text-gray-500" />
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="ml-2 text-xs text-gray-500"
                  >
                    Database: Connected
                  </motion.span>
                )}
              </div>
              <div className="flex items-center">
                <Bell size={16} className="text-gray-500" />
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="ml-2 text-xs text-gray-500"
                  >
                    Notifications: Active
                  </motion.span>
                )}
              </div>
              <div className="flex items-center">
                <AlertCircle size={16} className="text-warning-500" />
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="ml-2 text-xs text-warning-500"
                  >
                    System maintenance: 24h
                  </motion.span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};