import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { formatDate } from '../../utils/date';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext.jsx';

const EventCard = ({ event }) => {
  const { isAuthenticated } = useAuth();
  const { show } = useToast();
  const id = event?._id || event?.id;
  const dateLabel = event?.date ? formatDate(event.date) : '';
  const banner = event?.bannerUrl;
  const isClosed = event?.registrationDeadline ? new Date() > new Date(event.registrationDeadline) : false;
  
  const handleViewDetailsClick = () => {
    if (!isAuthenticated) {
      show('Login to register', 'info');
    }
  };
  
  return (
    <div className="group card-floating overflow-hidden hover:scale-[1.02] transition-all duration-500">
      {/* Event Banner */}
      {banner ? (
        <div className="aspect-[16/9] overflow-hidden bg-slate-800 relative">
          <img 
            src={banner} 
            alt={event?.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
        </div>
      ) : (
        <div className="h-32 bg-gradient-to-br from-brand-cyan via-brand-violet to-brand-cyan relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
      )}

      <div className="p-6">
        {/* Date and College Badges */}
        <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30">
            <Calendar className="h-3.5 w-3.5" />
            {dateLabel}
          </span>
          {event?.college && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              {event.college}
            </span>
          )}
        </div>

        {/* Event Title */}
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-cyan transition-colors line-clamp-2">
          {event?.title}
        </h3>

        {/* Description */}
        <p className="text-slate-400 text-sm mb-5 line-clamp-2 leading-relaxed">
          {(event?.description || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()}
        </p>

        {/* Location and CTA */}
        <div className="flex items-center justify-between pt-5 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <MapPin className="h-4 w-4 text-slate-500" />
            <span className="truncate max-w-[120px]">{event?.location}</span>
          </div>

          {isClosed ? (
            <span className="text-xs font-semibold text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 cursor-not-allowed">
              Closed
            </span>
          ) : (
            <Link
              to={`/events/${id}`}
              onClick={handleViewDetailsClick}
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-cyan hover:text-cyan-300 group/link transition-all"
            >
              View Details
              <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
