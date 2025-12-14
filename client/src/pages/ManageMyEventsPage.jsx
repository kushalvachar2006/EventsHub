import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "../components/common/PageLayout";
import { hostAPI, eventsAPI } from "../services/api";
import { formatDate } from "../utils/date";

const ManageMyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await hostAPI.getMyEvents();
      // hostController returns { success, count, events }
      setEvents(data?.events || []);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load your events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    await eventsAPI.deleteEvent(id);
    await load();
  };

  return (
    <PageLayout title="Manage My Events">
      <div className="mb-8">
        <Link
          to="/create-event"
          className="inline-flex items-center btn-primary"
        >
          <span className="mr-2">+</span> Create Event
        </Link>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="w-8 h-8 border-3 border-brand-cyan border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Loading your events...
          </p>
        </div>
      )}

      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm rounded-lg bg-red-50 dark:bg-red-900/30 dark:border dark:border-red-800/50 px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {!loading && events.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            No events yet.
          </p>
          <Link
            to="/create-event"
            className="inline-flex items-center text-brand-cyan hover:text-brand-cyan/90 font-medium transition"
          >
            Create your first event
            <span className="ml-2">→</span>
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event._id}
            className="glass-panel p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
          >
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {event.title}
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  📅 {event.date ? formatDate(event.date) : "No date set"}
                </p>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  📍 {event.location || "No location"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <Link
                to={`/host/events/${event._id}/registrations`}
                className="text-sm font-medium px-4 py-2 rounded-lg bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 hover:bg-brand-cyan/15 transition"
              >
                Registrations
              </Link>
              <button
                onClick={() => navigate(`/host/events/${event._id}/edit`)}
                className="text-sm font-medium px-4 py-2 rounded-lg bg-brand-violet/10 text-brand-violet border border-brand-violet/20 hover:bg-brand-violet/15 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(event._id)}
                className="text-sm font-medium px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 dark:border dark:border-red-800/50 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
};

export default ManageMyEventsPage;
