import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { studentAPI } from "../services/api";
import { formatDate } from "../utils/date";
import { Calendar, CheckCircle, Clock, XCircle, FileText, X } from "lucide-react";

const MyRegistrationsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detailsReg, setDetailsReg] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        const { data } = await studentAPI.getMyRegistrations();
        const validRegistrations = (Array.isArray(data) ? data : []).filter(
          (reg) => reg.event && reg.event._id
        );
        setItems(validRegistrations);
      } catch (e) {
        setError("Failed to load registrations");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "selected":
        return (
          <span className="px-3 py-1.5 text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-2">
            <CheckCircle className="h-3.5 w-3.5" />
            Selected
          </span>
        );
      case "awaiting-hod-approval":
        return (
          <span className="px-3 py-1.5 text-xs font-semibold bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30 rounded-full flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            Awaiting HoD Approval
          </span>
        );
      case "pending":
        return (
          <span className="px-3 py-1.5 text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            Pending Review
          </span>
        );
      case "not-selected":
        return (
          <span className="px-3 py-1.5 text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 rounded-full flex items-center gap-2">
            <XCircle className="h-3.5 w-3.5" />
            Not Selected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1.5 text-xs font-semibold bg-slate-500/20 text-slate-400 border border-slate-500/30 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-navy via-slate-950 to-brand-navy py-12 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-violet/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight">
            My Registrations
          </h1>
          <p className="text-lg text-slate-400">
            View and manage your event registrations
          </p>
        </div>

        {/* Content Card */}
        <div className="glass-panel rounded-3xl p-8 md:p-10 animate-slide-up">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-cyan"></div>
              <p className="text-slate-400 mt-4">Loading registrations...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-xl mb-4">
              {error}
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-300 text-lg mb-4">No registrations yet</p>
              <p className="text-slate-400 text-sm mb-6">
                You haven't registered for any events yet. Start exploring events!
              </p>
              <Link
                to="/events"
                className="inline-block btn-primary"
              >
                Browse Events
              </Link>
            </div>
          )}

          {!loading && items.length > 0 && (
            <div className="space-y-4">
              {items.map((reg) => (
                <div
                  key={reg._id}
                  className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <Link
                        to={`/events/${reg.event?._id || ""}`}
                        className="text-xl font-bold text-white hover:text-brand-cyan transition-colors mb-2 block"
                      >
                        {reg.event?.title || "Event"}
                      </Link>
                      <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                        <Calendar className="h-4 w-4" />
                        <span>{reg.event?.date ? formatDate(reg.event.date) : ""}</span>
                      </div>
                      {reg.feedback && (
                        <div className="mt-3 p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg">
                          <p className="text-xs font-semibold text-amber-400 mb-1">
                            {reg.status === "not-selected" ? "📌 Rejection Reason" : "📌 Remark"}
                          </p>
                          <p className="text-sm text-amber-300">{reg.feedback}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                      {getStatusBadge(reg.status)}
                      {reg.status === "selected" && (
                        <Link
                          to={`/permission-form/${reg._id}`}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-all"
                        >
                          Fill Permission Form
                        </Link>
                      )}
                      {reg.status === "awaiting-hod-approval" && (
                        <button
                          disabled
                          className="px-4 py-2 bg-slate-700/50 text-slate-500 rounded-xl text-sm font-semibold cursor-not-allowed"
                        >
                          Submitted to HoD
                        </button>
                      )}
                      {reg.status === "approved" && (
                        <button
                          onClick={() => setDetailsReg(reg)}
                          className="px-4 py-2 bg-brand-cyan/20 hover:bg-brand-cyan/25 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border border-brand-cyan/30"
                        >
                          <FileText className="h-4 w-4" />
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {detailsReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDetailsReg(null)}
          ></div>
          <div className="relative bg-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg mx-auto p-6 max-h-[85vh] overflow-y-auto border border-slate-700/50">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">Team Details</h3>
                <p className="text-sm text-slate-400 mt-1">
                  {detailsReg?.event?.title || "Event"} •{" "}
                  {detailsReg?.event?.date ? formatDate(detailsReg.event.date) : ""}
                </p>
              </div>
              <button
                onClick={() => setDetailsReg(null)}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {detailsReg?.teamName && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Team Name
                </label>
                <div className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-white">
                  {detailsReg.teamName}
                </div>
              </div>
            )}

            {detailsReg?.teamLeader &&
              (detailsReg.teamLeader.name ||
                detailsReg.teamLeader.email ||
                detailsReg.teamLeader.phoneNumber) && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Team Leader
                  </label>
                  <div className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-white">
                    <p className="font-medium">{detailsReg.teamLeader.name || "—"}</p>
                    <p className="text-sm text-slate-400 mt-1">
                      {detailsReg.teamLeader.email || ""}
                      {detailsReg.teamLeader.email && detailsReg.teamLeader.phoneNumber
                        ? " • "
                        : ""}
                      {detailsReg.teamLeader.phoneNumber || ""}
                    </p>
                  </div>
                </div>
              )}

            {Array.isArray(detailsReg?.teamMembers) &&
              detailsReg.teamMembers.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Team Members
                  </label>
                  <div className="space-y-2">
                    {detailsReg.teamMembers.map((m, idx) => (
                      <div
                        key={idx}
                        className="w-full px-4 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-xl text-white"
                      >
                        <p className="font-medium">{m.name || "—"}</p>
                        <p className="text-sm text-slate-400">
                          {m.email || ""}
                          {m.email && m.phoneNumber ? " • " : ""}
                          {m.phoneNumber || ""}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setDetailsReg(null)}
                className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700/70 text-white rounded-xl font-semibold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRegistrationsPage;
