import React, { useState, useEffect } from 'react';
import { useTimeStore } from '../hooks/useTimeStore';
import { TimeEntry } from '../types';
import { motion } from 'framer-motion';
import { X, Save, Clock, StickyNote, Briefcase, Bed, School } from 'lucide-react';
import { isTimeOverlap, isEndTimeBeforeStartTime, parseTimeString } from '../utils/timeUtils';
import { format } from 'date-fns';

const presets = [
  { title: 'Work', icon: Briefcase },
  { title: 'Sleeping', icon: Bed },
  { title: 'School', icon: School },
];

export const AddEditEntryModal: React.FC = () => {
  const {
    closeAddEditModal,
    addEntry,
    updateEntry,
    editingEntry,
    entriesForCurrentDate,
    currentDate,
  } = useTimeStore();

  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingEntry) {
      setStartTime(editingEntry.startTime);
      setEndTime(editingEntry.endTime);
      setTitle(editingEntry.title);
      setNotes(editingEntry.notes || '');
    } else {
      // Smart default for new entry
      const lastEntry = entriesForCurrentDate[entriesForCurrentDate.length - 1];
      if (lastEntry) {
        setStartTime(lastEntry.endTime);
        const newEndTime = new Date();
        newEndTime.setHours(parseTimeString(lastEntry.endTime).getHours() + 1);
        setEndTime(format(newEndTime, 'HH:mm'));
      }
    }
  }, [editingEntry, entriesForCurrentDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isEndTimeBeforeStartTime(startTime, endTime) && startTime !== endTime) {
      setError('End time cannot be before start time.');
      return;
    }

    if (isTimeOverlap(startTime, endTime, entriesForCurrentDate, editingEntry?.id)) {
      setError('This time block overlaps with an existing entry.');
      return;
    }

    const entryData = {
      date: format(currentDate, 'yyyy-MM-dd'),
      startTime,
      endTime,
      title,
      notes,
    };

    if (editingEntry) {
      updateEntry({ ...editingEntry, ...entryData });
    } else {
      addEntry({ ...entryData, id: Date.now().toString(), createdAt: new Date().toISOString() });
    }
    closeAddEditModal();
  };

  const handlePresetClick = (presetTitle: string) => {
    setTitle(presetTitle);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl w-full max-w-md"
      >
        <div className="p-6 border-b border-border-light dark:border-border-dark flex justify-between items-center">
          <h2 className="text-xl font-bold">{editingEntry ? 'Edit Entry' : 'Add Entry'}</h2>
          <button onClick={closeAddEditModal} className="p-1 rounded-full hover:bg-background-light dark:hover:bg-background-dark">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Start Time</label>
                <input type="time" id="startTime" value={startTime} onChange={e => setStartTime(e.target.value)} required className="w-full p-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md focus:ring-2 focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">End Time</label>
                <input type="time" id="endTime" value={endTime} onChange={e => setEndTime(e.target.value)} required className="w-full p-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md focus:ring-2 focus:ring-primary focus:border-primary" />
              </div>
            </div>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Task Name</label>
              <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g., Project work" className="w-full p-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Presets:</span>
              {presets.map(preset => (
                <button key={preset.title} type="button" onClick={() => handlePresetClick(preset.title)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-full hover:bg-primary hover:text-white hover:border-primary transition-colors">
                  <preset.icon size={14} />
                  {preset.title}
                </button>
              ))}
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Notes (Optional)</label>
              <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Add any details..." className="w-full p-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md focus:ring-2 focus:ring-primary focus:border-primary"></textarea>
            </div>
            {error && <p className="text-sm text-error bg-error/10 p-3 rounded-md">{error}</p>}
          </div>
          <div className="p-6 bg-background-light dark:bg-background-dark/50 border-t border-border-light dark:border-border-dark flex justify-end gap-4 rounded-b-xl">
            <button type="button" onClick={closeAddEditModal} className="px-4 py-2 rounded-md bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark font-semibold transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary-light transition-colors flex items-center gap-2">
              <Save size={18} />
              {editingEntry ? 'Save Changes' : 'Add Entry'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
