import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';

const ApprovedList = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await adminAPI.getApprovedRequests();
      setRows(Array.isArray(data) ? data : (data?.requests || []));
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load approved requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-3">
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && rows.length === 0 && <div>No approved requests.</div>}
      {!loading && rows.length > 0 && (
        <ul className="divide-y divide-white/10 rounded-xl overflow-hidden border border-white/10">
          {rows.map((req) => {
            const student = req.student || {};
            const event = req.event || {};
            const registration = req.registration || {};
            const teamName = registration.teamName || '—';
            const teamLeaderName = registration.teamLeader?.name || student.name || '—';
            const subject = `${student.name || 'Student'} – Permission request for ${event.title || 'Event'}`;
            return (
              <li key={req._id} className="bg-slate-900/40 px-4 py-3">
                <div className="text-sm font-semibold text-white truncate">{subject}</div>
                <div className="mt-1 text-xs text-slate-300">
                  <span className="font-medium">Team:</span> {teamName} <span className="mx-2">•</span>
                  <span className="font-medium">Leader:</span> {teamLeaderName}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ApprovedList;
