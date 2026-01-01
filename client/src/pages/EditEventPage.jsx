import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import EventCreateWizard from '../components/events/EventCreateWizard.jsx';
import { eventsAPI } from '../services/api';
import { useToast } from '../context/ToastContext.jsx';

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { show } = useToast();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await eventsAPI.getEvent(id);
        setInitialValues(data);
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      await eventsAPI.updateEvent(id, formData);
      show('Event updated successfully', 'success');
      navigate('/my-events');
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to update event';
      show(msg, 'error');
      throw e; // allow EventForm to show inline error
    }
  };

  if (loading) return <PageLayout title="Edit Event"><div>Loading...</div></PageLayout>;
  if (error) return <PageLayout title="Edit Event"><div className="text-red-600">{error}</div></PageLayout>;

  return (
    <PageLayout title="Edit Event">
      <EventCreateWizard initialValues={initialValues} onSubmit={handleUpdate} />
    </PageLayout>
  );
};

export default EditEventPage;
