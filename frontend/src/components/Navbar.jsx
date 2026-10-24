import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import ProblemRequestModal from './ProblemRequestModal';
import {
  Code2,
  LogOut,
  User,
  Search,
  BarChart3,
  History,
  BookOpen,
  HelpCircle,
  Users,
  ShieldAlert,
  Sparkles,
  Mail,
  Send
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin, adminEmail } = useAuth();
  const { setIsSearchOpen } = useGamification();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProblemRequestModal, setShowProblemRequestModal] = useState(false);

  const baseNavLinks = [
    { label: 'Problems', path: '/dashboard', icon: BookOpen },
    { label: 'Classroom', path: '/classroom', icon: Users },
    { label: 'Doubts', path: '/doubts', icon: HelpCircle },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'History', path: '/history', icon: History },
  ];

  // The Admin navigation link is strictly restricted to nitheesh25bls@gmail.com
  const navLinks = isAdmin
    ? [...baseNavLinks, { label: 'Admin', path: '/admin', icon: ShieldAlert }]
    : baseNavLinks;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-[#2D2D2D]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E1E1E] to-[#0F0F0F] border border-[#D4AF37]/40 flex items-center justify-center group-hover:border-[#D4AF37] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all">
            <Code2 className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <span className="font-display font-bold text-lg text-gold-gradient tracking-tight block leading-none">
              CLV
            </span>
            <span className="text-[9px] uppercase tracking-widest text-gray-400 font-mono block mt-0.5">
              Logic Validator
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        {user && (
          <nav className="hidden md:flex items-center gap-1 bg-[#141414] p-1 rounded-xl border border-[#2D2D2D]">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold font-display transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#F5E6AB] via-[#D4AF37] to-[#A38218] text-black shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Menu Controls */}
        <div className="flex items-center gap-2.5">
          
          {/* Admin Direct Quick Access Button - Strictly restricted to Admin Account */}
          {user && isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-[#D4AF37] text-xs font-mono font-bold text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.3)] transition-all cursor-pointer"
              title="Open Admin Management Portal (System Admin Only)"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Admin</span>
            </Link>
          )}

          {/* Request Problem Mail Button */}
          {user && (
            <button
              onClick={() => setShowProblemRequestModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141414] hover:bg-[#1F1F1F] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-xs font-mono text-[#D4AF37] transition-all shadow-sm"
              title={`Mail a problem with description and test cases to Admin (${adminEmail})`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Request Problem</span>
            </button>
          )}

          {/* Global Search Ctrl+K Button */}
          {user && (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141414] hover:bg-[#1F1F1F] border border-[#2D2D2D] text-xs font-mono text-gray-400 hover:text-[#D4AF37] transition-all shadow-inner"
              title="Search problems, tags, history (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline px-1.5 py-0.2 bg-[#222] rounded text-[10px] text-gray-400 border border-white/10">
                Ctrl+K
              </kbd>
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141414] border border-[#2D2D2D] hover:border-[#D4AF37]/50 transition-all"
              >
                {user.avatarUrl && !user.avatarUrl.includes('ui-avatars.com') && !user.avatarUrl.includes('images.unsplash.com') ? (
                  <img
                    src={user.avatarUrl}
                    alt="Avatar"
                    className="w-7 h-7 rounded-lg object-cover border border-[#D4AF37]/50"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-[#1a1a1a] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-semibold text-white leading-tight">{user.fullName}</p>
                  <p className="text-[10px] text-[#D4AF37] font-mono leading-tight">
                    {isAdmin ? 'SYSTEM ADMIN' : user.role || 'VERIFIED LOGICIAN'}
                  </p>
                </div>
              </Link>

              <button
                onClick={logout}
                className="p-2 rounded-xl bg-[#141414] hover:bg-red-500/10 border border-[#2D2D2D] hover:border-red-500/40 text-gray-400 hover:text-red-400 transition-all"
                title="Logout Session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs uppercase tracking-wider font-semibold text-gray-300 hover:text-[#D4AF37] transition-colors px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs uppercase tracking-wider font-semibold text-black bg-gradient-to-r from-[#F5E6AB] via-[#D4AF37] to-[#A38218] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] px-4 py-2 rounded-xl transition-all font-display font-medium"
              >
                Register
              </Link>
            </div>
          )}

        </div>
      </div>
    </header>

    {/* Problem Request Modal */}
    <ProblemRequestModal
      isOpen={showProblemRequestModal}
      onClose={() => setShowProblemRequestModal(false)}
    />
  </>
  );
}
