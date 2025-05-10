import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Activity, Menu, X, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackground(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    if (isLandingPage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    closeMenu();
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      closeMenu();
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-50 w-full transition-all duration-300',
        isLandingPage
          ? showBackground
            ? 'bg-background/95 backdrop-blur-md shadow-glow'
            : 'bg-transparent'
          : 'bg-background-light shadow-md md:pl-64'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-3 text-white hover:opacity-90 transition-all duration-200 group"
          >
            <div className="relative">
              <Activity className="h-8 w-8 text-primary-500 transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                PulseBoard
              </span>
              <span className="text-xs text-primary-400">by CLOUD CRAFT LLP</span>
            </div>
          </button>

          <div className={cn(
            "hidden md:flex items-center space-x-6",
            isLandingPage ? "ml-0" : "ml-auto"
          )}>
            {isLandingPage ? (
              <>
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  About
                </button>
                {session.user ? (
                  <Button
                    as={Link}
                    to="/dashboard"
                    variant="primary"
                    className="shadow-glow"
                  >
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      as={Link}
                      to="/auth/login"
                      variant="ghost"
                    >
                      Sign In
                    </Button>
                    <Button
                      as={Link}
                      to="/auth/register"
                      variant="primary"
                      className="shadow-glow"
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </>
            ) : (
              session.user && (
                <div className="flex items-center space-x-4">
                  <div className="relative group">
                    <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                      <span>{session.user.full_name || session.user.email}</span>
                      {session.user.avatar_url ? (
                        <img
                          src={session.user.avatar_url}
                          alt="Avatar"
                          className="h-8 w-8 rounded-full ring-2 ring-primary-500/50"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary-700 flex items-center justify-center text-white ring-2 ring-primary-500/50">
                          {session.user.full_name?.[0] || session.user.email[0]}
                        </div>
                      )}
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-background-light rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-primary-900/30 hover:text-white flex items-center"
                      >
                        <Settings size={16} className="mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={signOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-primary-900/30 hover:text-white flex items-center"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background-light shadow-lg"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {isLandingPage ? (
                <>
                  <button
                    onClick={() => scrollToSection('features')}
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Features
                  </button>
                  <button
                    onClick={() => scrollToSection('pricing')}
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Pricing
                  </button>
                  <button
                    onClick={() => scrollToSection('about')}
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    About
                  </button>
                  {session.user ? (
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-md"
                      onClick={closeMenu}
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/auth/login"
                        className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                        onClick={closeMenu}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/auth/register"
                        className="block px-3 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-md"
                        onClick={closeMenu}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </>
              ) : (
                session.user && (
                  <>
                    <div className="flex items-center space-x-3 px-3 py-2">
                      {session.user.avatar_url ? (
                        <img
                          src={session.user.avatar_url}
                          alt="Avatar"
                          className="h-8 w-8 rounded-full ring-2 ring-primary-500/50"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary-700 flex items-center justify-center text-white ring-2 ring-primary-500/50">
                          {session.user.full_name?.[0] || session.user.email[0]}
                        </div>
                      )}
                      <div className="text-white">
                        {session.user.full_name || session.user.email}
                      </div>
                    </div>
                    <Link
                      to="/settings"
                      className="flex items-center px-3 py-2 text-gray-300 hover:text-white transition-colors"
                      onClick={closeMenu}
                    >
                      <Settings size={16} className="mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        closeMenu();
                      }}
                      className="flex items-center w-full text-left px-3 py-2 text-gray-300 hover:text-white transition-colors"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </button>
                  </>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};