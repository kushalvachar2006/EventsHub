import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { eventsAPI, studentAPI } from "../services/api";
import { useToast } from "../context/ToastContext.jsx";
import { formatDate } from "../utils/date";
import { Calendar, MapPin, Building2, Users, Clock, ArrowLeft } from "lucide-react";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { show } = useToast();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [teamMembers, setTeamMembers] = useState([
    { name: "", email: "", phoneNumber: "" },
  ]);
  const [teamName, setTeamName] = useState("");
  const [teamLeader, setTeamLeader] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await eventsAPI.getEvent(id);
        setEvent(data);

        if (user && user.role === "student") {
          try {
            const { data: registrations } =
              await studentAPI.getMyRegistrations();
            const isRegistered = registrations.some(
              (reg) => reg.eventId === id || reg.event?._id === id
            );
            setAlreadyRegistered(isRegistered);
          } catch (e) {
            console.error("Failed to check registration status:", e);
          }
        }
      } catch (e) {
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user]);

  const currentTeamCount = () => {
    const membersCount = teamMembers.filter(
      (m) => m.name || m.email || m.phoneNumber
    ).length;
    const leaderCount =
      teamLeader.name || teamLeader.email || teamLeader.phoneNumber ? 1 : 0;
    return membersCount + leaderCount;
  };

  const exceedsTeamSize = () => {
    if (!event?.teamSize) return false;
    return currentTeamCount() > Number(event.teamSize);
  };

  const validateRegistration = () => {
    if (alreadyRegistered) {
      show("You have already registered for this event.", "error");
      return false;
    }
    if (!teamName || teamName.trim() === "") {
      show("Team name is required.", "error");
      return false;
    }
    if (
      event.registrationDeadline &&
      new Date() > new Date(event.registrationDeadline)
    ) {
      show("Registration deadline has passed.", "error");
      return false;
    }
    if (exceedsTeamSize()) {
      show(`Team size exceeds limit (${event.teamSize}).`, "error");
      return false;
    }
    if (event.minTeamSize && currentTeamCount() < Number(event.minTeamSize)) {
      show(
        `Minimum team size is ${event.minTeamSize}. Current team size: ${currentTeamCount()}.`,
        "error"
      );
      return false;
    }
    if (event.requireTeamDetails) {
      const minSize = event.minTeamSize || 1;
      if (currentTeamCount() < minSize) {
        show(
          `Please add ${minSize - currentTeamCount()} more team member(s) to meet the minimum requirement.`,
          "error"
        );
        return false;
      }
      let detailedCount = 0;
      if (teamLeader.name && teamLeader.email && teamLeader.phoneNumber) {
        detailedCount++;
      }
      teamMembers.forEach((m) => {
        if (m.name && m.email && m.phoneNumber) {
          detailedCount++;
        }
      });
      if (detailedCount < minSize) {
        show(
          `All team members must have complete details (name, email, phone). Currently ${detailedCount}/${minSize} complete.`,
          "error"
        );
        return false;
      }
    }
    const hasTeamMembers = teamMembers.some(
      (m) => m.name || m.email || m.phoneNumber
    );
    if (
      hasTeamMembers &&
      !teamLeader.name &&
      !teamLeader.email &&
      !teamLeader.phoneNumber
    ) {
      show(
        "Please provide team leader details if adding team members.",
        "error"
      );
      return false;
    }
    return true;
  };

  const onRegister = async () => {
    try {
      if (!validateRegistration()) {
        return;
      }
      setRegLoading(true);
      const clean = teamMembers.filter(
        (m) => m.name || m.email || m.phoneNumber
      );
      await studentAPI.registerForEvent(id, {
        teamName,
        teamLeader,
        teamMembers: clean,
      });
      show(
        "Registration submitted successfully. Awaiting host approval.",
        "success"
      );
      setTimeout(() => {
        navigate("/my-registrations");
      }, 1500);
    } catch (e) {
      const msg = e?.response?.data?.message || "Registration failed";
      show(msg, "error");
    } finally {
      setRegLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-brand-navy via-slate-950 to-brand-navy">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-cyan"></div>
          <p className="text-slate-400 mt-4">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-brand-navy via-slate-950 to-brand-navy">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Event not found"}</p>
          <Link
            to="/events"
            className="text-brand-cyan hover:text-brand-cyan/80 transition-colors"
          >
            Back to all events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-navy via-slate-950 to-brand-navy py-12 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-violet/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/events")}
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Events</span>
        </button>

        {/* Event Card */}
        <div className="glass-panel rounded-3xl overflow-hidden animate-slide-up">
          {/* Banner */}
          {event.bannerUrl && (
            <div className="aspect-[16/9] bg-slate-800 relative overflow-hidden">
              <img
                src={event.bannerUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
            </div>
          )}

          <div className="p-8 md:p-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-brand-cyan" />
                <span className="text-lg font-semibold text-brand-cyan">
                  {event.date ? formatDate(event.date) : ""}
                </span>
              </div>
              {user && user.role === "student" && (
                <button
                  onClick={onRegister}
                  disabled={
                    regLoading ||
                    alreadyRegistered ||
                    (event.registrationDeadline &&
                      new Date() > new Date(event.registrationDeadline)) ||
                    exceedsTeamSize()
                  }
                  className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {alreadyRegistered
                    ? "Already Registered"
                    : regLoading
                    ? "Registering..."
                    : "Register for this Event"}
                </button>
              )}
              {!user && (
                <button
                  onClick={() => navigate("/login")}
                  className="btn-primary"
                >
                  Register
                </button>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {event.title}
            </h1>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-slate-400" />
                <span className="text-slate-300">{event.location}</span>
              </div>
              {event.college && (
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-slate-400" />
                  <span className="text-slate-300">{event.college}</span>
                </div>
              )}
              {event.registrationDeadline && (
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-slate-400" />
                  <span className="text-slate-300">
                    Registration closes: {formatDate(event.registrationDeadline)}
                  </span>
                </div>
              )}
              {event.teamSize && (
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-slate-400" />
                  <span className="text-slate-300">
                    Max team size: {event.teamSize}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-slate-300 leading-relaxed text-lg">
                {event.description}
              </p>
            </div>

            {/* Team Registration Form */}
            {user && user.role === "student" && !alreadyRegistered && (
              <div className="mt-8 bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Team Name
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter team name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                    />
                  </div>
                  {/* Team Leader and Members fields - keeping existing logic */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Team Leader Name"
                      value={teamLeader.name}
                      onChange={(e) =>
                        setTeamLeader((prev) => ({ ...prev, name: e.target.value }))
                      }
                    />
                    <input
                      type="email"
                      className="input-field"
                      placeholder="Team Leader Email"
                      value={teamLeader.email}
                      onChange={(e) =>
                        setTeamLeader((prev) => ({ ...prev, email: e.target.value }))
                      }
                    />
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="Team Leader Phone"
                      value={teamLeader.phoneNumber}
                      onChange={(e) =>
                        setTeamLeader((prev) => ({ ...prev, phoneNumber: e.target.value }))
                      }
                    />
                  </div>
                  {teamMembers.map((m, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Name"
                        value={m.name}
                        onChange={(e) => {
                          const next = [...teamMembers];
                          next[idx] = { ...next[idx], name: e.target.value };
                          setTeamMembers(next);
                        }}
                      />
                      <input
                        type="email"
                        className="input-field"
                        placeholder="Email"
                        value={m.email}
                        onChange={(e) => {
                          const next = [...teamMembers];
                          next[idx] = { ...next[idx], email: e.target.value };
                          setTeamMembers(next);
                        }}
                      />
                      <input
                        type="tel"
                        className="input-field"
                        placeholder="Phone"
                        value={m.phoneNumber}
                        onChange={(e) => {
                          const next = [...teamMembers];
                          next[idx] = { ...next[idx], phoneNumber: e.target.value };
                          setTeamMembers(next);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setTeamMembers((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        event?.teamSize &&
                        currentTeamCount() + 1 > Number(event.teamSize)
                      )
                        return;
                      setTeamMembers((prev) => [
                        ...prev,
                        { name: "", email: "", phoneNumber: "" },
                      ]);
                    }}
                    disabled={
                      event?.teamSize
                        ? currentTeamCount() >= Number(event.teamSize)
                        : false
                    }
                    className="text-brand-cyan hover:text-brand-cyan/90 text-sm font-medium disabled:opacity-50"
                  >
                    + Add member
                  </button>
                </div>
              </div>
            )}

            {/* Already Registered Message */}
            {user && user.role === "student" && alreadyRegistered && (
              <div className="mt-6 bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                <p className="text-green-400 font-semibold">✓ Already Registered</p>
                <p className="text-green-300 text-sm mt-2">
                  You have already registered for this event. View your registration{" "}
                  <Link
                    to="/my-registrations"
                    className="text-green-400 font-semibold underline"
                  >
                    here
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
