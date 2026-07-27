import React from 'react';
import { motion } from 'framer-motion';
import CountUpNumber from '../ui/CountUpNumber';

const StatCard = ({ title, value, numericValue, suffix = '', prefix = '', icon: Icon, color = 'cyan', subtext, trend }) => {
  const colorMap = {
    cyan: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30',
    emerald: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
    amber: 'from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/30',
    rose: 'from-rose-500/20 to-pink-500/10 text-rose-400 border-rose-500/30',
    purple: 'from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/30',
  };

  const selectedColorClass = colorMap[color] || colorMap.cyan;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="glass-panel rounded-2xl p-5 border border-slate-800/80 relative overflow-hidden shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            {typeof numericValue === 'number' ? (
              <CountUpNumber value={numericValue} suffix={suffix} prefix={prefix} />
            ) : (
              value
            )}
          </h3>
          {subtext && <p className="text-xs text-slate-400 mt-1.5">{subtext}</p>}
        </div>

        {Icon && (
          <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${selectedColorClass} border shadow-inner`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center text-xs text-slate-400">
          <span className="text-emerald-400 font-semibold mr-1">{trend}</span>
          <span>vs last month</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
