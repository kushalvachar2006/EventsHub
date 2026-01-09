import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import EventFilter from '../components/events/EventFilter';
import EventCard from '../components/events/EventCard';
import { eventsAPI } from '../services/api';

const EventListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter state is managed here, initialized from URL params
  const [filters, setFilters] = useState({
    text: searchParams.get('text') || '',
    date: searchParams.get('date') || '',
    college: searchParams.get('college') || '',
  });

  // Function to update filters and URL params
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Update URL query params
    const newSearchParams = {};
    if (newFilters.text) newSearchParams.text = newFilters.text;
    if (newFilters.date) newSearchParams.date = newFilters.date;
    if (newFilters.college) newSearchParams.college = newFilters.college;
    setSearchParams(newSearchParams);
  };

  const handleClearFilters = () => {
    setFilters({ text: '', date: '', college: '' });
    setSearchParams({});
  };

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const queryParams = useMemo(() => {
    const params = {};
    if (filters.text) params.search = filters.text;
    if (filters.college) params.college = filters.college;
    return params;
  }, [filters.text, filters.college]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await eventsAPI.getAllEvents(queryParams);
        setEvents(Array.isArray(data) ? data : []);
      } catch (e) {
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [queryParams.search, queryParams.college]);

  const emptyMessage = filters.college
    ? `No events at ${filters.college}`
    : 'No events found';

  return (
    <PageLayout title="All Events">
      <EventFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />
      {loading && (
        <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-cyan"></div>
              <p className="text-slate-400 mt-4">Loading...</p>
        </div>
      )}
      {error && <div className="mt-6 text-red-600">{error}</div>}

      {!loading && !error && events.length === 0 && (
        <div className="glass-panel p-8 mt-6 text-center">
          <p className="text-white text-xl font-semibold">{emptyMessage}</p>
          <p className="text-slate-300 mt-2">
            Try clearing filters or check back later.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
        {events.map((event) => (
          <EventCard key={event._id || event.id} event={event} />
        ))}
      </div>
    </PageLayout>
  );
};

export default EventListPage;