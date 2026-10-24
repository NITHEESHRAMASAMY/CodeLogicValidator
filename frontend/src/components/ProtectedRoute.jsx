import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, ADMIN_EMAIL } from '../context/AuthContext';
import { Cpu } from 'lucide-react';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] text-white">
        <Cpu className="w-8 h-8 text-[#D4AF37] animate-spin mb-4" />
        <p className="text-xs uppercase font-mono tracking-widest text-gray-400">Authenticating Session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <Navigate
        to="/dashboard"
        replace
        state={{
          accessDenied: true,
          message: `Admin access restricted strictly to ${ADMIN_EMAIL}`
        }}
      />
    );
  }

  return children;
}
