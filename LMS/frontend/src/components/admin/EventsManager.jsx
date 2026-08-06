import React from 'react';
import { FiCalendar, FiPlus, FiTrash2 } from 'react-icons/fi';
import EmptyState from '../ui/EmptyState';

const EventsManager = ({ adminEvents = [], onOpenEventModal, onDeleteEvent }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <FiCalendar className="text-cyan-400" /> Event & Workshop Manager
        </h3>
        <button
          onClick={onOpenEventModal}
          className="px-4 py-2 rounded-xl bg-gradient-accent text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-cyan-500/20 cursor-pointer"
        >
          <FiPlus /> Publish Event
        </button>
      </div>

      {adminEvents.length === 0 ? (
        <EmptyState
          icon={FiCalendar}
          title="No Custom Events Published"
          description="Publish library workshops, tech fairs, and author talks to feature them on the public landing page."
          actionLabel="Publish First Event"
          onAction={onOpenEventModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {adminEvents.map((evt) => (
            <div key={evt._id || evt.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 relative group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  {evt.category}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">{evt.date}</span>
                  <button
                    onClick={() => onDeleteEvent(evt._id || evt.id)}
                    className="p-1 rounded-md text-rose-400 hover:bg-rose-500/20 transition-colors"
                    title="Delete Event"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <h4 className="font-bold text-slate-100 text-sm">{evt.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2">{evt.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsManager;
