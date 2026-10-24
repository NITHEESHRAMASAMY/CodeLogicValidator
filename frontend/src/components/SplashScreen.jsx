import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Code2, Sparkles, Cpu } from 'lucide-react';

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing CLV Engine...');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete && onComplete();
          }, 300);
          return 100;
        }
        if (prev === 25) setStatusText('Loading Security & Auth Matrix...');
        if (prev === 60) setStatusText('Verifying Encryption Keys...');
        if (prev === 85) setStatusText('Launching Luxury Workspace...');
        return prev + 2;
      });
    }, 50); // 50ms * 50 ticks = ~2.5s to 3s total

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0A0A] overflow-hidden"
    >
      {/* Soft Ambient Radial Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.15)_0%,_rgba(10,10,10,1)_70%)]" />

      {/* Luxury Metallic Container */}
      <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
        
        {/* Animated Hexagonal Logo Icon */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative mb-8"
        >
          {/* Outer Rotating Glowing Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="w-28 h-28 rounded-full border-2 border-dashed border-[#D4AF37]/40 p-1 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)]"
          />

          {/* Center Emblem */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#0E0E0E] border border-[#D4AF37]/60 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
              <Code2 className="w-10 h-10 text-[#D4AF37] stroke-[1.8]" />
            </div>
          </div>

          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 text-[#F5E6AB]"
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
        </motion.div>

        {/* Title & Tagline */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h1 className="text-3xl font-extrabold tracking-tight font-display text-gold-gradient">
            CODE LOGIC VALIDATOR
          </h1>
          <p className="text-xs uppercase tracking-[0.35em] text-gray-400 font-mono mt-2 flex items-center justify-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            Enterprise Logic Assurance
          </p>
        </motion.div>

        {/* Loading Progress Bar & Micro-Interactions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full mt-10"
        >
          <div className="relative w-full h-1.5 bg-[#1C1C1C] rounded-full overflow-hidden border border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#F5E6AB] shadow-[0_0_15px_#D4AF37]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeInOut' }}
            />
          </div>

          <div className="flex justify-between items-center mt-3 text-xs font-mono text-gray-400">
            <span className="flex items-center gap-1.5 text-[#D4AF37]/90">
              <Cpu className="w-3.5 h-3.5 animate-spin" />
              {statusText}
            </span>
            <span className="font-semibold text-white">{progress}%</span>
          </div>
        </motion.div>
      </div>

      {/* Footer Branding Subtle Tag */}
      <div className="absolute bottom-6 text-[10px] uppercase tracking-widest text-gray-500 font-mono">
        CLV v1.0 • Phase 1 Core Engine
      </div>
    </motion.div>
  );
}
