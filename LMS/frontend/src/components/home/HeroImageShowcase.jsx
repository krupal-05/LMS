import React from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiZap, FiShield, FiTrendingUp } from 'react-icons/fi';

const HeroImageShowcase = () => {
  return (
    <div className="relative w-full flex items-center justify-center py-4">
      {/* Outer Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition duration-1000" />

      {/* Main Image Frame Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-lg rounded-3xl p-2.5 glass-panel border border-slate-700/60 bg-slate-900/60 backdrop-blur-xl shadow-2xl overflow-hidden group"
      >
        {/* Top Floating Badge */}
        <div className="absolute top-5 left-5 z-20 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold tracking-wide flex items-center gap-2 shadow-lg backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Smart Digital Library Hub
        </div>

        {/* Hero Image */}
        <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden bg-slate-950">
          <img
            src="/hero_library.png"
            alt="Digital Library Innovation Hub"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={(e) => {
              // Fallback to high quality library image if path issues occur
              e.target.src =
                'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1000&auto=format&fit=crop';
            }}
          />
          
          {/* Subtle gradient overlay at bottom of image for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent opacity-80" />
        </div>

        {/* Bottom Floating Stats Pill 1 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="absolute bottom-6 left-6 z-20 px-3.5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-slate-100 flex items-center gap-3 shadow-xl backdrop-blur-md"
        >
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
            <FiBookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100">1,200+ Catalog Books</div>
            <div className="text-[10px] text-slate-400 font-mono">Digital & Physical Holdings</div>
          </div>
        </motion.div>

        {/* Bottom Floating Stats Pill 2 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="absolute bottom-6 right-6 z-20 px-3.5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-slate-100 flex items-center gap-3 shadow-xl backdrop-blur-md hidden sm:flex"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <FiZap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100">24/7 RFID Access</div>
            <div className="text-[10px] text-emerald-400 font-mono">Instant Issue Active</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroImageShowcase;
