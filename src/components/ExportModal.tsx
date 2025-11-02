import React, { useState } from 'react';
import { useTimeStore } from '../hooks/useTimeStore';
import { motion } from 'framer-motion';
import { X, Download } from 'lucide-react';
import { format } from 'date-fns';
import { exportToTxt } from '../utils/exportUtils';

type ExportType = 'single' | 'range';

export const ExportModal: React.FC = () => {
  const { closeExportModal, currentDate, entries } = useTimeStore();
  const [exportType, setExportType] = useState<ExportType>('single');
  const [startDate, setStartDate] = useState(format(currentDate, 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(currentDate, 'yyyy-MM-dd'));

  const handleExport = () => {
    if (exportType === 'single') {
      exportToTxt(startDate, startDate, entries);
    } else {
      exportToTxt(startDate, endDate, entries);
    }
    closeExportModal();
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
          <h2 className="text-xl font-bold">Export Time Entries</h2>
          <button onClick={closeExportModal} className="p-1 rounded-full hover:bg-background-light dark:hover:bg-background-dark">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-2">Export Type</label>
            <div className="flex gap-2 rounded-lg bg-background-light dark:bg-background-dark p-1">
              <button
                onClick={() => setExportType('single')}
                className={`w-full py-2 rounded-md text-sm font-semibold transition-colors ${exportType === 'single' ? 'bg-primary text-white shadow' : 'hover:bg-surface-light dark:hover:bg-surface-dark'}`}
              >
                Single Day
              </button>
              <button
                onClick={() => setExportType('range')}
                className={`w-full py-2 rounded-md text-sm font-semibold transition-colors ${exportType === 'range' ? 'bg-primary text-white shadow' : 'hover:bg-surface-light dark:hover:bg-surface-dark'}`}
              >
                Date Range
              </button>
            </div>
          </div>

          {exportType === 'single' ? (
            <div>
              <label htmlFor="singleDate" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Date</label>
              <input type="date" id="singleDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Start Date</label>
                <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md focus:ring-2 focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">End Date</label>
                <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md focus:ring-2 focus:ring-primary focus:border-primary" />
              </div>
            </div>
          )}
        </div>
        <div className="p-6 bg-background-light dark:bg-background-dark/50 border-t border-border-light dark:border-border-dark flex justify-end gap-4 rounded-b-xl">
          <button type="button" onClick={closeExportModal} className="px-4 py-2 rounded-md bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark font-semibold transition-colors">Cancel</button>
          <button onClick={handleExport} className="px-4 py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary-light transition-colors flex items-center gap-2">
            <Download size={18} />
            Download .txt
          </button>
        </div>
      </motion.div>
    </div>
  );
};
