import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';

const AdminDashboard = ({ user, onNavigate }) => {
  const [pendingCount, setPendingCount] = useState(0);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');
      const { data } = await adminAPI.getPendingRequests();
      const list = Array.isArray(data) ? data : [];
      setRequests(list);
      setPendingCount(list.length);
    } catch (e) {
      setError('Failed to load pending requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Detailed approve/reject is now handled in the request detail page.

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="card-floating p-8 md:p-10 mb-12">
        <h1 className="heading-lg text-white mb-3">
          Admin Dashboard <span className="text-gradient"></span>
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed">
          Review and manage permission requests
        </p>
      </div>

      {/* Stats Card */}
      <div className="card-floating p-8 gradient-primary text-white mb-8 glow-blue">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-4xl font-bold mb-2">{loading ? '—' : pendingCount}</h3>
            <p className="text-blue-100 text-lg">Pending Permission Requests</p>
            {error && <p className="text-blue-200 text-sm mt-2">{error}</p>}
          </div>
          <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
            <Bell className="h-12 w-12 opacity-90" />
          </div>
        </div>
      </div>

      {/* Requests List (subjects only) */}
      <div className="card-floating p-8">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-slate-400 mt-4">Loading requests...</p>
          </div>
        )}
        
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        
        {!loading && !error && requests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No pending requests.</p>
          </div>
        )}
        
        {!loading && !error && requests.length > 0 && (
          <ul className="divide-y divide-white/10 rounded-xl overflow-hidden border border-white/10">
            {requests.map((req, index) => {
              const student = req.student || {};
              const event = req.event || {};
              const subject = `${student.name || 'Student'} – Permission request for ${event.title || 'Event'}`;
              return (
                <li key={req._id} className="bg-slate-900/40 hover:bg-slate-900/60 transition animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                  <Link to={`/admin/requests/${req._id}`} className="block px-4 py-3">
                    <div className="text-sm font-semibold text-white truncate">{subject}</div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
