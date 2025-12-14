import React, { useEffect, useState } from 'react';
import { Calendar, List, ArrowRight } from 'lucide-react';
import EventCard from '../events/EventCard';
import { eventsAPI } from '../../services/api';

const StudentDashboard = ({ user, onNavigate }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        const { data } = await eventsAPI.getAllEvents({ college: user.college });
        setEvents(Array.isArray(data) ? data : []);
      } catch (e) {
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const now = new Date();
  const prioritized = (Array.isArray(events) ? [...events] : [])
    .filter((e) => e?.date && new Date(e.date) >= now)
    .sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
      {/* Welcome Card */}
      <div className="card-floating p-8 md:p-10 mb-12">
        <h1 className="heading-lg text-white mb-3">
          Welcome back, <span className="text-gradient">{user.name}</span>!
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed">
          Discover amazing events and manage your registrations
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <div className="card-floating p-8 gradient-primary text-white group cursor-pointer hover:scale-[1.02] transition-all duration-500" onClick={() => onNavigate('events')}>
          <div className="flex items-start justify-between mb-6">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Calendar className="h-8 w-8" />
            </div>
            <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Browse Events</h3>
          <p className="text-blue-100/90 mb-4 leading-relaxed">Find exciting events happening at your college</p>
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            Explore Now <ArrowRight className="h-4 w-4" />
          </span>
        </div>

        <div className="card-floating p-8 cursor-pointer group hover:scale-[1.02] transition-all duration-500" onClick={() => onNavigate('registrations')}>
          <div className="flex items-start justify-between mb-6">
            <div className="p-4 bg-blue-500/20 rounded-2xl">
              <List className="h-8 w-8 text-blue-400" />
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">My Registrations</h3>
          <p className="text-slate-400 mb-4 leading-relaxed">View and manage your event registrations</p>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400">
            View All <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="card-floating p-8">
        <div className="mb-6">
          <h2 className="heading-md text-white mb-2">Upcoming Events at Your College</h2>
          <p className="text-slate-400">Showing events from <span className="text-blue-400 font-medium">{user.college}</span>. Use Browse Events to see other colleges.</p>
        </div>
        
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-slate-400 mt-4">Loading events...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prioritized.slice(0, 3).map((event, index) => (
            <div key={event._id || event.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <EventCard event={event} />
            </div>
          ))}
        </div>
        
        {!loading && prioritized.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No upcoming events found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
