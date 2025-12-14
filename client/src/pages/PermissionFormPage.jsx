import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "../components/common/PageLayout";
import { studentAPI } from "../services/api";
import { useToast } from "../context/ToastContext.jsx";
import { formatDate } from "../utils/date";

const PermissionFormPage = () => {
  const { regId } = useParams();
  const navigate = useNavigate();
  const { show } = useToast();
  const [reason, setReason] = useState("");
  const [teamMembers, setTeamMembers] = useState([
    { name: "", email: "", role: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registration, setRegistration] = useState(null);

  // Optionally load the registration to show event details
  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        const { data } = await studentAPI.getMyRegistrations();
        const reg = (data || []).find((r) => r._id === regId);
        setRegistration(reg || null);
      } catch (e) {
        setError("Failed to load registration details");
      }
    };
    load();
  }, [regId]);

  const cleanTeamMembers = useMemo(
    () => teamMembers.filter((m) => m.name || m.email || m.role),
    [teamMembers]
  );

  const handleMemberChange = (idx, field, value) => {
    setTeamMembers((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const addMemberRow = () =>
    setTeamMembers((prev) => [...prev, { name: "", email: "", role: "" }]);
  const removeMemberRow = (idx) =>
    setTeamMembers((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      show("Please provide a reason for attending.", "error");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await studentAPI.requestPermission({
        registrationId: regId,
        reasonForAttending: reason,
        teamMembers: cleanTeamMembers,
      });
      show("Approval sent to HoD successfully!", "success");
      setReason("");
      setTeamMembers([{ name: "", email: "", role: "" }]);

      // Navigate to dashboard after 1.5 seconds to allow user to see the success message
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      const msg = err?.response?.data?.message || "Submission failed";
      show(msg, "error");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="HOD Permission Form">
      <div className="glass-panel p-8 max-w-2xl mx-auto">
        {registration && (
          <>
            <h2 className="text-2xl font-bold text-white mb-1">
              Request for: {registration.event?.title}
            </h2>
            <p className="text-slate-300 mb-6">
              {registration.event?.date
                ? formatDate(registration.event.date)
                : ""}
              {registration.event?.location
                ? ` • ${registration.event.location}`
                : ""}
            </p>
          </>
        )}

        {error && (
          <div className="text-red-400 text-sm rounded-md bg-red-900/30 px-3 py-2 border border-red-800/50 mb-4">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-slate-300"
            >
              Reason for Attending
            </label>
            <textarea
              id="reason"
              rows="5"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input-field"
              placeholder="Explain how attending this event will be beneficial for you (e.g., aligns with your studies, career goals, etc.)"
            ></textarea>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-300">
                Team Members (optional)
              </label>
              <button
                type="button"
                onClick={addMemberRow}
                className="text-brand-cyan text-sm font-medium"
              >
                + Add member
              </button>
            </div>
            <div className="space-y-3 mt-2">
              {teamMembers.map((m, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3"
                >
                  <input
                    type="text"
                    className="md:col-span-4 input-field"
                    placeholder="Name"
                    value={m.name}
                    onChange={(e) =>
                      handleMemberChange(idx, "name", e.target.value)
                    }
                  />
                  <input
                    type="email"
                    className="md:col-span-5 input-field"
                    placeholder="Email"
                    value={m.email}
                    onChange={(e) =>
                      handleMemberChange(idx, "email", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    className="md:col-span-2 input-field"
                    placeholder="Role"
                    value={m.role}
                    onChange={(e) =>
                      handleMemberChange(idx, "role", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeMemberRow(idx)}
                    className="md:col-span-1 text-red-400 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? "Submitting..." : "Submit to HoD"}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export default PermissionFormPage;
