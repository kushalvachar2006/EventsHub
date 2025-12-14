import React from 'react';
import { COLLEGE_LIST } from '../../data/colleges.js';
import CollegeSelect from '../common/CollegeSelect';

const EventFilter = ({ filters, onFilterChange, onClear }) => {
  const selectedCollege =
    COLLEGE_LIST.find((c) => c.name === filters.college) || null;

  return (
    <div className="glass-panel p-6 mb-8">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="text-white font-semibold">Filters</div>
        <button
          type="button"
          onClick={onClear}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-sm font-semibold transition-colors"
        >
          Clear Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by event name..."
          className="input-field"
          value={filters.text || ''}
          onChange={(e) => onFilterChange('text', e.target.value)}
        />
        <input
          type="date"
          className="input-field"
          value={filters.date || ''}
          onChange={(e) => onFilterChange('date', e.target.value)}
        />
        <CollegeSelect
          selected={selectedCollege}
          onChange={(college) =>
            onFilterChange('college', college ? college.name : '')
          }
        />
      </div>
    </div>
  );
};

export default EventFilter;
