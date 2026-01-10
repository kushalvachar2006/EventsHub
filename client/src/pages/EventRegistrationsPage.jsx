import React, { useEffect, useMemo, useState } from "react";
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
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [collegeFilter, setCollegeFilter] = useState("all");

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

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (rows || []).filter((r) => {
      const name = (r.teamLeader?.name || r.student?.name || "").toLowerCase();
      const email = (r.teamLeader?.email || r.student?.email || "").toLowerCase();
      const college = (r.student?.college || "").toLowerCase();
      const teamName = (r.teamName || "").toLowerCase();
      const status = (r.status || "").toLowerCase();
      const matchesQuery =
        !q || name.includes(q) || email.includes(q) || college.includes(q) || teamName.includes(q);
      const matchesStatus = statusFilter === "all" || status === statusFilter;
      const matchesCollege = collegeFilter === "all" || college === collegeFilter.toLowerCase();
      return matchesQuery && matchesStatus && matchesCollege;
    });
  }, [rows, query, statusFilter, collegeFilter]);

  const uniqueColleges = useMemo(() => {
    const set = new Set((rows || []).map((r) => r.student?.college).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [rows]);

  const exportCSV = () => {
    const isTeam = event && (event.category === "Hackathon" || (event.category === "Competition" && !!event.isTeamCompetition));
    let headers;
    if (isTeam) {
      headers = ["Team Name", "Leader Name", "Leader Email", "Leader Phone", "Members", "College", "Status"];
    } else {
      headers = ["Name", "Email", "College", "Phone Number"];
    }
    const rowsData = filteredRows.map((r) => {
      if (isTeam) {
        const members = Array.isArray(r.teamMembers)
          ? r.teamMembers.map((m) => `${m.name || ""} ${m.email ? `(${m.email})` : ""}`.trim()).join("; ")
          : "";
        const leaderPhone = r.teamLeader?.phoneNumber || r.student?.phoneNumber || "";
        return [
          r.teamName || (r.student?.name ? `${r.student.name}'s Team` : "Team"),
          r.teamLeader?.name || r.student?.name || "",
          r.teamLeader?.email || r.student?.email || "",
          leaderPhone,
          members,
          r.student?.college || "",
          r.status || "",
        ];
      } else {
        return [
          r.teamLeader?.name || r.student?.name || "",
          r.teamLeader?.email || r.student?.email || "",
          r.student?.college || "",
          r.teamLeader?.phoneNumber || r.student?.phoneNumber || "",
        ];
      }
    });
    const csv = [headers, ...rowsData]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event?.title || "registrations"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
              {/* Controls */}
              <div className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search name, email, or college"
                    className="input-field w-64"
                  />
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field">
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="selected">Selected</option>
                    <option value="awaiting-hod-approval">Awaiting HoD</option>
                    <option value="approved">Approved</option>
                    <option value="not-selected">Not Selected</option>
                    <option value="rejected-by-hod">Rejected by HoD</option>
                  </select>
                  <select value={collegeFilter} onChange={(e) => setCollegeFilter(e.target.value)} className="input-field">
                    {uniqueColleges.map((c) => (
                      <option key={c} value={c}>{c === "all" ? "All Colleges" : c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={exportCSV} className="px-3 py-2 text-sm font-semibold text-white bg-slate-700 rounded-xl hover:bg-slate-600 transition-all">Export CSV</button>
                  <button onClick={load} className="px-3 py-2 text-sm font-semibold text-white bg-slate-700 rounded-xl hover:bg-slate-600 transition-all">Refresh</button>
                </div>
              </div>
              <table className="w-full border-collapse">
                <thead>
                  {event && (event.category === "Hackathon" || (event.category === "Competition" && !!event.isTeamCompetition)) ? (
                    <tr className="bg-gradient-to-r from-brand-cyan/5 to-brand-violet/5 dark:from-brand-cyan/10 dark:to-brand-violet/10 border-b border-gray-200 dark:border-slate-700">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300 w-1/6">Team Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300 w-2/6">Team Leader</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300 w-2/6">Members</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300 w-1/12">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300 w-1/6">Actions</th>
                    </tr>
                  ) : (
                    <tr className="bg-gradient-to-r from-brand-cyan/5 to-brand-violet/5 dark:from-brand-cyan/10 dark:to-brand-violet/10 border-b border-gray-200 dark:border-slate-700">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">College</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-slate-300">Phone Number</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {filteredRows.map((r) => {
                    const isSelected = r.status === "selected";
                    const isRejected = r.status === "not-selected";
                    const isAwaitingHoD = r.status === "awaiting-hod-approval";
                    const isApprovedByHoD = r.status === "approved";
                    const isRejectedByHoD = r.status === "rejected-by-hod";
                    const isTeamFlow =
                      event?.category === "Hackathon" ||
                      (event?.category === "Competition" && !!event?.isTeamCompetition);
                    const isAutoApprovedIndividual = !isTeamFlow && isApprovedByHoD;
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
                    // Status text; if non-team and approved, show 'Approved (Auto)'
                    const statusText = isAutoApprovedIndividual
                      ? "Approved (Auto)"
                      : displayStatus === "selected"
                      ? "Selected"
                      : displayStatus === "not-selected"
                      ? "Rejected"
                      : "Pending";

                    const teamFlow = event?.category === "Hackathon" || (event?.category === "Competition" && !!event?.isTeamCompetition);
                    return (
                      <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                        {teamFlow ? (
                          <>
                            {/* Team Name */}
                            <td className="px-4 py-3">
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                {r.teamName || (r.student?.name ? `${r.student.name}'s Team` : "Team")}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-slate-400">{r.student?.college || "—"}</div>
                            </td>
                            {/* Team Leader */}
                            <td className="px-4 py-3 text-sm">
                              <div className="font-medium text-gray-900 dark:text-white">{r.teamLeader?.name || r.student?.name || "—"}</div>
                              <div className="text-xs text-gray-600 dark:text-slate-400">
                                {r.teamLeader?.email && (
                                  <a href={`mailto:${r.teamLeader.email}`} className="text-brand-cyan hover:underline">{r.teamLeader.email}</a>
                                )}
                                {r.teamLeader?.email && (r.teamLeader?.phoneNumber || r.student?.phoneNumber) && " • "}
                                {(r.teamLeader?.phoneNumber || r.student?.phoneNumber) && (
                                  <a href={`tel:${r.teamLeader?.phoneNumber || r.student?.phoneNumber}`} className="text-brand-cyan hover:underline">{r.teamLeader?.phoneNumber || r.student?.phoneNumber}</a>
                                )}
                              </div>
                            </td>
                            {/* Team Members */}
                            <td className="px-4 py-3 text-sm">
                              {Array.isArray(r.teamMembers) && r.teamMembers.length > 0 ? (
                                <div className="space-y-1">
                                  {r.teamMembers.map((m, i) => (
                                    <div key={i} className="text-xs">
                                      <div className="font-medium text-gray-900 dark:text-white">{m.name || "—"}</div>
                                      <div className="text-gray-600 dark:text-slate-400">
                                        {m.email && (
                                          <a href={`mailto:${m.email}`} className="text-brand-cyan hover:underline">{m.email}</a>
                                        )}
                                        {m.email && m.phoneNumber && " • "}
                                        {m.phoneNumber && (
                                          <a href={`tel:${m.phoneNumber}`} className="text-brand-cyan hover:underline">{m.phoneNumber}</a>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-500 dark:text-slate-400">No members</span>
                              )}
                            </td>
                          </>
                        ) : (
                          <>
                            {/* Name */}
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{r.teamLeader?.name || r.student?.name || "—"}</td>
                            {/* Email */}
                            <td className="px-4 py-3 text-sm">
                              {r.teamLeader?.email || r.student?.email ? (
                                <a
                                  href={`mailto:${r.teamLeader?.email || r.student?.email}`}
                                  className="text-brand-cyan hover:underline"
                                >
                                  {r.teamLeader?.email || r.student?.email}
                                </a>
                              ) : (
                                <span className="text-gray-500 dark:text-slate-400">—</span>
                              )}
                            </td>
                            {/* College */}
                            <td className="px-4 py-3 text-sm">{r.student?.college || "—"}</td>
                            {/* Phone Number */}
                            <td className="px-4 py-3 text-sm">
                              {(r.teamLeader?.phoneNumber || r.student?.phoneNumber) ? (
                                <a href={`tel:${r.teamLeader?.phoneNumber || r.student?.phoneNumber}`} className="text-brand-cyan hover:underline">{r.teamLeader?.phoneNumber || r.student?.phoneNumber}</a>
                              ) : (
                                <span className="text-gray-500 dark:text-slate-400">—</span>
                              )}
                            </td>
                          </>
                        )}

                        {/* Status & Actions: Only for team flow */}
                        {teamFlow && (
                          <>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                {statusIcon}
                                <span className="text-xs font-medium text-gray-900 dark:text-white">{statusText}</span>
                              </div>
                              {isAutoApprovedIndividual && (
                                <div className="mt-1 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-300 border border-green-500/20">Auto-approved</div>
                              )}
                              {r.feedback && (
                                <div className="mt-1 text-xs text-gray-600 dark:text-slate-400 bg-yellow-50 dark:bg-yellow-900/30 dark:border dark:border-yellow-800/50 p-1 rounded">{isSelected ? "✓" : "✗"} {r.feedback}</div>
                              )}
                            </td>
                            {isActionable && (
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <button onClick={() => act(r._id, "reject")} className="px-2 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 rounded transition">Reject</button>
                                  <button onClick={() => act(r._id, "select")} className="px-2 py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 rounded transition">Select</button>
                                </div>
                              </td>
                            )}
                          </>
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
