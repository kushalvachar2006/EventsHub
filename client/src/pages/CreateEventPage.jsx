import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import EventCreateWizard from '../components/events/EventCreateWizard.jsx';
import { eventsAPI } from '../services/api';
import { useToast } from '../context/ToastContext.jsx';
 

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { show } = useToast();
  
  const handleSubmit = async (form) => {
    try {
      await eventsAPI.createEvent(form);
      show('Event created successfully', 'success');
      navigate('/my-events');
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to create event';
      show(msg, 'error');
      throw e;
    }
  };

  return (
    <PageLayout title="Create a New Event">
      <EventCreateWizard onSubmit={handleSubmit} />
    </PageLayout>
  );
};

export default CreateEventPage;
