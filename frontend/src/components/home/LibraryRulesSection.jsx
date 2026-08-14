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
  FiSlash,
  FiChevronRight,
  FiFileText,
  FiLock,
  FiHelpCircle
} from 'react-icons/fi';

const LibraryRulesSection = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRule, setExpandedRule] = useState('POL-01');

  const categories = [
    { id: 'all', label: 'All Policies', icon: FiFileText },
    { id: 'membership', label: 'Membership & Access', icon: FiUserCheck },
    { id: 'borrowing', label: 'Borrowing & Loans', icon: FiBookOpen },
    { id: 'conduct', label: 'Quiet & Conduct', icon: FiVolumeX },
    { id: 'food', label: 'Food & Refreshment', icon: FiCoffee },
    { id: 'fines', label: 'Fines & Penalties', icon: FiAlertTriangle }
  ];

  const rulesData = [
    {
      id: 'POL-01',
      category: 'membership',
      title: 'Mandatory Institutional Identity & Entry Verification',
      icon: FiUserCheck,
      priority: 'Mandatory',
      priorityColor: 'rose',
      summary: 'A valid physical or digital Institutional Smart Card must be validated at turnstiles and circulation desks upon entry.',
      details: [
        'ID credentials are strictly non-transferable under institutional bylaws.',
        'Impersonation or sharing library entry credentials triggers an immediate 30-day digital pass revocation.',
        'External researchers and visiting scholars must obtain a temporary pass at Reception Desk 01 prior to entry.'
      ]
    },
    {
      id: 'POL-02',
      category: 'borrowing',
      title: 'Circulation Quotas & Standard Loan Durations',
      icon: FiBookOpen,
      priority: 'Standard',
      priorityColor: 'cyan',
      summary: 'Standard general stacks titles are issued according to academic tier limits with strict return dates.',
      details: [
        'Undergraduate Scholars: Maximum 5 volumes for 14 calendar days.',
        'Postgraduate & PhD Research Fellows: Maximum 10 volumes for 30 calendar days.',
        'Reference copies marked with [REF / NON-CIRCULATING] are restricted to reading room consultation only.'
      ]
    },
    {
      id: 'POL-03',
      category: 'borrowing',
      title: 'Digital Item Renewal & Hold Reservations',
      icon: FiClock,
      priority: 'Standard',
      priorityColor: 'cyan',
      summary: 'Active loans may be extended once via the portal provided no outstanding reservation hold exists.',
      details: [
        'Extensions must be submitted on or before 11:59 PM of the scheduled due date.',
        'Overdue volumes cannot be extended until outstanding fine balances are settled.',
        'Notification holds must be collected from Circulation Counter B within 48 hours of email alert.'
      ]
    },
    {
      id: 'POL-04',
      category: 'conduct',
      title: 'Quiet Zone Governance & Acoustic Etiquette',
      icon: FiVolumeX,
      priority: 'Strict',
      priorityColor: 'rose',
      summary: 'Absolute acoustic silence is mandatory across Reading Zone A (Main Floor) and Stacks Zone B.',
      details: [
        'All cellular devices and laptops must operate on Silent / Mute mode.',
        'Voice calls are strictly confined to the exterior glass atrium corridors.',
        'Collaborative research discussions are limited to sound-isolated Pods on Level 1.'
      ]
    },
    {
      id: 'POL-05',
      category: 'food',
      title: 'Environmental Care & Food Restrictions',
      icon: FiCoffee,
      priority: 'Regulation',
      priorityColor: 'amber',
      summary: 'Only spill-proof sealed water containers are permitted at study stations and computer labs.',
      details: [
        'Hot meals, open cups, and takeaway food items are strictly prohibited inside reading halls.',
        'Food consumption is permitted exclusively within the Ground Floor Refreshment Lounge.',
        'Keep study tables clear of debris; dispose of waste in designated sorting bins.'
      ]
    },
    {
      id: 'POL-06',
      category: 'fines',
      title: 'Overdue Charges & Asset Loss Indemnity',
      icon: FiAlertTriangle,
      priority: 'Penalty',
      priorityColor: 'purple',
      summary: 'Overdue circulation volumes incur standardized daily penalties per item until returned.',
      details: [
        'General Collection Fine Rate: ₹5.00 per calendar day per overdue volume.',
        'Course Reserve & High-Demand Desk Fine Rate: ₹20.00 per calendar day.',
        'Unreturned or damaged volumes require replacement of identical edition + 50% administrative surcharge.'
      ]
    },
    {
      id: 'POL-07',
      category: 'conduct',
      title: 'Asset Integrity & Anti-Defacement Policy',
      icon: FiShield,
      priority: 'Strict',
      priorityColor: 'rose',
      summary: 'Highlighting, page margin notation, spine strain, or leaf removal is classified as property vandalism.',
      details: [
        'Inspect item condition upon checkout and report any pre-existing markings to library officers.',
        'Vandalism incurs full replacement assessment plus institutional disciplinary review.',
        'Do not apply commercial tapes or home adhesives; hand damaged items directly to Conservation Staff.'
      ]
    },
    {
      id: 'POL-08',
      category: 'membership',
      title: 'Institutional Clearance & Clearance Certification',
      icon: FiCheckCircle,
      priority: 'Compliance',
      priorityColor: 'emerald',
      summary: 'Degree candidate transcripts and final semester results require a verified Zero-Dues status.',
      details: [
        'Institutional No-Dues Certificates are issued automatically upon settling all open loans & fines.',
        'Graduating candidates must surrender physical library cards to the Dean of Academic Affairs.'
      ]
    }
  ];

  const filteredRules = rulesData.filter((rule) => {
    const matchesCategory = activeCategory === 'all' || rule.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      rule.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.details.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="rules-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full border-t border-slate-800/80">
      {/* Top Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono font-bold text-cyan-300 mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            INSTITUTIONAL POLICY & GOVERNANCE HANDBOOK
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-100 tracking-tight">
            Code of Academic Integrity & Library Rules
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
            Official operational standards governing circulation, digital access, acoustic etiquette, and asset stewardship.
          </p>
        </div>

        {/* Governance Search */}
        <div className="relative min-w-[260px] sm:min-w-[320px]">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search policy code or keyword (e.g. POL-01, fine, ID)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all font-mono"
          />
        </div>
      </div>

      {/* Main Governance Content Layout (Sidebar Category Index + Policy Table Rows) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Category Index Navigation */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold px-3 block mb-2">
            Policy Domain Directory
          </span>

          <div className="flex lg:flex-col gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const count = cat.id === 'all'
                ? rulesData.length
                : rulesData.filter((r) => r.category === cat.id).length;
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 transition-all cursor-pointer whitespace-nowrap lg:whitespace-normal w-full ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-md font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{cat.label}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:block pt-6 border-t border-slate-800/80 mt-6 space-y-3">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
                <FiLock className="w-3.5 h-3.5" /> Enforcement Level
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Rules are enforced under Institutional Bylaw Section 14-B. Compliance is monitored via automated entry logs.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Institutional Policy Registry Rows */}
        <div className="lg:col-span-3 space-y-4">
          {filteredRules.length === 0 ? (
            <div className="p-10 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
              <FiSlash className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-300">No Institutional Policy Matches Search</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No policy records found matching your query. Try clearing search keywords or selecting another category domain.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-2 text-xs text-cyan-400 hover:underline font-semibold"
              >
                Reset Directory Filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRules.map((rule) => {
                const Icon = rule.icon;
                const isExpanded = expandedRule === rule.id;

                return (
                  <div
                    key={rule.id}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isExpanded
                        ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-950/20'
                        : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/70 hover:border-slate-700'
                    }`}
                  >
                    {/* Policy Row Header */}
                    <div
                      onClick={() => setExpandedRule(isExpanded ? null : rule.id)}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        {/* Policy Code Badge */}
                        <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] font-bold text-cyan-400 shrink-0">
                          {rule.id}
                        </span>

                        <div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                              <Icon className="w-4 h-4 text-cyan-400 shrink-0" /> {rule.title}
                            </h3>

                            <span
                              className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${
                                rule.priorityColor === 'rose'
                                  ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                                  : rule.priorityColor === 'purple'
                                  ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                                  : rule.priorityColor === 'amber'
                                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                  : rule.priorityColor === 'emerald'
                                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                  : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                              }`}
                            >
                              {rule.priority}
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{rule.summary}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <span className="text-xs font-semibold text-cyan-400">
                          {isExpanded ? 'Collapse' : 'Details'}
                        </span>
                        <FiChevronRight
                          className={`w-4 h-4 text-cyan-400 transition-transform duration-200 ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Policy Detail Breakdown */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-slate-800/80 bg-slate-950/60 p-4 sm:p-5"
                        >
                          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block mb-3">
                            Enforcement Provisions & Compliance Terms
                          </span>

                          <ul className="space-y-2.5">
                            {rule.details.map((point, pIdx) => (
                              <li key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                                <span className="leading-relaxed">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Official Governance Footer */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <FiCheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Office of the Chief Librarian & Governance Board</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Need clarification on special research access or desk holds? Contact <span className="text-cyan-400 font-mono">governance@library.edu</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LibraryRulesSection;
