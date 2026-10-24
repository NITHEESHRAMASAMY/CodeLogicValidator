import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import ThreeCanvas from '../components/ThreeCanvas';
import { Mail, Lock, LogIn, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    const result = await login(email, password, rememberMe);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMsg(result.isMock ? 'Demo session initialized successfully!' : 'Login successful!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 600);
    } else {
      setErrorMsg(result.message || 'Invalid credentials');
    }
  };

  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    const result = await googleLogin('mock_google_oauth_token');
    setIsSubmitting(false);
    if (result.success) {
      setSuccessMsg('Signed in via Google OAuth!');
      setTimeout(() => navigate('/dashboard'), 600);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* 3D Gold Particle Backdrop */}
      <ThreeCanvas />

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Luxury Glassmorphic Auth Card */}
        <div className="glass-panel-gold rounded-3xl p-7 sm:p-9 text-center shadow-luxury">
          
          {/* Top Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Secure Portal
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="text-xs text-gray-400 font-sans mt-1">
              Access your Code Logic Validator workspace
            </p>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5 text-left"
            >
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 text-left"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isSubmitting}
            className="w-full mb-6 py-3 px-4 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] border border-[#2D2D2D] hover:border-[#D4AF37]/40 text-gray-200 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-200 shadow-md group"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-1.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full border-t border-[#2D2D2D]" />
            <span className="absolute bg-[#121212] px-3 text-[10px] uppercase font-mono tracking-widest text-gray-500">
              Or with Credentials
            </span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              id="email"
              label="Email or Username"
              type="email"
              placeholder="developer@clv.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />

            <InputField
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#2D2D2D] bg-[#141414] text-[#D4AF37] focus:ring-[#D4AF37]/40 focus:ring-offset-0 cursor-pointer accent-[#D4AF37]"
                />
                <span className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors">
                  Remember Me
                </span>
              </label>

              <Link
                to="/forgot-password"
                className="text-xs text-[#D4AF37] hover:text-[#F5E6AB] hover:underline font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 px-4 rounded-xl font-display text-xs uppercase font-bold tracking-widest text-black bg-gradient-to-r from-[#F5E6AB] via-[#D4AF37] to-[#A38218] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Authenticating...</span>
              ) : (
                <>
                  <span>Authenticate Session</span>
                  <LogIn className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Footer Register Link */}
          <p className="mt-8 text-xs text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-[#D4AF37] hover:text-[#F5E6AB] font-semibold underline underline-offset-4 transition-colors"
            >
              Register now
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
}
