import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import EventForm from '../components/events/EventForm';
import { eventsAPI } from '../services/api';
import { useToast } from '../context/ToastContext.jsx';

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
      <EventForm onSubmit={handleCreate} submitLabel="Publish Event" />
    </PageLayout>
  );
};

export default CreateEventPage;