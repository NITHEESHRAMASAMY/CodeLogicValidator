import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import ThreeCanvas from '../components/ThreeCanvas';
import { ShieldCheck, Cpu, Database, Key, User, Plus, Sparkles, CheckCircle2, Terminal, Code } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout, updateAvatar } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image exceeds 5MB limit. Please choose a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (base64) {
        updateAvatar(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] p-4 sm:p-8">
      <ThreeCanvas />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        
        {/* Welcome Header Banner */}
        <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-luxury">
          <div className="flex items-center gap-5">
            <div className="relative group">
              {user?.avatarUrl && !user.avatarUrl.includes('ui-avatars.com') && !user.avatarUrl.includes('images.unsplash.com') ? (
                <img
                  src={user.avatarUrl}
                  alt="User Avatar"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-[#D4AF37] object-cover shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-br from-[#1d1b14] via-[#141414] to-[#0a0a0a] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.25)]">
                  <User className="w-8 h-8 sm:w-10 sm:h-10 text-[#D4AF37]" />
                </div>
              )}

              {/* + Icon at the right bottom to browse image from system */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F5E6AB] text-black font-extrabold flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.6)] hover:scale-115 active:scale-95 transition-all cursor-pointer border-2 border-[#0e0e0e]"
                title="Browse and upload image from your computer"
                aria-label="Upload avatar image"
              >
                <Plus className="w-3.5 h-3.5 text-black stroke-[3]" />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-mono uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3" />
                {user?.role || 'AUTHENTICATED USER'}
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                Welcome, {user?.fullName || 'Developer'}
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 font-sans mt-1">
                {user?.email} • Logged in via <span className="text-[#D4AF37] font-semibold">CLV JWT Matrix</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={logout}
              className="py-2.5 px-5 rounded-xl font-display text-xs uppercase font-bold tracking-wider text-black bg-gradient-to-r from-[#F5E6AB] via-[#D4AF37] to-[#A38218] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
            >
              Terminate Session
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: JWT & Security Session Status */}
          <div className="glass-panel rounded-2xl p-6 border border-[#2D2D2D] hover:border-[#D4AF37]/50 transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center">
                <Key className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                ACTIVE
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-display tracking-wider">
                JWT Authentication Token
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Signed using HMAC SHA-256 with Spring Security BCrypt encryption filters.
              </p>
            </div>
            <div className="pt-2 border-t border-[#2D2D2D] text-[11px] font-mono text-gray-400 flex items-center justify-between">
              <span>Token Expiry:</span>
              <span className="text-[#D4AF37]">24 Hours</span>
            </div>
          </div>

          {/* Card 2: MongoDB Atlas Status */}
          <div className="glass-panel rounded-2xl p-6 border border-[#2D2D2D] hover:border-[#D4AF37]/50 transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center">
                <Database className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                CONNECTED
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-display tracking-wider">
                MongoDB Atlas Engine
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Collections initialized for Users, Auth Tokens, Sessions & User Preferences.
              </p>
            </div>
            <div className="pt-2 border-t border-[#2D2D2D] text-[11px] font-mono text-gray-400 flex items-center justify-between">
              <span>Sync Mode:</span>
              <span className="text-[#D4AF37]">Live Controller → Service</span>
            </div>
          </div>

          {/* Card 3: Theme & UX System */}
          <div className="glass-panel rounded-2xl p-6 border border-[#2D2D2D] hover:border-[#D4AF37]/50 transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono">
                LUXURY DARK
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-display tracking-wider">
                Luxury Theme Matrix
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Black (#0A0A0A) + Gold (#D4AF37) color palette with Three.js particle canvas.
              </p>
            </div>
            <div className="pt-2 border-t border-[#2D2D2D] text-[11px] font-mono text-gray-400 flex items-center justify-between">
              <span>Visual Engine:</span>
              <span className="text-[#D4AF37]">Framer + R3F</span>
            </div>
          </div>

        </div>

        {/* User Session Object Viewer */}
        <div className="glass-panel rounded-2xl p-6 border border-[#2D2D2D] space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-[#2D2D2D]">
            <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#D4AF37]" />
              Active Session Claims & Profile Record
            </h3>
            <span className="text-xs text-[#D4AF37] font-mono">
              /api/auth/me Response
            </span>
          </div>

          <pre className="p-4 rounded-xl bg-[#0E0E0E] border border-[#2D2D2D] text-xs font-mono text-emerald-400 overflow-x-auto">
{JSON.stringify(user, null, 2)}
          </pre>
        </div>

      </div>
    </div>
  );
}
