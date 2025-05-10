import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { ApplicationDetails } from './pages/ApplicationDetails';
import { Settings } from './pages/Settings';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

function App() {
  // Add Google Fonts
  useEffect(() => {
    const linkInterFont = document.createElement('link');
    linkInterFont.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    linkInterFont.rel = 'stylesheet';
    document.head.appendChild(linkInterFont);

    const linkLexendFont = document.createElement('link');
    linkLexendFont.href = 'https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap';
    linkLexendFont.rel = 'stylesheet';
    document.head.appendChild(linkLexendFont);

    return () => {
      document.head.removeChild(linkInterFont);
      document.head.removeChild(linkLexendFont);
    };
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/applications" element={<Dashboard />} />
          <Route path="/applications/:id" element={<ApplicationDetails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;