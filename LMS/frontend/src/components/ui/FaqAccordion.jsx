import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiHelpCircle, FiClock, FiDollarSign, FiRefreshCw, FiBookOpen } from 'react-icons/fi';

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      icon: FiClock,
      question: 'What is the maximum borrowing duration for students?',
      answer: 'Standard book issues are granted for 14 calendar days. Students can extend or renew their borrow period online via the Student Dashboard if there are no pending holds from other students.'
    },
    {
      icon: FiDollarSign,
      question: 'How are overdue fines calculated and collected?',
      answer: 'A minimal late penalty of ₹5/day is automatically accrued after the official due date passes. Fines can be paid directly through Razorpay online or waived by library administrative staff upon request.'
    },
    {
      icon: FiRefreshCw,
      question: 'Can I renew a book if it is nearing its due date?',
      answer: 'Yes! Books can be renewed up to 2 consecutive times through the Student Workspace, provided the book has not been reserved by another member.'
    },
    {
      icon: FiBookOpen,
      question: 'What happens if a book is out of stock in the catalog?',
      answer: 'When all copies of a title are checked out, you can click "Request" to place a hold. You will receive an immediate notification when a copy is returned to inventory.'
    }
  ];

  return (
    <div className="space-y-3">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        const IconComponent = faq.icon;

        return (
          <div
            key={idx}
            className={`rounded-2xl transition-all border ${
              isOpen
                ? 'bg-slate-900/80 border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                : 'glass-panel border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isOpen ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="font-semibold text-slate-100 text-sm sm:text-base">{faq.question}</span>
              </div>
              <FiChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-1 border-t border-slate-800/60 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans pl-12">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default FaqAccordion;
