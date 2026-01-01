import React, { useMemo, useRef, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FileText, Calendar as CalendarIcon, MapPin, Globe, Image as ImageIcon, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";

// Props: onSubmit(FormData), initialValues (optional)
const EventCreateWizard = ({ onSubmit, initialValues = null }) => {
  // Step management
  const [step, setStep] = useState(1);

  // Step 1: Basics
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [hackDuration, setHackDuration] = useState(""); // 8 | 12 | 24
  const editorRef = useRef(null);
  const isTypingRef = useRef(false);
  const selectionRef = useRef(null);
  const [description, setDescription] = useState(""); // html string

  // Step 2: Date & Time
  const [eventDate, setEventDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [regDeadline, setRegDeadline] = useState(null);
  const [startDateTime24, setStartDateTime24] = useState(null);
  const [endDateTime24, setEndDateTime24] = useState(null);
  const [endWasAuto, setEndWasAuto] = useState(false);

  // Step 3: Location & Media
  const [mode, setMode] = useState("Offline"); // Online | Offline
  const [venue, setVenue] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [minTeamSize, setMinTeamSize] = useState("");
  const [maxTeamSize, setMaxTeamSize] = useState("");
  const [prizePool, setPrizePool] = useState("");

  // Step 4: Organizer & Confirmation
  const [organizerName, setOrganizerName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [organizerWebsite, setOrganizerWebsite] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (bannerFile) {
      const url = URL.createObjectURL(bannerFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl("");
    }
  }, [bannerFile]);

  // Prefill from initialValues when provided (Edit mode)
  useEffect(() => {
    if (!initialValues) return;
    try {
      setTitle(initialValues.title || "");
      setCategory(initialValues.category || initialValues.eventType || "");
      setDescription(initialValues.description || "");
      // Mode and location
      const initMode = initialValues.eventMode || initialValues.mode;
      if (initMode === 'Online' || initMode === 'Offline') setMode(initMode);
      if ((initMode || '').toLowerCase() === 'online') setMeetingLink(initialValues.location || "");
      else setVenue(initialValues.location || "");
      // Dates
      if (initialValues.date) {
        const d = new Date(initialValues.date);
        if (!Number.isNaN(d.getTime())) {
          setEventDate(d);
          setStartTime(d);
        }
      }
      if (initialValues.endDate) {
        const ed = new Date(initialValues.endDate);
        if (!Number.isNaN(ed.getTime())) setEndTime(ed);
      }
      if (initialValues.registrationDeadline) {
        const rd = new Date(initialValues.registrationDeadline);
        if (!Number.isNaN(rd.getTime())) setRegDeadline(rd);
      }
      // Hackathon specifics
      if ((initialValues.category || initialValues.eventType) === 'Hackathon') {
        const dur = String(initialValues.hackathonDuration || "");
        if (['8','12','24'].includes(dur)) setHackDuration(dur);
        if (dur === '24') {
          if (initialValues.date) setStartDateTime24(new Date(initialValues.date));
          if (initialValues.endDate) setEndDateTime24(new Date(initialValues.endDate));
        }
      }
      // Team size and prize
      if (typeof initialValues.minTeamSize === 'number') setMinTeamSize(String(initialValues.minTeamSize));
      if (typeof initialValues.teamSize === 'number') setMaxTeamSize(String(initialValues.teamSize));
      if (initialValues.prizePool) setPrizePool(initialValues.prizePool);
      // Organizer
      if (initialValues.organizerName) setOrganizerName(initialValues.organizerName);
      if (initialValues.contactEmail) setContactEmail(initialValues.contactEmail);
      if (initialValues.organizerWebsite || initialValues.website) setOrganizerWebsite(initialValues.organizerWebsite || initialValues.website);
    } catch {
      // ignore prefill errors
    }
  }, [initialValues]);

  const htmlToText = (html) => (html || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

  // Aggregate event datetime from date and times (optional for backend)
  const dateTimeISO = useMemo(() => {
    if (category === 'Hackathon' && hackDuration === '24') {
      return startDateTime24 ? new Date(startDateTime24).toISOString() : null;
    }
    if (!eventDate) return null;
    const date = new Date(eventDate);
    if (startTime instanceof Date) {
      date.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
    }
    return date.toISOString();
  }, [category, hackDuration, eventDate, startTime, startDateTime24]);

  // Auto-calc end time for 8/12 hr hackathons
  useEffect(() => {
    if (category !== 'Hackathon') return;
    if (!startTime || !eventDate) return;
    if (hackDuration !== '8' && hackDuration !== '12') return;
    const hours = Number(hackDuration);
    const end = new Date(startTime);
    end.setHours(end.getHours() + hours);
    if (!endTime || endWasAuto) {
      setEndTime(end);
      setEndWasAuto(true);
    }
  }, [category, hackDuration, startTime, eventDate]);

  const canNext = () => {
    if (step === 1) {
      const basic = title.trim() && htmlToText(description);
      if (category === 'Hackathon') return basic && ['8','12','24'].includes(hackDuration);
      return basic;
    }
    if (step === 2) {
      if (category === 'Hackathon' && hackDuration === '24') {
        return !!startDateTime24 && !!endDateTime24 && new Date(endDateTime24) > new Date(startDateTime24);
      }
      return !!eventDate && !!startTime; // end optional (auto for 8/12)
    }
    if (step === 3) {
      const locOk = mode === 'Online' ? !!meetingLink.trim() : !!venue.trim();
      const minOk = minTeamSize === '' || (!isNaN(Number(minTeamSize)) && Number(minTeamSize) >= 1);
      const maxOk = maxTeamSize === '' || (!isNaN(Number(maxTeamSize)) && Number(maxTeamSize) >= 1);
      return locOk && minOk && maxOk;
    }
    if (step === 4) return organizerName.trim() && /.+@.+\..+/.test(contactEmail);
    return false;
  };

  const next = () => setStep((s) => Math.min(4, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  // Formatting helpers for description editor
  const restoreSelection = () => {
    try {
      const sel = window.getSelection();
      if (selectionRef.current && sel) {
        sel.removeAllRanges();
        sel.addRange(selectionRef.current);
      }
    } catch {}
  };

  const saveSelection = () => {
    try {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      // Only save if selection is inside the editor
      if (editorRef.current && editorRef.current.contains(range.startContainer)) {
        selectionRef.current = range.cloneRange();
      }
    } catch {}
  };

  const ensureSelectionInEditor = () => {
    try {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) {
        placeCaretEnd(editorRef.current);
        saveSelection();
        return;
      }
      const range = sel.getRangeAt(0);
      if (!editorRef.current || !editorRef.current.contains(range.startContainer)) {
        placeCaretEnd(editorRef.current);
        saveSelection();
      }
    } catch {}
  };

  const exec = (cmd, value = null) => {
    try {
      if (editorRef.current) editorRef.current.focus();
      ensureSelectionInEditor();
      restoreSelection();
      document.execCommand(cmd, false, value);
      if (editorRef.current) editorRef.current.focus();
    } catch {}
  };
  const makeLink = () => {
    const url = window.prompt('Enter URL');
    if (url) exec('createLink', url);
  };
  const clearFormat = () => {
    if (!editorRef.current) return;
    // Replace content with plain text, preserving line breaks
    const rawText = editorRef.current.innerText.replace(/\r/g, '');
    const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const html = rawText.split('\n').map(escape).join('<br>');
    isTypingRef.current = true;
    setDescription(html);
    Promise.resolve().then(() => {
      isTypingRef.current = false;
      if (editorRef.current) {
        editorRef.current.innerHTML = html;
        placeCaretEnd(editorRef.current);
        saveSelection();
      }
    });
  };
  const handlePaste = (e) => {
    // paste as plain text for consistent formatting
    const data = (e.clipboardData || window.clipboardData);
    if (!data) return;
    e.preventDefault();
    const text = data.getData('text');
    document.execCommand('insertText', false, text);
  };

  // Ensure caret placement when focusing the editor
  const placeCaretEnd = (el) => {
    try {
      if (!el) return;
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      selectionRef.current = range;
    } catch {}
  };

  // Keep DOM in sync with description when changes are external (not from typing)
  useEffect(() => {
    if (!editorRef.current) return;
    if (isTypingRef.current) return; // don't clobber caret during user input
    if ((description || '') !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = description || '';
    }
  }, [description]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canNext()) return;
    try {
      setSubmitting(true);
      setError("");
      const form = new FormData();
      form.append("title", title);
      form.append("description", description || "");
      if (dateTimeISO) form.append("date", dateTimeISO);
      if (category === 'Hackathon') {
        form.append("eventType", 'Hackathon');
        if (hackDuration) form.append("hackathonDuration", hackDuration);
        if (hackDuration === '24' && endDateTime24) {
          form.append("endDate", new Date(endDateTime24).toISOString());
        } else if (endTime && eventDate) {
          const et = new Date(eventDate);
          et.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);
          form.append("endDate", et.toISOString());
        }
      }
      if (regDeadline) form.append("registrationDeadline", new Date(regDeadline).toISOString());
      form.append("location", mode === 'Online' ? meetingLink : venue);
      if (category) form.append("category", category);
      if (bannerFile) form.append("banner", bannerFile);
      if (organizerName) form.append("organizerName", organizerName);
      if (contactEmail) form.append("contactEmail", contactEmail);
      if (organizerWebsite) form.append("organizerWebsite", organizerWebsite);
      form.append("eventMode", mode);
      if (minTeamSize !== '') form.append("minTeamSize", Number(minTeamSize));
      if (maxTeamSize !== '') form.append("teamSize", Number(maxTeamSize));
      if (prizePool !== '' && !Number.isNaN(Number(prizePool))) {
        form.append("prizePool", Number(prizePool));
      }
      await onSubmit(form);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 md:p-8 space-y-6">
      {error && (
        <div className="text-red-400 text-sm rounded-md bg-red-900/30 px-3 py-2 border border-red-800/50">{error}</div>
      )}

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
        <span className={`inline-flex items-center gap-1 ${step===1?'text-white':'text-slate-400'}`}><FileText className="h-3 w-3"/> Basics</span>
        <span>•</span>
        <span className={`${step===2?'text-white':'text-slate-400'}`}><CalendarIcon className="inline h-3 w-3"/> Schedule</span>
        <span>•</span>
        <span className={`${step===3?'text-white':'text-slate-400'}`}><ImageIcon className="inline h-3 w-3"/> Location & Media</span>
        <span>•</span>
        <span className={`${step===4?'text-white':'text-slate-400'}`}><CheckCircle2 className="inline h-3 w-3"/> Organizer</span>
      </div>

      {/* Steps */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Event name</label>
            <input className="input-field" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="e.g., Nexus 2025" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Event description</label>
            <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900/40">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 bg-slate-900/30 text-xs">
                <button type="button" className="px-2 py-1 rounded hover:bg-white/5" onMouseDown={(e)=>{e.preventDefault(); saveSelection(); exec('bold');}}>B</button>
                <button type="button" className="px-2 py-1 rounded hover:bg-white/5 italic" onMouseDown={(e)=>{e.preventDefault(); saveSelection(); exec('italic');}}>I</button>
                <button type="button" className="px-2 py-1 rounded hover:bg-white/5 underline" onMouseDown={(e)=>{e.preventDefault(); saveSelection(); exec('underline');}}>U</button>
                <span className="mx-1 opacity-50">|</span>
                <button type="button" className="px-2 py-1 rounded hover:bg-white/5" onMouseDown={(e)=>{e.preventDefault(); saveSelection(); exec('insertUnorderedList');}}>• List</button>
                <button type="button" className="px-2 py-1 rounded hover:bg-white/5" onMouseDown={(e)=>{e.preventDefault(); saveSelection(); exec('insertOrderedList');}}>1. List</button>
                <span className="mx-1 opacity-50">|</span>
                <button type="button" className="px-2 py-1 rounded hover:bg-white/5" onMouseDown={(e)=>{e.preventDefault(); saveSelection(); makeLink();}}>Link</button>
                <button type="button" className="px-2 py-1 rounded hover:bg-white/5" onMouseDown={(e)=>{e.preventDefault(); saveSelection(); clearFormat();}}>Clear</button>
              </div>
              <div
                ref={editorRef}
                id="description"
                contentEditable
                suppressContentEditableWarning
                onInput={(e)=> { isTypingRef.current = true; setDescription(e.currentTarget.innerHTML); Promise.resolve().then(()=>{ isTypingRef.current = false; saveSelection(); }); }}
                onPaste={handlePaste}
                onFocus={() => placeCaretEnd(editorRef.current)}
                onKeyUp={saveSelection}
                onMouseUp={saveSelection}
                className="min-h-[140px] px-4 py-3 text-white outline-none"
                style={{ whiteSpace: 'pre-wrap' }}
                data-placeholder="What is your event about?"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Event category/type</label>
            <select className="input-field" value={category} onChange={(e)=>setCategory(e.target.value)}>
              <option value="">Select type</option>
              <option value="Competition">Competition</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Workshop">Workshop</option>
              <option value="Seminar">Seminar</option>
              <option value="Meetup">Meetup</option>
              <option value="Cultural">Cultural</option>
              <option value="General">General</option>
            </select>
          </div>
          {category === 'Hackathon' && (
            <div>
              <label className="block text-sm font-medium mb-2">Hackathon duration</label>
              <div className="flex gap-3">
                {['8','12','24'].map((h) => (
                  <button key={h} type="button" onClick={() => setHackDuration(h)} className={`px-3 py-1.5 rounded-lg border ${hackDuration===h?'bg-white/10 border-white/20':'bg-transparent border-white/10'}`}>
                    {h} hours
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          {!(category === 'Hackathon') && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-2">Event date</label>
                <DatePicker selected={eventDate} onChange={setEventDate} className="input-field" placeholderText="Select date" dateFormat="MMM d, yyyy" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Start time</label>
                <DatePicker selected={startTime} onChange={setStartTime} showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time" dateFormat="h:mm aa" className="input-field" placeholderText="Select" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End time</label>
                <DatePicker selected={endTime} onChange={(d)=>{ setEndTime(d); setEndWasAuto(false); }} showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time" dateFormat="h:mm aa" className="input-field" placeholderText="Select" />
              </div>
            </div>
          )}
          {category === 'Hackathon' && hackDuration !== '24' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-2">Event date</label>
                <DatePicker selected={eventDate} onChange={setEventDate} className="input-field" placeholderText="Select date" dateFormat="MMM d, yyyy" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Start time</label>
                <DatePicker selected={startTime} onChange={setStartTime} showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time" dateFormat="h:mm aa" className="input-field" placeholderText="Select" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End time {hackDuration ? `(auto ${hackDuration}h from start, editable)` : ''}</label>
                <DatePicker selected={endTime} onChange={(d)=>{ setEndTime(d); setEndWasAuto(false); }} showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time" dateFormat="h:mm aa" className="input-field" placeholderText="Select" />
              </div>
            </div>
          )}
          {category === 'Hackathon' && hackDuration === '24' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Start date & time</label>
                <DatePicker selected={startDateTime24} onChange={setStartDateTime24} showTimeSelect timeIntervals={15} dateFormat="MMM d, yyyy h:mm aa" placeholderText="Select" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End date & time</label>
                <DatePicker selected={endDateTime24} onChange={setEndDateTime24} showTimeSelect timeIntervals={15} dateFormat="MMM d, yyyy h:mm aa" placeholderText="Select" className="input-field" />
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-2">Registration deadline</label>
            <DatePicker selected={regDeadline} onChange={setRegDeadline} showTimeSelect timeIntervals={15} dateFormat="MMM d, yyyy h:mm aa" placeholderText="Optional" className="input-field" isClearable />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Min team size</label>
              <input type="number" min="1" className="input-field" value={minTeamSize} onChange={(e)=> setMinTeamSize(e.target.value)} placeholder="e.g., 1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max team size</label>
              <input type="number" min="1" className="input-field" value={maxTeamSize} onChange={(e)=> setMaxTeamSize(e.target.value)} placeholder="e.g., 4" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Prize pool amount</label>
              <input type="number" min="0" className="input-field" value={prizePool} onChange={(e)=> setPrizePool(e.target.value.replace(/[^0-9]/g, ''))} placeholder="e.g., 50000" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Event type</label>
              <div className="flex gap-3">
                <button type="button" className={`px-3 py-1.5 rounded-lg border ${mode==='Offline'?'bg-white/10 border-white/20':'bg-transparent border-white/10'}`} onClick={()=>setMode('Offline')}>Offline</button>
                <button type="button" className={`px-3 py-1.5 rounded-lg border ${mode==='Online'?'bg-white/10 border-white/20':'bg-transparent border-white/10'}`} onClick={()=>setMode('Online')}>Online</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{mode==='Online' ? 'Meeting link' : 'Venue address'}</label>
              <input className="input-field" value={mode==='Online'?meetingLink:venue} onChange={(e)=> (mode==='Online'? setMeetingLink(e.target.value): setVenue(e.target.value))} placeholder={mode==='Online'?'https://...':'e.g., Main Auditorium'} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Event banner</label>
              <input type="file" accept="image/*" onChange={(e)=> setBannerFile(e.target.files?.[0] || null)} className="mt-1 block w-full file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-900/60 file:text-slate-200 hover:file:bg-slate-800/70" />
            </div>
            <div>
              {(previewUrl || initialValues?.bannerUrl) && (
                <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900 aspect-[16/9]">
                  <img src={previewUrl || initialValues?.bannerUrl} alt="Banner preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Organizer name</label>
              <input className="input-field" value={organizerName} onChange={(e)=> setOrganizerName(e.target.value)} placeholder="e.g., Tech Club" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contact email</label>
              <input className="input-field" type="email" value={contactEmail} onChange={(e)=> setContactEmail(e.target.value)} placeholder="name@example.com" />
            </div>
          </div>

          {(category === 'Competition' || category === 'Hackathon') && (
            <div>
              <label className="block text-sm font-medium mb-2">Organizer website</label>
              <input
                className="input-field"
                type="url"
                value={organizerWebsite}
                onChange={(e)=> setOrganizerWebsite(e.target.value)}
                placeholder="https://your-organization.com"
              />
              <p className="text-xs text-slate-400 mt-1">Optional, shown to participants for more info.</p>
            </div>
          )}

          {/* Review */}
          <div className="rounded-xl border border-white/10 p-4 bg-slate-900/40">
            <div className="text-sm text-slate-300">
              <div className="font-semibold mb-2">Review</div>
              <div><span className="text-slate-400">Title:</span> {title}</div>
              <div><span className="text-slate-400">Type:</span> {category || '—'} {category==='Hackathon' && hackDuration ? `(${hackDuration}h)` : ''}</div>
              <div><span className="text-slate-400">Schedule:</span> {category==='Hackathon' && hackDuration==='24' ? (startDateTime24 ? new Date(startDateTime24).toLocaleString() : '—') + ' → ' + (endDateTime24 ? new Date(endDateTime24).toLocaleString() : '—') : (eventDate ? eventDate.toDateString() : '—')}</div>
              <div><span className="text-slate-400">Reg. deadline:</span> {regDeadline ? new Date(regDeadline).toLocaleString() : '—'}</div>
              <div><span className="text-slate-400">Location:</span> {mode==='Online'? meetingLink : venue}</div>
              <div><span className="text-slate-400">Team size:</span> {minTeamSize || '—'}{(minTeamSize||maxTeamSize) && ' to '} {maxTeamSize || '—'}</div>
              <div><span className="text-slate-400">Prize pool:</span> {prizePool !== '' ? Number(prizePool).toLocaleString() : '—'}</div>
              {(category === 'Competition' || category === 'Hackathon') && (
                <div><span className="text-slate-400">Organizer website:</span> {organizerWebsite || '—'}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button type="button" onClick={prev} disabled={step===1} className="px-4 py-2 rounded-lg bg-white/5 text-slate-200 disabled:opacity-50 flex items-center gap-2">
          <ArrowLeft className="h-4 w-4"/> Back
        </button>
        {step < 4 ? (
          <button type="button" onClick={next} disabled={!canNext()} className="btn-primary disabled:opacity-60 flex items-center gap-2">
            Next <ArrowRight className="h-4 w-4"/>
          </button>
        ) : (
          <button type="submit" disabled={!canNext() || submitting} className="btn-primary disabled:opacity-60 flex items-center gap-2">
            {submitting ? 'Submitting...' : 'Submit event'}
          </button>
        )}
      </div>
    </form>
  );
};

export default EventCreateWizard;
