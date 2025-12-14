import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import ApprovalCard from './ApprovalCard';

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

  const handleApprove = async (id) => {
    const feedback = window.prompt('Optional feedback to student (leave blank if none):') || '';
    await adminAPI.approveRequest(id, feedback);
    await load();
  };

  const handleReject = async (id) => {
    const feedback = window.prompt('Reason for rejection (optional):') || '';
    await adminAPI.rejectRequest(id, feedback);
    await load();
  };

  return (
    <div className="space-y-4">
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && requests.length === 0 && <div>No pending requests.</div>}
      {requests.map((req) => (
        <ApprovalCard
          key={req._id}
          request={req}
          onApprove={handleApprove}
          onReject={handleReject}
        />)
      )}
    </div>
  );
};

export default ApprovalQueue;