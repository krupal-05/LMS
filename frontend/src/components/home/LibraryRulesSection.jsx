import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiShield,
  FiBookOpen,
  FiClock,
  FiVolumeX,
  FiCoffee,
  FiAlertTriangle,
  FiUserCheck,
  FiSearch,
  FiCheckCircle,
  FiSlash
} from 'react-icons/fi';

const LibraryRulesSection = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: '📋 All Rules' },
    { id: 'membership', label: '🪪 Membership & Access' },
    { id: 'borrowing', label: '📚 Borrowing & Renewals' },
    { id: 'conduct', label: '🤫 Quiet & Conduct' },
    { id: 'food', label: '☕ Food & Drinks' },
    { id: 'fines', label: '⚖️ Overdue & Fines' }
  ];

  const rulesData = [
    {
      id: 'rule-1',
      category: 'membership',
      title: 'Valid Institutional ID Mandatory',
      icon: FiUserCheck,
      severity: 'Strict Policy',
      severityColor: 'rose',
      summary: 'Physical or digital Student ID card must be presented at entry turnstiles and circulation counter.',
      details: [
        'ID cards are strictly non-transferable.',
        'Impersonation or sharing library pass will result in 30-day membership suspension.',
        'Visitors and guest researchers must register at the reception desk prior to entry.'
      ]
    },
    {
      id: 'rule-2',
      category: 'borrowing',
      title: 'Borrowing Quota & Loan Period',
      icon: FiBookOpen,
      severity: 'Standard Rules',
      severityColor: 'cyan',
      summary: 'Students may borrow up to 5 general stack books for a maximum duration of 14 calendar days.',
      details: [
        'Undergraduate students: Up to 5 books for 14 days.',
        'Postgraduate & Research Scholars: Up to 10 books for 30 days.',
        'Reference copies marked with [REF] cannot be issued for home use.'
      ]
    },
    {
      id: 'rule-3',
      category: 'borrowing',
      title: 'Book Renewal & Reservation',
      icon: FiClock,
      severity: 'Standard Rules',
      severityColor: 'cyan',
      summary: 'Books can be renewed once online via the student dashboard if no hold has been placed by another member.',
      details: [
        'Renewal must be initiated before or on the due date.',
        'Overdue items cannot be renewed online until fines are cleared.',
        'Reserved titles must be collected from circulation within 48 hours of notice.'
      ]
    },
    {
      id: 'rule-4',
      category: 'conduct',
      title: 'Strict Quiet Zones & Digital Etiquette',
      icon: FiVolumeX,
      severity: 'Strict Policy',
      severityColor: 'rose',
      summary: 'Maintain complete silence in Zone A (Main Reading Room) and Zone B (Research Stacks).',
      details: [
        'Mobile phones must remain on Silent or Vibrate mode at all times.',
        'Voice calls must be taken outside in the atrium or corridor.',
        'Group discussions are restricted to designated Discussion Pods on Floor 1.'
      ]
    },
    {
      id: 'rule-5',
      category: 'food',
      title: 'Food & Beverage Restrictions',
      icon: FiCoffee,
      severity: 'Environmental Care',
      severityColor: 'amber',
      summary: 'Only spill-proof covered water bottles are permitted near reading desks and computer terminals.',
      details: [
        'Open food, fast food, hot meals, and open coffee cups are prohibited in reading halls.',
        'Eating is allowed exclusively in the Ground Floor Library Cafe Lounge.',
        'Keep study stations clean; dispose of trash in recycling bins.'
      ]
    },
    {
      id: 'rule-6',
      category: 'fines',
      title: 'Overdue Fines & Lost Book Penalty',
      icon: FiAlertTriangle,
      severity: 'Enforced Fine',
      severityColor: 'purple',
      summary: 'Late return of general collection titles incurs a daily overdue charge per volume.',
      details: [
        'Fine rate: ₹5 per day per overdue book (up to maximum of book cost).',
        'Overdue fine for Reserve/Course Desk items: ₹20 per day.',
        'Lost or damaged books must be replaced with a new copy or paid at 150% list price.'
      ]
    },
    {
      id: 'rule-7',
      category: 'conduct',
      title: 'Property Protection & Marking Prohibition',
      icon: FiShield,
      severity: 'Strict Policy',
      severityColor: 'rose',
      summary: 'Highlighting, scribbling, folding pages, or tearing library materials is considered vandalism.',
      details: [
        'Check book condition prior to issuing and report existing marks to staff.',
        'Defacing books incurs full replacement cost + institutional disciplinary record.',
        'Do not attempt self-repair with adhesive tape; hand damaged items to staff.'
      ]
    },
    {
      id: 'rule-8',
      category: 'membership',
      title: 'No Dues Clearance Requirement',
      icon: FiCheckCircle,
      severity: 'Graduation Policy',
      severityColor: 'emerald',
      summary: 'All borrowed books and pending fines must be cleared before semester results or degree issuance.',
      details: [
        'No Dues Certificate is generated automatically in Student Dashboard upon 0 balance.',
        'Final year clearance requires returning all physical assets & cards.'
      ]
    }
  ];

  const filteredRules = rulesData.filter((rule) => {
    const matchesCategory = activeCategory === 'all' || rule.category === activeCategory;
    const matchesSearch =
      rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.details.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="rules-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full border-t border-slate-800/80">
      <div className="space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1.5 mb-2">
              <FiShield className="w-4 h-4 text-cyan-400" /> Institutional Governance
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Library Code of Conduct & Rules
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Regulations designed to maintain an equitable, productive, and respectful study environment for all scholars.
            </p>
          </div>

          {/* Search Input for Rules */}
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search rules (e.g. fine, renewal, ID)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
            />
          </div>
        </div>

        {/* Category Tabs Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-gradient-accent text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Rules Grid */}
        {filteredRules.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
            <FiSlash className="w-8 h-8 text-slate-500 mx-auto" />
            <h4 className="text-sm font-bold text-slate-300">No matching library rules found</h4>
            <p className="text-xs text-slate-500">Try searching for keywords like "ID", "fine", "quiet", or "renew".</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="mt-2 text-xs text-cyan-400 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredRules.map((rule) => {
                const Icon = rule.icon;
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={rule.id}
                    className="glass-card p-5 rounded-3xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-900/90 hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shadow-inner">
                          <Icon className="w-4 h-4" />
                        </div>

                        <span
                          className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                            rule.severityColor === 'rose'
                              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                              : rule.severityColor === 'purple'
                              ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                              : rule.severityColor === 'amber'
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                              : rule.severityColor === 'emerald'
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                          }`}
                        >
                          {rule.severity}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-100">{rule.title}</h3>
                      <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{rule.summary}</p>

                      <ul className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                        {rule.details.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2 text-[11px] text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 shrink-0 mt-1" />
                            <span className="leading-normal">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Footer Policy Banner */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900/80 to-purple-950/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <FiCheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">Respect Library Assets & Fellow Scholars</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Compliance with library rules helps maintain an inspiring research culture. Questions? Reach out to the Chief Librarian.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LibraryRulesSection;
