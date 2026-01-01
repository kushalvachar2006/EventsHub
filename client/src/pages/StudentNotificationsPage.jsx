import React, { useEffect, useState } from 'react';
import PageLayout from '../components/common/PageLayout';
import { notificationAPI } from '../services/api';
import { Bell, CheckCircle2, Trash2, Calendar, Info } from 'lucide-react';
import { formatDate } from '../utils/date';

const NotificationItem = ({ n, onRead, onDelete }) => {
  const typeBadge = {
    selection: 'bg-blue-500/20 text-blue-300',
    rejection: 'bg-red-500/20 text-red-300',
    approval: 'bg-green-500/20 text-green-300',
    'hod-rejection': 'bg-red-500/20 text-red-300',
  }[n.type] || 'bg-slate-700/50 text-slate-300';

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 flex items-start gap-4">
      <div className={`p-2 rounded-xl ${n.read ? 'bg-slate-800' : 'bg-brand-cyan/20'}`}>
        <Bell className="h-5 w-5 text-brand-cyan" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-0.5 text-xs rounded-full ${typeBadge}`}>{n.type}</span>
          {n.event?.title && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {n.event.title}
            </span>
          )}
          <span className="text-xs text-slate-500">{formatDate(n.createdAt)}</span>
        </div>
        <p className="mt-1 text-slate-200 whitespace-pre-line">{n.message}</p>
        <div className="mt-3 flex gap-2">
          {!n.read && (
            <button onClick={() => onRead(n._id)} className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-300 text-sm hover:bg-green-500/30 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Mark as read
            </button>
          )}
          <button onClick={() => onDelete(n._id)} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 text-sm hover:bg-red-500/30 flex items-center gap-1">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const StudentNotificationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await notificationAPI.getNotifications();
      const list = Array.isArray(data?.notifications) ? data.notifications : [];
      setItems(list);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markAsRead = async (id) => {
    await notificationAPI.markAsRead(id);
    await load();
  };
  const remove = async (id) => {
    await notificationAPI.deleteNotification(id);
    await load();
  };

  return (
    <PageLayout title="Notifications">
      <div className="space-y-4">
        {loading && (
          <div className="text-slate-400">Loading notifications...</div>
        )}
        {error && (
          <div className="text-red-400">{error}</div>
        )}
        {!loading && !error && items.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 text-slate-300 flex items-center gap-2">
            <Info className="h-5 w-5" /> You have no notifications.
          </div>
        )}
        {items.map((n) => (
          <NotificationItem key={n._id} n={n} onRead={markAsRead} onDelete={remove} />
        ))}
      </div>
    </PageLayout>
  );
};

export default StudentNotificationsPage;
