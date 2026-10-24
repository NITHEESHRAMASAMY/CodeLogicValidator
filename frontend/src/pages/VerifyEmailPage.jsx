import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ThreeCanvas from '../components/ThreeCanvas';
import { MailCheck, ArrowRight, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || 'user@domain.com';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { verifyEmail, resendVerification } = useAuth();

  // Timer countdown effect
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input box
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setErrorMsg('Please enter all 6 digits of the OTP code.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    const result = await verifyEmail(email, otpCode);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMsg(result.message);
      setTimeout(() => {
        navigate('/login', { state: { message: 'Email verified! Please sign in.' } });
      }, 1200);
    } else {
      setErrorMsg(result.message || 'Verification failed. Invalid OTP.');
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false);
    setTimer(60);
    setErrorMsg('');
    const result = await resendVerification(email);
    setSuccessMsg(result.message || 'A new verification code has been dispatched.');
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
            <MailCheck className="w-8 h-8 text-[#D4AF37]" />
          </div>

          <h2 className="text-2xl font-bold font-display text-white tracking-tight">
            Verify Email Address
          </h2>
          <p className="text-xs text-gray-400 font-sans mt-2">
            We sent a 6-digit authentication code to{' '}
            <strong className="text-[#D4AF37] font-mono">{email}</strong>
          </p>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 text-left"
            >
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 text-left"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {/* OTP Code Input Boxes */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="flex justify-between items-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-11 h-13 sm:w-12 sm:h-14 bg-[#141414] border border-[#2D2D2D] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 text-center text-xl font-bold font-mono text-[#D4AF37] rounded-xl outline-none shadow-inner transition-all"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl font-display text-xs uppercase font-bold tracking-widest text-black bg-gradient-to-r from-[#F5E6AB] via-[#D4AF37] to-[#A38218] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Verifying Code...</span>
              ) : (
                <>
                  <span>Confirm OTP Code</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Resend OTP timer */}
          <div className="mt-6 pt-4 border-t border-[#2D2D2D]/60 flex items-center justify-between text-xs font-mono">
            <span className="text-gray-400">Didn't receive code?</span>
            <button
              onClick={handleResend}
              disabled={!canResend}
              className={`flex items-center gap-1.5 font-semibold transition-colors ${
                canResend ? 'text-[#D4AF37] hover:text-[#F5E6AB]' : 'text-gray-600 cursor-not-allowed'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${!canResend ? '' : 'hover:rotate-180 transition-transform'}`} />
              {canResend ? 'Resend OTP' : `Resend in ${timer}s`}
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
