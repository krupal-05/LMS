import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiClock,
  FiCheckCircle,
  FiGlobe,
  FiMapPin,
  FiShield,
  FiBookOpen,
  FiInfo
} from 'react-icons/fi';

const WorkingHoursSection = () => {
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [currentDayName, setCurrentDayName] = useState('');

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const timeInMinutes = hours * 60 + minutes;

      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      setCurrentDayName(days[day]);

      let openTime = 8 * 60; // 8:00 AM default
      let closeTime = 20 * 60; // 8:00 PM default

      if (day === 0) {
        // Sunday
        openTime = 10 * 60;
        closeTime = 15 * 60;
      } else if (day === 6) {
        // Saturday
        openTime = 9 * 60;
        closeTime = 17 * 60;
      }

      if (timeInMinutes >= openTime && timeInMinutes < closeTime) {
        setIsOpenNow(true);
        const closeHour = Math.floor(closeTime / 60);
        const closePeriod = closeHour >= 12 ? 'PM' : 'AM';
        const displayCloseHour = closeHour > 12 ? closeHour - 12 : closeHour;
        setStatusText(`OPEN NOW — Closes today at ${displayCloseHour}:00 ${closePeriod}`);
      } else {
        setIsOpenNow(false);
        if (timeInMinutes < openTime) {
          const openHour = Math.floor(openTime / 60);
          const openPeriod = openHour >= 12 ? 'PM' : 'AM';
          const displayOpenHour = openHour > 12 ? openHour - 12 : openHour;
          setStatusText(`CLOSED NOW — Opens today at ${displayOpenHour}:00 ${openPeriod}`);
        } else {
          setStatusText(`CLOSED NOW — Opens tomorrow at 8:00 AM`);
        }
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const schedules = [
    {
      title: 'Main Reading Rooms',
      desc: 'Silent reading halls & study desks with high-speed Wi-Fi',
      icon: FiBookOpen,
      badge: 'Primary Zone',
      badgeColor: 'cyan',
      hours: [
        { days: 'Monday – Friday', time: '8:00 AM – 8:00 PM', highlight: true },
        { days: 'Saturday', time: '9:00 AM – 5:00 PM', highlight: false },
        { days: 'Sunday', time: '10:00 AM – 3:00 PM', highlight: false }
      ]
    },
    {
      title: 'Circulation & Issue Desk',
      desc: 'Physical book issue, returns, memberships & clearance',
      icon: FiCheckCircle,
      badge: 'Physical Counter',
      badgeColor: 'emerald',
      hours: [
        { days: 'Monday – Friday', time: '8:30 AM – 7:00 PM', highlight: true },
        { days: 'Saturday', time: '9:30 AM – 4:00 PM', highlight: false },
        { days: 'Sunday', time: 'Closed (Drop Box Open)', highlight: false }
      ]
    },
    {
      title: 'Digital E-Library Portal',
      desc: '24/7 Remote access to e-books, research journals & PDF catalog',
      icon: FiGlobe,
      badge: 'Always Online',
      badgeColor: 'purple',
      hours: [
        { days: 'Monday – Sunday', time: '24 Hours / 7 Days a Week', highlight: true },
        { days: 'Digital Support Desk', time: '9:00 AM – 6:00 PM', highlight: false }
      ]
    },
    {
      title: 'Research & Computer Labs',
      desc: 'IEEE terminal access, database queries & thesis work stations',
      icon: FiShield,
      badge: 'Tech Wing',
      badgeColor: 'amber',
      hours: [
        { days: 'Monday – Friday', time: '9:00 AM – 8:00 PM', highlight: true },
        { days: 'Saturday & Sunday', time: '10:00 AM – 4:00 PM', highlight: false }
      ]
    }
  ];

  return (
    <section id="hours-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full border-t border-slate-800/80">
      <div className="space-y-8">
        {/* Header with Live Status Pill */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
                <FiClock className="w-4 h-4 text-cyan-400 animate-pulse" /> Operating Schedule
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Library Working Hours
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Plan your physical visits and access online services. Today is <span className="text-slate-200 font-semibold">{currentDayName}</span>.
            </p>
          </div>

          {/* Live Status Indicator Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-lg">
            <span className="relative flex h-3 w-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isOpenNow ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  isOpenNow ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </span>
            <div className="flex flex-col">
              <span
                className={`text-xs font-bold font-mono tracking-wide ${
                  isOpenNow ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {statusText}
              </span>
            </div>
          </div>
        </div>

        {/* Schedule Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {schedules.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="glass-card p-5 rounded-3xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-900/90 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shadow-inner">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border ${
                        item.badgeColor === 'cyan'
                          ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                          : item.badgeColor === 'emerald'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : item.badgeColor === 'purple'
                          ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{item.desc}</p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2.5">
                    {item.hours.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">{h.days}</span>
                        <span
                          className={`font-mono text-[11px] font-semibold ${
                            h.highlight ? 'text-slate-200' : 'text-slate-400'
                          }`}
                        >
                          {h.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Notice Strip below working hours */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
              <FiInfo className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-200 block">Exam Season Extended Hours & Quiet Zones</span>
              <span className="text-slate-400">
                During end-semester examinations, Reading Room 2 remains open until <strong className="text-cyan-300 font-mono">11:00 PM</strong> daily.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-xs shrink-0 self-end sm:self-center">
            <FiMapPin className="text-cyan-400" />
            <span>Central Campus Building, Floor 2</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkingHoursSection;
