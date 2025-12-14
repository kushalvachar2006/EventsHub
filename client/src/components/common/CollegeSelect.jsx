import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { COLLEGE_LIST } from '../../data/colleges.js';
import CollegeLogo from './CollegeLogo.jsx';
import { Search, ChevronDown } from "lucide-react";

const CollegeSelect = ({ selected, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const dropdownContentRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInTrigger = dropdownRef.current?.contains(event.target);
      const clickedInDropdown = dropdownContentRef.current?.contains(event.target);
      if (!clickedInTrigger && !clickedInDropdown) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredColleges = useMemo(() => {
    if (filter === '') return COLLEGE_LIST;
    return COLLEGE_LIST.filter((college) =>
      college.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter]);

  const updateDropdownPosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const maxHeight = 320;
    const gap = 8;
    setDropdownStyle({
      position: 'fixed',
      top: rect.bottom + gap,
      left: rect.left,
      width: rect.width,
      zIndex: 1000,
      maxHeight,
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    updateDropdownPosition();

    const handle = () => updateDropdownPosition();
    window.addEventListener('resize', handle);
    window.addEventListener('scroll', handle, true);
    return () => {
      window.removeEventListener('resize', handle);
      window.removeEventListener('scroll', handle, true);
    };
  }, [isOpen]);

  const handleSelect = (college) => {
    onChange(college);
    setIsOpen(false);
    setFilter('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* <label className="block text-sm font-semibold text-slate-300 mb-2">
        Select your college
      </label> */}

      {/* Trigger Button */}
      <button
        type="button"
        ref={triggerRef}
        disabled={disabled}
        className="relative w-full input-field text-left pr-10 disabled:opacity-1 disabled:cursor-not-allowed"
        onClick={() => {
          if (disabled) return;
          setIsOpen((v) => {
            const next = !v;
            if (next) {
              requestAnimationFrame(() => updateDropdownPosition());
            }
            return next;
          });
        }}
      >
        {selected ? (
          <span className="flex items-center gap-3 min-w-0">
            <CollegeLogo src={selected.logoUrl} />
            <span className="block truncate font-medium text-white min-w-0">
              {selected.name}
            </span>
          </span>
        ) : (
          <span className="text-slate-400 font-medium">Select your college...</span>
        )}

        {/* Dropdown Icon */}
        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDown
            className={`h-5 w-5 text-slate-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </span>
      </button>

      {/* Dropdown List */}
      {isOpen && dropdownStyle &&
        createPortal(
          <div
            ref={dropdownContentRef}
            style={{
              position: dropdownStyle.position,
              top: dropdownStyle.top,
              left: dropdownStyle.left,
              width: dropdownStyle.width,
              zIndex: dropdownStyle.zIndex,
            }}
            className="rounded-xl glass-panel border border-white/10 shadow-2xl overflow-hidden animate-fade-in"
          >
            {/* Search Box */}
            <div className="p-3 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 bg-slate-900/40 border border-white/10 rounded-lg focus:border-brand-cyan/60 focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 transition-colors text-white placeholder-slate-400"
                  placeholder="Search colleges..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            {/* Scrollable List */}
            <ul className="max-h-80 overflow-auto py-2">
              {filteredColleges.length > 0 ? (
                filteredColleges.map((college) => (
                  <li
                    key={college.id}
                    className="px-4 py-3 hover:bg-white/5 cursor-pointer transition-all duration-150"
                    onClick={() => handleSelect(college)}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <CollegeLogo src={college.logoUrl} />
                      <span className="block truncate font-medium text-slate-200 min-w-0">
                        {college.name}
                      </span>
                    </span>
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-slate-400 text-center">
                  No colleges found.
                </li>
              )}
            </ul>
          </div>,
          document.body
        )}
    </div>
  );
};

export default CollegeSelect;
