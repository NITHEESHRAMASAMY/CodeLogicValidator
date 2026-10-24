import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import ThreeCanvas from '../components/ThreeCanvas';
import { User, Mail, Lock, UserPlus, ShieldAlert, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-gray-700' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: 'bg-red-500' };
      case 2:
        return { score: 50, label: 'Moderate', color: 'bg-yellow-500' };
      case 3:
        return { score: 75, label: 'Strong', color: 'bg-emerald-500' };
      case 4:
        return { score: 100, label: 'Enterprise Grade', color: 'bg-[#D4AF37]' };
      default:
        return { score: 10, label: 'Too Short', color: 'bg-red-600' };
    }
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (!acceptTerms) {
      setErrorMsg('You must accept the Terms of Service to register.');
      return;
    }

    setIsSubmitting(true);
    const result = await register(fullName, email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/verify-email', { state: { email } });
    } else {
      setErrorMsg(result.message || 'Registration failed.');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <ThreeCanvas />

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="glass-panel-gold rounded-3xl p-7 sm:p-9 text-center shadow-luxury">
          
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono uppercase tracking-widest mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              New Account Registration
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
              Create CLV Identity
            </h2>
            <p className="text-xs text-gray-400 font-sans mt-1">
              Join the luxury code logic validation network
            </p>
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <InputField
              id="fullName"
              label="Full Name"
              type="text"
              placeholder="Alexander Wright"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              icon={User}
              required
            />

            <InputField
              id="email"
              label="Work Email"
              type="email"
              placeholder="alex@enterprise.io"
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

            {/* Password Strength Meter */}
            {password && (
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-gray-400">Strength:</span>
                  <span className="font-semibold text-white">{strength.label}</span>
                </div>
                <div className="w-full h-1.5 bg-[#1C1C1C] rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full ${strength.color} transition-all duration-300`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
              </div>
            )}

            <InputField
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={Lock}
              required
            />

            {/* Terms of Service Checkbox */}
            <div className="flex items-start gap-2.5 pt-2">
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-[#2D2D2D] bg-[#141414] text-[#D4AF37] focus:ring-[#D4AF37]/40 cursor-pointer accent-[#D4AF37]"
              />
              <label htmlFor="terms" className="text-xs text-gray-400 leading-relaxed cursor-pointer select-none">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-[#D4AF37] hover:underline font-medium"
                >
                  Terms of Service & Security Guidelines
                </button>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-3.5 px-4 rounded-xl font-display text-xs uppercase font-bold tracking-widest text-black bg-gradient-to-r from-[#F5E6AB] via-[#D4AF37] to-[#A38218] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Creating Account...</span>
              ) : (
                <>
                  <span>Create Account & Verify</span>
                  <UserPlus className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-xs text-gray-400">
            Already registered?{' '}
            <Link
              to="/login"
              className="text-[#D4AF37] hover:text-[#F5E6AB] font-semibold underline underline-offset-4 transition-colors"
            >
              Sign In
            </Link>
          </p>

        </div>
      </motion.div>

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#141414] border border-[#D4AF37]/40 rounded-2xl max-w-md w-full p-6 text-left shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#2D2D2D]">
              <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#D4AF37]" />
                Terms of Service & Data Policy
              </h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs text-gray-300 max-h-60 overflow-y-auto pr-2">
              <p>
                1. <strong>Code Logic Security:</strong> All code submitted to the Code Logic Validator platform is processed within secure sandbox environments using Spring Security and MongoDB encryption standards.
              </p>
              <p>
                2. <strong>Account Responsibility:</strong> Users are responsible for maintaining JWT session privacy and protecting access credentials.
              </p>
              <p>
                3. <strong>Data Encryption:</strong> User passwords are hashed with BCrypt and stored securely in MongoDB Atlas.
              </p>
            </div>
            <button
              onClick={() => {
                setAcceptTerms(true);
                setShowTermsModal(false);
              }}
              className="w-full mt-2 py-2.5 rounded-xl bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider"
            >
              I Accept Terms
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
