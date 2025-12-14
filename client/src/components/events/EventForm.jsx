import React, { useRef, useState, useEffect } from "react";
import DatePicker from "react-datepicker";

// Props:
// - initialValues: { title, description, date, location, category, bannerUrl }
// - onSubmit: (formData) => Promise
// - submitLabel: string
const EventForm = ({
  initialValues = null,
  onSubmit,
  submitLabel = "Save Event",
}) => {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(
    initialValues?.description || ""
  );
  const [date, setDate] = useState(
    initialValues?.date ? new Date(initialValues.date) : null
  );
  const [location, setLocation] = useState(initialValues?.location || "");
  const [category, setCategory] = useState(initialValues?.category || "");
  const [bannerFile, setBannerFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState(
    initialValues?.registrationDeadline
      ? new Date(initialValues.registrationDeadline)
      : null
  );
  const [teamSize, setTeamSize] = useState(
    typeof initialValues?.teamSize === "number" ? initialValues.teamSize : ""
  );
  const [minTeamSize, setMinTeamSize] = useState(
    typeof initialValues?.minTeamSize === "number"
      ? initialValues.minTeamSize
      : "1"
  );
  const [requireTeamDetails, setRequireTeamDetails] = useState(
    initialValues?.requireTeamDetails || false
  );
  const editorRef = useRef(null);
  const selectionRef = useRef(null);

  useEffect(() => {
    if (!initialValues) return;
    // Sync from initialValues only when its fields change
    setTitle(initialValues.title || "");
    setDescription(initialValues.description || "");
    setDate(initialValues.date ? new Date(initialValues.date) : null);
    setLocation(initialValues.location || "");
    setCategory(initialValues.category || "");
    setRegistrationDeadline(
      initialValues.registrationDeadline
        ? new Date(initialValues.registrationDeadline)
        : null
    );
    setTeamSize(
      typeof initialValues.teamSize === "number" ? initialValues.teamSize : ""
    );
    setMinTeamSize(
      typeof initialValues.minTeamSize === "number"
        ? initialValues.minTeamSize
        : "1"
    );
    setRequireTeamDetails(initialValues.requireTeamDetails || false);
  }, [
    initialValues?.title,
    initialValues?.description,
    initialValues?.date,
    initialValues?.location,
    initialValues?.category,
    initialValues?.registrationDeadline,
    initialValues?.teamSize,
    initialValues?.minTeamSize,
    initialValues?.requireTeamDetails,
  ]);

  useEffect(() => {
    if (bannerFile) {
      const url = URL.createObjectURL(bannerFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl("");
    }
  }, [bannerFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (date instanceof Date && !Number.isNaN(date.getTime()))
        formData.append("date", date.toISOString());
      formData.append("location", location);
      formData.append("category", category);
      if (registrationDeadline)
        formData.append(
          "registrationDeadline",
          registrationDeadline.toISOString()
        );
      if (teamSize !== "" && !Number.isNaN(Number(teamSize)))
        formData.append("teamSize", Number(teamSize));
      if (minTeamSize !== "" && !Number.isNaN(Number(minTeamSize)))
        formData.append("minTeamSize", Number(minTeamSize));
      formData.append("requireTeamDetails", requireTeamDetails);
      if (bannerFile) formData.append("banner", bannerFile);

      await onSubmit(formData);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  };

  const saveSelection = () => {
    const sel = window.getSelection?.();
    if (!sel || sel.rangeCount === 0) return;
    selectionRef.current = sel.getRangeAt(0);
  };

  const restoreSelection = () => {
    const sel = window.getSelection?.();
    if (!sel || !selectionRef.current) return;
    sel.removeAllRanges();
    sel.addRange(selectionRef.current);
  };

  const applyFormat = (command, value = null) => {
    try {
      if (editorRef.current) editorRef.current.focus();
      restoreSelection();
      document.execCommand(command, false, value);
      saveSelection();
    } catch {
      // ignore
    }
  };

  const getPlainText = (html) => html.replace(/<[^>]*>/g, "").trim();

  return (
    <form
      className="space-y-7 glass-panel p-8"
      onSubmit={handleSubmit}
    >
      {error && (
        <div className="text-red-400 text-sm rounded-md bg-red-900/30 px-3 py-2 border border-red-800/50">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          <span className="text-gradient">
            Event Details
          </span>
        </h2>
        <span className="text-xs font-medium text-slate-400">
          All fields marked with • are required
        </span>
      </div>

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Event Title •
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
          placeholder="e.g., Nexus 2025"
          required
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Description •
        </label>

        <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900/40">
          <div className="flex flex-wrap items-center gap-2 p-2 border-b border-white/10 bg-slate-900/40">
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-sm"
              onMouseDown={(e) => {
                e.preventDefault();
                saveSelection();
                applyFormat('bold');
              }}
            >
              B
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-sm italic"
              onMouseDown={(e) => {
                e.preventDefault();
                saveSelection();
                applyFormat('italic');
              }}
            >
              I
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-sm underline"
              onMouseDown={(e) => {
                e.preventDefault();
                saveSelection();
                applyFormat('underline');
              }}
            >
              U
            </button>

            <span className="mx-1 h-6 w-px bg-white/10" />

            <button
              type="button"
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-sm"
              onMouseDown={(e) => {
                e.preventDefault();
                saveSelection();
                applyFormat('insertUnorderedList');
              }}
            >
              • List
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-sm"
              onMouseDown={(e) => {
                e.preventDefault();
                saveSelection();
                applyFormat('insertOrderedList');
              }}
            >
              1. List
            </button>

            <span className="mx-1 h-6 w-px bg-white/10" />

            <button
              type="button"
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-sm"
              onMouseDown={(e) => {
                e.preventDefault();
                saveSelection();
                const url = window.prompt('Enter link URL');
                if (!url) return;
                applyFormat('createLink', url);
              }}
            >
              Link
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-sm"
              onMouseDown={(e) => {
                e.preventDefault();
                saveSelection();
                applyFormat('removeFormat');
              }}
            >
              Clear
            </button>
          </div>

          <div
            id="description"
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => setDescription(e.currentTarget.innerHTML)}
            onBlur={(e) => setDescription(e.currentTarget.innerHTML)}
            onMouseUp={saveSelection}
            onKeyUp={saveSelection}
            onFocus={saveSelection}
            className="min-h-[140px] px-4 py-3 text-white outline-none"
            data-placeholder="What is your event about?"
            dangerouslySetInnerHTML={{ __html: description || '' }}
          />
        </div>

        <input
          tabIndex={-1}
          className="sr-only"
          value={getPlainText(description)}
          onChange={() => {}}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Date and Time •
          </label>
          <DatePicker
            id="date"
            selected={date}
            onChange={(d) => setDate(d)}
            showTimeSelect
            timeIntervals={15}
            dateFormat="MMM d, yyyy h:mm aa"
            placeholderText="Select date & time"
            className="input-field"
            required
          />
        </div>
        <div>
          <label
            htmlFor="deadline"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Registration Deadline
          </label>
          <DatePicker
            id="deadline"
            selected={registrationDeadline}
            onChange={(d) => setRegistrationDeadline(d)}
            showTimeSelect
            timeIntervals={15}
            dateFormat="MMM d, yyyy h:mm aa"
            placeholderText="Optional"
            className="input-field"
            isClearable
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Location •
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input-field"
            placeholder="e.g., Main Auditorium"
            required
          />
        </div>
        <div>
          <label
            htmlFor="teamSize"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Team Size (max participants per team)
          </label>
          <input
            type="number"
            min="1"
            id="teamSize"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            className="input-field"
            placeholder="e.g., 4"
          />
          <p className="text-xs text-slate-400 mt-1">
            Includes team leader and members. Leave empty for no limit.
          </p>
        </div>
        <div>
          <label
            htmlFor="minTeamSize"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Minimum Team Size
          </label>
          <input
            type="number"
            min="1"
            id="minTeamSize"
            value={minTeamSize}
            onChange={(e) => setMinTeamSize(e.target.value)}
            className="input-field"
            placeholder="e.g., 4"
          />
          <p className="text-xs text-slate-400 mt-1">
            Minimum participants required per team (including leader).
          </p>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-white/10 rounded-xl p-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="requireTeamDetails"
            checked={requireTeamDetails}
            onChange={(e) => setRequireTeamDetails(e.target.checked)}
            className="h-4 w-4 rounded border-slate-600 text-brand-cyan focus:ring-brand-cyan"
          />
          <label
            htmlFor="requireTeamDetails"
            className="ml-3 text-sm font-medium text-slate-300"
          >
            Require complete team member details
          </label>
        </div>
        <p className="text-xs text-slate-400 mt-2 ml-7">
          If checked, students must provide details for all team members as per
          the minimum team size before registration.
        </p>
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Category
        </label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field"
          placeholder="e.g., Tech, Cultural"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="banner"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Banner Image
          </label>
          <input
            type="file"
            id="banner"
            accept="image/*"
            onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-900/60 file:text-slate-200 hover:file:bg-slate-800/70"
          />
          {initialValues?.bannerUrl && !previewUrl && (
            <p className="text-xs text-slate-400 mt-2">
              Current banner: {initialValues.bannerUrl}
            </p>
          )}
        </div>
        <div>
          {(previewUrl || initialValues?.bannerUrl) && (
            <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900 aspect-[16/9]">
              <img
                src={previewUrl || initialValues?.bannerUrl}
                alt="Banner preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
