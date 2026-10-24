import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import ThreeCanvas from '../components/ThreeCanvas';
import { KeyRound, Mail, Lock, CheckCircle2, ShieldAlert, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const result = await forgotPassword(email);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMsg(result.message || 'OTP reset code sent to your email address.');
      setTimeout(() => {
        setStep(2);
        setSuccessMsg('');
      }, 1000);
    } else {
      setErrorMsg(result.message || 'Failed to dispatch reset code.');
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    if (otp.length < 4) {
      setErrorMsg('Please enter valid OTP reset code.');
      return;
    }

    setIsSubmitting(true);
    const result = await resetPassword(email, otp, newPassword);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMsg(result.message || 'Password reset successfully!');
      setTimeout(() => {
        navigate('/login', { state: { message: 'Password updated! Please sign in with new credentials.' } });
      }, 1200);
    } else {
      setErrorMsg(result.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <ThreeCanvas />

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-panel-gold rounded-3xl p-7 sm:p-9 text-center shadow-luxury">
          
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#1E1E1E] to-[#0E0E0E] border border-[#D4AF37]/50 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <KeyRound className="w-8 h-8 text-[#D4AF37]" />
          </div>

          <h2 className="text-2xl font-bold font-display text-white tracking-tight">
            Account Recovery
          </h2>
          <p className="text-xs text-gray-400 font-sans mt-1">
            {step === 1 ? 'Step 1: Verify registered email address' : 'Step 2: Enter OTP & define new password'}
          </p>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5 text-left"
            >
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 text-left"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleStep1Submit}
                className="mt-6 space-y-4 text-left"
              >
                <InputField
                  id="email"
                  label="Registered Account Email"
                  type="email"
                  placeholder="developer@clv.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={Mail}
                  required
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3.5 px-4 rounded-xl font-display text-xs uppercase font-bold tracking-widest text-black bg-gradient-to-r from-[#F5E6AB] via-[#D4AF37] to-[#A38218] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Dispatching OTP...</span>
                  ) : (
                    <>
                      <span>Send Recovery OTP</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleStep2Submit}
                className="mt-6 space-y-4 text-left"
              >
                <InputField
                  id="otp"
                  label="6-Digit Reset Code (OTP)"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  icon={ShieldCheck}
                  required
                />

                <InputField
                  id="newPassword"
                  label="New Security Password"
                  type="password"
                  placeholder="••••••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  icon={Lock}
                  required
                />

                <InputField
                  id="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={Lock}
                  required
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3.5 px-4 rounded-xl font-display text-xs uppercase font-bold tracking-widest text-black bg-gradient-to-r from-[#F5E6AB] via-[#D4AF37] to-[#A38218] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Updating Password...</span>
                  ) : (
                    <>
                      <span>Update Credentials</span>
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="mt-8 text-xs text-gray-400">
            Remembered your credentials?{' '}
            <Link
              to="/login"
              className="text-[#D4AF37] hover:text-[#F5E6AB] font-semibold underline underline-offset-4 transition-colors"
            >
              Return to Sign In
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
}
