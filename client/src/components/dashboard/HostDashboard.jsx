import React from 'react';
import { Plus, FileEdit, ArrowRight } from 'lucide-react';

const HostDashboard = ({ user, onNavigate }) => (
  <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
    {/* Welcome Section */}
    <div className="card-floating p-8 md:p-10 mb-12">
      <h1 className="heading-lg text-white mb-3">
        Welcome back, <span className="text-gradient">{user.name}</span>
      </h1>
      <p className="text-lg text-slate-400 leading-relaxed">
        Manage your events and create memorable experiences
      </p>
    </div>
    
    {/* Action Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        className="card-floating p-8 gradient-primary text-white group cursor-pointer hover:scale-[1.02] transition-all duration-500" 
        onClick={() => onNavigate('create-event')}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
            <Plus className="h-8 w-8" />
          </div>
          <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </div>
        <h3 className="text-2xl font-bold mb-3">Create New Event</h3>
        <p className="text-blue-100/90 mb-4 leading-relaxed">Start planning your next amazing event</p>
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          Get Started <ArrowRight className="h-4 w-4" />
        </span>
      </div>

      <div 
        className="card-floating p-8 cursor-pointer group hover:scale-[1.02] transition-all duration-500" 
        onClick={() => onNavigate('my-events')}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="p-4 bg-blue-500/20 rounded-2xl">
            <FileEdit className="h-8 w-8 text-blue-400" />
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">My Events</h3>
        <p className="text-slate-400 mb-4 leading-relaxed">View and manage your created events</p>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400">
          Manage Events <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </div>
  </div>
);

export default HostDashboard;
