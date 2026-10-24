import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { LogicProvider } from './context/LogicContext';
import { GamificationProvider } from './context/GamificationContext';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import GlobalSearchModal from './components/GlobalSearchModal';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';

import ProblemListPage from './pages/ProblemListPage';
import ProblemDetailPage from './pages/ProblemDetailPage';
import ClassroomPage from './pages/ClassroomPage';
import DoubtClarificationPage from './pages/DoubtClarificationPage';
import ProfilePage from './pages/ProfilePage';
import AnalyticsPage from './pages/AnalyticsPage';
import HistoryPage from './pages/HistoryPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('clv_splash_seen');
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('clv_splash_seen', 'true');
    setShowSplash(false);
  };

  return (
    <AuthProvider>
      <LogicProvider>
        <GamificationProvider>
          <Router>
            <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#D4AF37] selection:text-black flex flex-col font-sans">
              
              {/* Animated 3-Second Splash Screen */}
              <AnimatePresence mode="wait">
                {showSplash && (
                  <SplashScreen onComplete={handleSplashComplete} />
                )}
              </AnimatePresence>

              {/* Navigation Header Bar */}
              <Navbar />

              {/* Global Search Ctrl+K Modal */}
              <GlobalSearchModal />

              {/* Application Routes */}
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/verify-email" element={<VerifyEmailPage />} />
                  
                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <ProblemListPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/problem/:id"
                    element={
                      <ProtectedRoute>
                        <ProblemDetailPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/classroom"
                    element={
                      <ProtectedRoute>
                        <ClassroomPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/doubts"
                    element={
                      <ProtectedRoute>
                        <DoubtClarificationPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <ProtectedRoute>
                        <AnalyticsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/history"
                    element={
                      <ProtectedRoute>
                        <HistoryPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </main>

            </div>
          </Router>
        </GamificationProvider>
      </LogicProvider>
    </AuthProvider>
  );
}
