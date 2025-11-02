import React from 'react';
import { useTimeStore } from '../hooks/useTimeStore';
import { ChevronLeft, ChevronRight, Sun, Moon, Download, Timer } from 'lucide-react';
import { format } from 'date-fns';

export const Header: React.FC = () => {
  const {
    currentDate,
    setCurrentDate,
    theme,
    toggleTheme,
    openExportModal,
  } = useTimeStore();

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    const userTimezoneOffset = newDate.getTimezoneOffset() * 60000;
    setCurrentDate(new Date(newDate.getTime() + userTimezoneOffset));
  };

  return (
    <header className="bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark sticky top-0 z-50">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <Timer className="text-primary" size={28} />
            <h1 className="text-xl sm:text-2xl font-bold text-text-light dark:text-text-dark tracking-tight">
              TimeCraft
            </h1>
          </div>

          <div className="flex-1 flex items-center justify-center gap-2 sm:gap-4">
            <button onClick={handlePrevDay} className="p-2 rounded-full hover:bg-background-light dark:hover:bg-background-dark transition-colors" aria-label="Previous day">
              <ChevronLeft size={20} className="text-text-secondary-light dark:text-text-secondary-dark" />
            </button>
            <div className="relative">
              <input
                type="date"
                value={format(currentDate, 'yyyy-MM-dd')}
                onChange={handleDateChange}
                className="bg-transparent text-center font-semibold text-lg text-text-light dark:text-text-dark w-36 focus:outline-none"
                aria-label="Select date"
              />
            </div>
            <button onClick={handleNextDay} className="p-2 rounded-full hover:bg-background-light dark:hover:bg-background-dark transition-colors" aria-label="Next day">
              <ChevronRight size={20} className="text-text-secondary-light dark:text-text-secondary-dark" />
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={openExportModal} className="p-2 rounded-full hover:bg-background-light dark:hover:bg-background-dark transition-colors" aria-label="Export data">
              <Download size={20} className="text-text-secondary-light dark:text-text-secondary-dark" />
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-background-light dark:hover:bg-background-dark transition-colors" aria-label="Toggle theme">
              {theme === 'light' ? <Moon size={20} className="text-text-secondary-light dark:text-text-secondary-dark" /> : <Sun size={20} className="text-text-secondary-light dark:text-text-secondary-dark" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
