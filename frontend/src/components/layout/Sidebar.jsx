import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiBookOpen, FiClock, FiDollarSign, FiCalendar, FiUser } from 'react-icons/fi';

const Sidebar = ({ role = 'student', activeTab, setActiveTab }) => {
  const adminTabs = [
    { id: 'overview', label: 'Overview', icon: FiGrid },
    { id: 'requests', label: 'Borrow Requests', icon: FiClock },
    { id: 'inventory', label: 'Book Inventory', icon: FiBookOpen },
    { id: 'fines', label: 'Fines & Waivers', icon: FiDollarSign },
    { id: 'events', label: 'Events & News', icon: FiCalendar }
  ];

  const studentTabs = [
    { id: 'overview', label: 'Overview', icon: FiGrid },
    { id: 'catalog', label: 'Book Catalog', icon: FiBookOpen },
    { id: 'borrows', label: 'My Borrows', icon: FiClock },
    { id: 'fines', label: 'My Fines', icon: FiDollarSign }
  ];

  const tabs = role === 'admin' ? adminTabs : studentTabs;

  return (
    <aside className="w-64 glass-panel border-r border-slate-800 p-4 min-h-screen space-y-6 hidden md:block">
      <div className="space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold px-3">
          {role === 'admin' ? 'Administration' : 'Student Hub'}
        </span>
      </div>

      <nav className="space-y-1">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
