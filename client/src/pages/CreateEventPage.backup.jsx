import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import EventCreateWizard from '../components/events/EventCreateWizard.jsx';
import { eventsAPI } from '../services/api';
import { useToast } from '../context/ToastContext.jsx';
import { Calendar, FileText, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { show } = useToast();

  const handleCreate = async (formData) => {
    try {
      await eventsAPI.createEvent(formData);
      show('Event created successfully', 'success');
      navigate('/my-events');
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to create event';
      show(msg, 'error');
      throw e; // keep EventForm inline error behavior
    }
  };

  return (
    <PageLayout title="Create a New Event">
      {/* Stepper / Timeline */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-300">
            <FileText className="h-4 w-4 text-brand-cyan" />
            <span className="text-sm">Basics</span>
          </div>
          <div className="h-0.5 flex-1 bg-white/10" />
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="h-4 w-4 text-brand-cyan" />
            <span className="text-sm">Schedule</span>
          </div>
          <div className="h-0.5 flex-1 bg-white/10" />
          <div className="flex items-center gap-2 text-slate-300">
            <ImageIcon className="h-4 w-4 text-brand-cyan" />
            <span className="text-sm">Poster</span>
          </div>
          <div className="h-0.5 flex-1 bg-white/10" />
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="h-4 w-4 text-brand-cyan" />
            <span className="text-sm">Review</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-400">Tip: Choose the Event Type (Competition, Workshop, Hackathon, etc.) and format your description with the toolbar.</p>
      </div>

      <EventCreateWizard onSubmit={handleCreate} />
    </PageLayout>
  );
};

export default CreateEventPage;