import React, { useEffect, useState } from "react";
import PageLayout from "../components/common/PageLayout";
import { notificationAPI } from "../services/api";
import { Bell, Calendar, Info, CheckCircle2, Trash2 } from "lucide-react";
import { formatDate } from "../utils/date";

const HostNotificationItem = ({ n, onRead, onDelete }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 flex items-start gap-4">
      <div
        className={`p-2 rounded-xl ${
          n.read ? "bg-slate-800" : "bg-brand-cyan/20"
        }`}
      >
        <Bell className="h-5 w-5 text-brand-cyan" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 text-xs rounded-full bg-cyan-500/20 text-cyan-300">
            registration
          </span>
          {n.event?.title && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {n.event.title}
            </span>
          )}
          <span className="text-xs text-slate-500">
            {formatDate(n.createdAt)}
          </span>
        </div>
        <p className="mt-1 text-slate-200 whitespace-pre-line">{n.message}</p>
        <div className="mt-3 flex gap-2">
          {!n.read && (
            <button
              onClick={() => onRead(n._id)}
              className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-300 text-sm hover:bg-green-500/30 flex items-center gap-1"
            >
              <CheckCircle2 className="h-4 w-4" /> Mark as read
            </button>
          )}
          <button
            onClick={() => onDelete(n._id)}
            className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 text-sm hover:bg-red-500/30 flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const HostNotificationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await notificationAPI.getNotifications();
      const list = Array.isArray(data?.notifications) ? data.notifications : [];
      // Only registrations for hosts
      const filtered = list.filter((n) => n?.type === "registration");
      setItems(filtered);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    await notificationAPI.markAsRead(id);
    await load();
    window.dispatchEvent(new CustomEvent("notifications-updated"));
  };

  const remove = async (id) => {
    await notificationAPI.deleteNotification(id);
    await load();
    window.dispatchEvent(new CustomEvent("notifications-updated"));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <PageLayout title="Notifications">
      <div className="space-y-4">
        {loading && (
          <div className="text-slate-400">Loading notifications...</div>
        )}
        {error && <div className="text-red-400">{error}</div>}
        {!loading && !error && items.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 text-slate-300 flex items-center gap-2">
            <Info className="h-5 w-5" /> You have no registration notifications.
          </div>
        )}
        {items.map((n) => (
          <HostNotificationItem
            key={n._id}
            n={n}
            onRead={markAsRead}
            onDelete={remove}
          />
        ))}
      </div>
    </PageLayout>
  );
};

export default HostNotificationsPage;
