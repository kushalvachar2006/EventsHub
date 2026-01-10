import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import { adminAPI } from '../services/api';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

const AdminRequestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [request, setRequest] = useState(null);
  const [acting, setActing] = useState(false);
  const letterRef = useRef(null);

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      // There is no single-request fetch API defined; use the queue and find.
      const { data } = await adminAPI.getPendingRequests();
      const list = Array.isArray(data) ? data : [];
      const match = list.find((r) => r._id === id);
      setRequest(match || null);
      if (!match) setError('Request not found or no longer pending.');
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load request');
    } finally {
      setLoading(false);
    }
  };

  const onPrint = () => {
    if (!letterRef.current) return;
    const content = letterRef.current.innerText || '';
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Permission Letter</title><style>
      body{font-family: ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial; padding:24px; color:#111}
      pre{white-space:pre-wrap; font-size:14px; line-height:1.6}
      h1{font-size:18px; margin-bottom:12px}
    </style></head><body>
      <h1>Permission Request</h1>
      <pre>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
    </body></html>`);
    win.document.close();
    win.focus();
    win.print();
    // Optionally close after print
    // win.close();
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const subject = useMemo(() => {
    if (!request) return '';
    const student = request.student || {};
    const event = request.event || {};
    return `${student.name || 'Student'} – Permission request for ${event.title || 'Event'}`;
  }, [request]);

  const onAction = async (type) => {
    try {
      setActing(true);
      const feedback = window.prompt(type === 'approve' ? 'Optional feedback to student (leave blank if none):' : 'Reason for rejection (optional):') || '';
      if (type === 'approve') await adminAPI.approveRequest(id, feedback);
      else await adminAPI.rejectRequest(id, feedback);
      navigate('/admin/approvals');
    } catch (e) {
      setError(e?.response?.data?.message || 'Action failed');
    } finally {
      setActing(false);
    }
  };

  return (
    <PageLayout title="Request Details">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-slate-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {loading && <div className="glass-panel p-6">Loading...</div>}
        {error && !loading && (
          <div className="glass-panel p-6 text-red-400">{error}</div>
        )}

        {!loading && request && (
          <div className="card-floating p-8">
            <div className="mb-6">
              <div className="text-sm text-slate-400">Subject</div>
              <div className="text-lg font-semibold text-white mt-1">{subject}</div>
            </div>

            <div className="mb-8">
              <div className="text-sm text-slate-400">Body</div>
              <div ref={letterRef} className="mt-2 whitespace-pre-line text-slate-200 bg-white/5 border border-white/10 rounded-xl p-4">
                {request.reasonForAttending || '—'}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onPrint}
                disabled={acting}
                className="w-full sm:flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-slate-600 rounded-xl hover:bg-slate-500 transition-all"
              >
                Print Letter (PDF)
              </button>
              <button
                onClick={() => onAction('reject')}
                disabled={acting}
                className="w-full sm:flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-all flex items-center justify-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </button>
              <button
                onClick={() => onAction('approve')}
                disabled={acting}
                className="w-full sm:flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-green-500 rounded-xl hover:bg-green-600 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default AdminRequestDetailPage;
