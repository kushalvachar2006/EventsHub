import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { Link } from 'react-router-dom';

const ApprovalQueue = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await adminAPI.getPendingRequests();
      setRequests(data || []);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load pending requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-3">
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && requests.length === 0 && <div>No pending requests.</div>}
      {!loading && requests.length > 0 && (
        <ul className="divide-y divide-white/10 rounded-xl overflow-hidden border border-white/10">
          {requests.map((req) => {
            const student = req.student || {};
            const event = req.event || {};
            const subject = `${student.name || 'Student'} – Permission request for ${event.title || 'Event'}`;
            return (
              <li key={req._id} className="bg-slate-900/40 hover:bg-slate-900/60 transition">
                <Link to={`/admin/requests/${req._id}`} className="block px-4 py-3">
                  <div className="text-sm font-semibold text-white truncate">{subject}</div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ApprovalQueue;