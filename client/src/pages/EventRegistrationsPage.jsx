import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "../components/common/PageLayout";
import { hostAPI, eventsAPI } from "../services/api";
import { useToast } from "../context/ToastContext.jsx";
import { CheckCircle, XCircle, Clock, Mail, Phone, Users } from "lucide-react";

const EventRegistrationsPage = () => {
  const { eventId } = useParams();
  const { show } = useToast();
  const [event, setEvent] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const [{ data: ev }, { data: regs }] = await Promise.all([
        eventsAPI.getEvent(eventId),
        hostAPI.getRegistrationsForEvent(eventId),
      ]);
      setEvent(ev);
      setRows(regs?.registrations || regs || []);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [eventId]);

  const act = async (regId, type) => {
    try {
      if (type === "select") {
        const feedback =
          window.prompt("Optional feedback/remarks for the team:") || "";
        const payload = feedback ? { feedback } : {};
        await hostAPI.selectStudent(regId, payload);
      } else {
        const feedback =
          window.prompt(
            "Feedback for rejection (reasons, criteria not met, etc.):"
          ) || "";
        await hostAPI.rejectStudent(regId, feedback);
      }
      show(type === "select" ? "Team selected" : "Team rejected", "success");
      await load();
    } catch (e) {
      show(e?.response?.data?.message || "Action failed", "error");
    }
  };

  return (
    <PageLayout title={`Registrations${event ? ` for ${event.title}` : ""}`}>
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="w-8 h-8 border-3 border-brand-cyan border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Loading registrations...
          </p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}
      {!loading && (
        <div className="glass-panel rounded-lg overflow-hidden">
          {rows.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-slate-400">
              No registrations yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-brand-cyan/5 to-brand-violet/5 dark:from-brand-cyan/10 dark:to-brand-violet/10 border-b border-gray-200 dark:border-slate-700">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300 w-1/6">
                      Team Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300 w-2/6">
                      Team Leader
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300 w-2/6">
                      Members
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300 w-1/12">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300 w-1/6">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {rows.map((r) => {
                    const isSelected = r.status === "selected";
                    const isRejected = r.status === "not-selected";
                    const isAwaitingHoD = r.status === "awaiting-hod-approval";
                    const isApprovedByHoD = r.status === "approved";
                    const isRejectedByHoD = r.status === "rejected-by-hod";
                    // For host view: treat HoD statuses as "Selected" since student has moved past host approval
                    const isActionable =
                      !isSelected &&
                      !isRejected &&
                      !isAwaitingHoD &&
                      !isApprovedByHoD &&
                      !isRejectedByHoD;
                    // Display status for host: hide HoD internal details
                    const displayStatus =
                      isAwaitingHoD || isApprovedByHoD
                        ? "selected"
                        : isRejectedByHoD
                        ? "not-selected"
                        : r.status;
                    const statusIcon =
                      displayStatus === "selected" ? (
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : displayStatus === "not-selected" ? (
                        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      ) : (
                        <Clock className="h-4 w-4 text-brand-cyan" />
                      );
                    const statusText =
                      displayStatus === "selected"
                        ? "Selected"
                        : displayStatus === "not-selected"
                        ? "Rejected"
                        : "Pending";

                    return (
                      <tr
                        key={r._id}
                        className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        {/* Team Name */}
                        <td className="px-4 py-3">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {r.teamName ||
                              (r.student?.name
                                ? `${r.student.name}'s Team`
                                : "Team")}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-slate-400">
                            {r.student?.college || "—"}
                          </div>
                        </td>

                        {/* Team Leader */}
                        <td className="px-4 py-3 text-sm">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {r.teamLeader?.name || r.student?.name || "—"}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-slate-400">
                            {r.teamLeader?.email && (
                              <a
                                href={`mailto:${r.teamLeader.email}`}
                                className="text-brand-cyan hover:underline"
                              >
                                {r.teamLeader.email}
                              </a>
                            )}
                          </div>
                          {r.teamLeader?.phoneNumber && (
                            <div className="text-xs text-gray-600 dark:text-slate-400">
                              <a
                                href={`tel:${r.teamLeader.phoneNumber}`}
                                className="text-brand-cyan hover:underline"
                              >
                                {r.teamLeader.phoneNumber}
                              </a>
                            </div>
                          )}
                        </td>

                        {/* Team Members */}
                        <td className="px-4 py-3 text-sm">
                          {Array.isArray(r.teamMembers) &&
                          r.teamMembers.length > 0 ? (
                            <div className="space-y-1">
                              {r.teamMembers.map((m, i) => (
                                <div key={i} className="text-xs">
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {m.name || "—"}
                                  </div>
                                  <div className="text-gray-600 dark:text-slate-400">
                                    {m.email && (
                                      <a
                                        href={`mailto:${m.email}`}
                                        className="text-brand-cyan hover:underline"
                                      >
                                        {m.email}
                                      </a>
                                    )}
                                    {m.email && m.phoneNumber && " • "}
                                    {m.phoneNumber && (
                                      <a
                                        href={`tel:${m.phoneNumber}`}
                                        className="text-brand-cyan hover:underline"
                                      >
                                        {m.phoneNumber}
                                      </a>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-500 dark:text-slate-400">
                              No members
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {statusIcon}
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              {statusText}
                            </span>
                          </div>
                          {r.feedback && (
                            <div className="mt-1 text-xs text-gray-600 dark:text-slate-400 bg-yellow-50 dark:bg-yellow-900/30 dark:border dark:border-yellow-800/50 p-1 rounded">
                              {isSelected ? "✓" : "✗"} {r.feedback}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        {isActionable && (
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => act(r._id, "reject")}
                                className="px-2 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 rounded transition"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => act(r._id, "select")}
                                className="px-2 py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 rounded transition"
                              >
                                Select
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
};

export default EventRegistrationsPage;
