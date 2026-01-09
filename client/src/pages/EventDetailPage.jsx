import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { eventsAPI, studentAPI } from "../services/api";
import { useToast } from "../context/ToastContext.jsx";
import { formatDate } from "../utils/date";
import {
  Calendar,
  MapPin,
  Building2,
  Users,
  Clock,
  ArrowLeft,
  Trophy,
  Globe,
} from "lucide-react";

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
  const registrationClosed = useMemo(() => {
    if (!event?.registrationDeadline) return false;
    return new Date() > new Date(event.registrationDeadline);
  }, [event]);
  const toastShownRef = useRef(false);
  useEffect(() => {
    if (registrationClosed && !toastShownRef.current) {
      show("Registration is closed for this event.", "info");
      toastShownRef.current = true;
    }
  }, [registrationClosed, show]);
  const exceedsTeamSize = () => false; // team size checks now move to registration page
  const onRegister = () => {
    if (alreadyRegistered) {
      show("You have already registered for this event.", "info");
      return;
    }
    if (registrationClosed) {
      show("Registration is closed for this event.", "info");
      return;
    }
    setRegLoading(true);
    navigate(`/events/${id}/register`);
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
    <div className="min-h-screen bg-gradient-to-br from-brand-navy via-slate-950 to-brand-navy pb-12 px-0 md:px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse-glow"></div>
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-brand-violet/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse-glow"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="relative z-10 w-full">
        {/* Top Banner: fixed height, image keeps original width (object-contain) */}
        <div className="w-full flex justify-center">
          {event.bannerUrl ? (
            <div className="relative h-[200px] bg-slate-800 overflow-hidden rounded-xl flex items-center justify-center px-3">
              <img
                src={event.bannerUrl}
                alt={event.title}
                className="h-full w-auto object-contain"
              />
            </div>
          ) : (
            <div className="h-[200px] bg-slate-800/60 rounded-xl w-full max-w-3xl" />
          )}
        </div>

        {/* Header under banner */}
        <div className="max-w-6xl mx-auto px-4 -mt-10 md:-mt-12 relative">
          <button
            onClick={() => navigate("/events")}
            className="mb-4 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Events</span>
          </button>
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            {event.title}
          </h1>
          {event.category && (
            <p className="mt-2 text-slate-300">
              {event.category}
              {event.mode ? ` • ${event.mode}` : ""}
            </p>
          )}

          {/* Summary Card */}
          <div className="mt-6 glass-panel rounded-2xl p-6 border border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-brand-cyan" />
                  <span className="text-slate-200">
                    {event.date ? formatDate(event.date) : "TBA"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-brand-cyan" />
                  <span className="text-slate-200">
                    {event.location ||
                      (event.mode === "Online" ? "Online" : "—")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-brand-cyan" />
                  <span className="text-slate-200">
                    {event.college || event.organizerName || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-brand-cyan" />
                  <span className="text-slate-200">
                    Team size
                    {event.teamSize ? `: up to ${event.teamSize}` : ": —"}
                  </span>
                </div>
              </div>
              <div className="lg:col-span-3">
                <div className="rounded-xl p-4 bg-slate-900/50 border border-white/10 mb-3 flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  <div>
                    <div className="text-xs text-slate-400">Prize Pool</div>
                    <div className="text-white font-semibold">
                      {(() => {
                        // Check multiple possible prize fields
                        const candidates = [
                          event.prizePool,
                          event.prize,
                          event.prize_amount,
                          event.prizeAmount,
                          event.prize_amt,
                          event.prizeDescription,
                          event.prizeText,
                        ];
                        let val = null;
                        for (const c of candidates) {
                          if (
                            c !== undefined &&
                            c !== null &&
                            String(c).trim() !== ""
                          ) {
                            val = c;
                            break;
                          }
                        }
                        if (!val) return "—";
                        // If object, try extracting common numeric fields
                        if (typeof val === "object" && !Array.isArray(val)) {
                          const v =
                            val.amount ??
                            val.value ??
                            val.total ??
                            val.prize ??
                            val.amountInCents ??
                            null;
                          if (v !== null && v !== undefined) val = v;
                          else {
                            // stringify object if no numeric field
                            try {
                              return JSON.stringify(val);
                            } catch (e) {
                              return "—";
                            }
                          }
                        }
                        const num =
                          typeof val === "number"
                            ? val
                            : typeof val === "string"
                            ? Number(String(val).replace(/[^0-9\.]/g, ""))
                            : NaN;
                        if (Number.isFinite(num) && num > 0) {
                          const cur =
                            event.prizeCurrency || event.currency || "INR";
                          const symbols = {
                            USD: "$",
                            EUR: "€",
                            INR: "₹",
                            GBP: "£",
                          };
                          const symbol = symbols[cur] || "";
                          return `${symbol}${num.toLocaleString("en-IN")}${
                            !symbols[cur] ? ` ${cur}` : ""
                          }`;
                        }
                        return String(val).trim();
                      })()}
                    </div>
                  </div>
                </div>
                {user && user.role === "student" ? (
                  <button
                    onClick={onRegister}
                    disabled={
                      regLoading ||
                      alreadyRegistered ||
                      registrationClosed
                    }
                    className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {alreadyRegistered
                      ? "Already Registered"
                      : registrationClosed
                      ? "NoRegistration"
                      : "Register"}
                  </button>
                ) : !user ? (
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full btn-primary"
                  >
                    Register
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Primary content */}
          <div className="lg:col-span-9 space-y-6">
            {(() => {
              const Section = ({ title, content }) =>
                content ? (
                  <section className="glass-panel rounded-2xl p-6">
                    <h2 className="text-xl font-semibold mb-3">{title}</h2>
                    <div
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: String(content) }}
                    />
                  </section>
                ) : null;
              return (
                <>
                  <Section title="Eligibility" content={event.eligibility} />
                  <Section
                    title="Stages and Timelines"
                    content={event.stages || event.timeline}
                  />
                  <Section
                    title="About the Event"
                    content={event.description || event.about}
                  />
                  <Section title="Event Overview" content={event.overview} />
                  <Section
                    title="Rules / Guidelines"
                    content={event.rules || event.guidelines}
                  />
                  <Section
                    title="Problem Statement / Challenge Details"
                    content={event.problemStatement || event.challenge}
                  />
                </>
              );
            })()}
          </div>

          {/* Sticky sidebar */}
          <div className="lg:col-span-3">
            <div className="glass-panel rounded-2xl p-6">
              {user && user.role === "student" ? (
                <button
                  onClick={onRegister}
                  disabled={
                    regLoading ||
                    alreadyRegistered ||
                    (event.registrationDeadline &&
                      new Date() > new Date(event.registrationDeadline))
                  }
                  className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {alreadyRegistered ? "Already Registered" : "Register"}
                </button>
              ) : !user ? (
                <button
                  onClick={() => navigate("/login")}
                  className="w-full btn-primary"
                >
                  Register
                </button>
              ) : null}
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />{" "}
                  {event.date ? formatDate(event.date) : "TBA"}
                </div>
                {event.registrationDeadline && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Reg. deadline:{" "}
                    {formatDate(event.registrationDeadline)}
                  </div>
                )}
              </div>
              {registrationClosed && (
                <p className="text-xs text-red-400 mt-2">Registration closed.</p>
              )}
              <p className="text-xs text-slate-400 mt-3">
                You will be asked for team details on the next page.
              </p>
            </div>

            {/* Host details and website (below sidebar) */}
            {(event.organizerName ||
              event.organizerWebsite ||
              event.contactEmail ||
              event.host ||
              event.website ||
              event.hostWebsite) && (
              <div className="mt-4 glass-panel rounded-2xl p-6 sticky top-28">
                <h3 className="text-sm font-semibold text-slate-200 mb-3">
                  Host Details
                </h3>
                <div className="space-y-2 text-sm text-slate-300">
                  {event.organizerName && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" /> Organizer:{" "}
                      {event.organizerName}
                    </div>
                  )}
                  {event.contactEmail && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" /> Contact:{" "}
                      {event.contactEmail}
                    </div>
                  )}
                  {(event.website ||
                    event.eventWebsite ||
                    event.url ||
                    event.eventUrl) && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <a
                        href={
                          event.website ||
                          event.eventWebsite ||
                          event.url ||
                          event.eventUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-cyan hover:text-cyan-300 truncate inline-block max-w-full"
                      >
                        {String(
                          event.website ||
                            event.eventWebsite ||
                            event.url ||
                            event.eventUrl
                        )}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
