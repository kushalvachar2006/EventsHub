import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { eventsAPI, studentAPI } from "../services/api";
import { useToast } from "../context/ToastContext.jsx";
import { formatDate } from "../utils/date";
import { Users, ArrowLeft, Calendar, MapPin } from "lucide-react";

const StudentEventRegistrationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { show } = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState([{ name: "", email: "", phoneNumber: "" }]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await eventsAPI.getEvent(id);
        setEvent(data);
        // Initialize member rows based on min team size (excluding leader) only for team flow
        const isTeamFlow =
          data?.category === "Hackathon" ||
          (data?.category === "Competition" && !!data?.isTeamCompetition);
        if (isTeamFlow) {
          const minTeam = Number(data?.minTeamSize || 1);
          const minMembersRequired = Math.max(minTeam - 1, 0);
          if (minMembersRequired >= 0) {
            setMembers(
              Array.from({ length: minMembersRequired }, () => ({ name: "", email: "", phoneNumber: "" }))
            );
          }
        } else {
          setMembers([{ name: "", email: "", phoneNumber: "" }]);
        }
      } catch (e) {
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const deadlinePassed = useMemo(() => {
    if (!event?.registrationDeadline) return false;
    return new Date() > new Date(event.registrationDeadline);
  }, [event]);

  const isTeamFlow = useMemo(() => {
    return (
      event?.category === "Hackathon" ||
      (event?.category === "Competition" && !!event?.isTeamCompetition)
    );
  }, [event]);

  const canSubmit = () => {
    if (deadlinePassed) return false;
    if (isTeamFlow) {
      if (!teamName.trim()) return false;
      const minTeam = Number(event?.minTeamSize || 1);
      const maxTeam = Number(event?.teamSize || minTeam);
      const minMembersRequired = Math.max(minTeam - 1, 0); // excluding leader
      const maxMembersAllowed = Math.max(maxTeam - 1, 0); // excluding leader
      const nonEmpty = members.filter((m) => m.name || m.email || m.phoneNumber);
      return nonEmpty.length >= minMembersRequired && nonEmpty.length <= maxMembersAllowed;
    }
    // Non-team: ensure user has basic profile details
    return !!(user?.name && user?.email);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit()) {
      show("Please complete required fields", "error");
      return;
    }
    try {
      setSubmitting(true);
      const payload = {};
      if (isTeamFlow) {
        payload.teamName = teamName;
        payload.teamMembers = members
          .filter((m) => m.name || m.email || m.phoneNumber)
          .map((m) => ({ name: m.name, email: m.email, phoneNumber: m.phoneNumber }));
        if (user?.name || user?.email) {
          payload.teamLeader = { name: user?.name || "", email: user?.email || "" };
        }
      } else {
        // Individual registration: include student identity for convenience
        if (user?.name || user?.email) {
          payload.teamLeader = { name: user?.name || "", email: user?.email || "" };
        }
      }
      await studentAPI.registerForEvent(id, payload);
      show(
        isTeamFlow ? "Registration submitted. Await host approval." : "Registration successful.",
        "success"
      );
      navigate("/my-registrations");
    } catch (e) {
      show(e?.response?.data?.message || "Registration failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-3">{error || "Event not found"}</p>
          <Link to={`/events/${id}`} className="text-brand-cyan">Back to event</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-brand-navy via-slate-950 to-brand-navy">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
            <h1 className="text-2xl font-bold mb-2">Register for {event.title}</h1>
            {isTeamFlow ? (
              <>
                <p className="text-slate-400 mb-6 text-sm">Provide your team details below.</p>
                <form onSubmit={onSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">Team name</label>
                    <input className="input-field" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="e.g., Code Warriors" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <Users className="h-4 w-4" /> Team Members
                    </div>
                    <p className="text-xs text-slate-400 mb-2">
                      Allowed team size: {Number(event?.minTeamSize || 1)} to {Number(event?.teamSize || event?.minTeamSize || 1)} members including the team leader.
                      {` You can add up to ${Math.max(Number(event?.teamSize || 1) - 1, 0)} member(s) here.`}
                    </p>
                    <div className="space-y-3">
                      {members.map((m, idx) => (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input className="input-field" placeholder="Name" value={m.name} onChange={(e) => {
                            const next = [...members]; next[idx] = { ...next[idx], name: e.target.value }; setMembers(next);
                          }} />
                          <input className="input-field" type="email" placeholder="Email" value={m.email} onChange={(e) => {
                            const next = [...members]; next[idx] = { ...next[idx], email: e.target.value }; setMembers(next);
                          }} />
                          <input className="input-field" type="tel" placeholder="Phone number" value={m.phoneNumber} onChange={(e) => {
                            const next = [...members]; next[idx] = { ...next[idx], phoneNumber: e.target.value }; setMembers(next);
                          }} />
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-3">
                      <button
                        type="button"
                        className="text-brand-cyan text-sm"
                        onClick={() => {
                          const maxTeam = Number(event?.teamSize || event?.minTeamSize || 1);
                          const maxMembersAllowed = Math.max(maxTeam - 1, 0);
                          if (members.length >= maxMembersAllowed) {
                            show(`You can add up to ${maxMembersAllowed} member(s) for this event.`, 'error');
                            return;
                          }
                          setMembers((p) => [...p, { name: "", email: "", phoneNumber: "" }]);
                        }}
                      >
                        + Add member
                      </button>
                      {members.length > 0 && (
                        <button type="button" className="text-slate-400 text-sm" onClick={() => setMembers((p) => p.slice(0, -1))}>Remove last</button>
                      )}
                    </div>
                  </div>
                  <div className="pt-2">
                    <button type="submit" disabled={!canSubmit() || submitting} className="btn-primary disabled:opacity-60">
                      {submitting ? "Submitting..." : "Submit Registration"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <p className="text-slate-400 mb-6 text-sm">Verify your account details and confirm registration.</p>
                <div className="rounded-xl border border-white/10 p-4 bg-slate-900/40 space-y-2 mb-4">
                  <div><span className="text-slate-400">Name:</span> {user?.name || '—'}</div>
                  <div><span className="text-slate-400">Email:</span> {user?.email || '—'}</div>
                  {user?.college && <div><span className="text-slate-400">College:</span> {user.college}</div>}
                  {user?.department && <div><span className="text-slate-400">Department:</span> {user.department}</div>}
                </div>
                <form onSubmit={onSubmit}>
                  <button type="submit" disabled={!canSubmit() || submitting} className="btn-primary disabled:opacity-60">
                    {submitting ? "Submitting..." : "Confirm & Register"}
                  </button>
                </form>
              </>
            )}
          </div>
          <div className="lg:col-span-1 glass-panel rounded-2xl p-6">
            <div className="flex items-center gap-2 text-slate-300 mb-2">
              <Calendar className="h-4 w-4" /> {event.date ? formatDate(event.date) : "TBA"}
            </div>
            <div className="flex items-center gap-2 text-slate-300 mb-2">
              <MapPin className="h-4 w-4" /> {event.location}
            </div>
            {event.registrationDeadline && (
              <p className="text-xs text-slate-400">Registration closes: {formatDate(event.registrationDeadline)}</p>
            )}
            {deadlinePassed && (
              <p className="text-xs text-red-400 mt-2">Registration deadline has passed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentEventRegistrationPage;
