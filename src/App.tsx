import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { TimeBlockList } from './components/TimeBlockList';
import { DaySummary } from './components/DaySummary';
import { AddEditEntryModal } from './components/AddEditEntryModal';
import { ExportModal } from './components/ExportModal';
import { useTimeStore } from './hooks/useTimeStore';
import { AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

function App() {
  const {
    theme,
    isAddEditModalOpen,
    isExportModalOpen,
    openAddModal,
  } = useTimeStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto max-w-4xl p-4 sm:p-6 md:p-8">
        <div className="animate-fade-in">
          <DaySummary />
          <TimeBlockList />
        </div>
      </main>
      <AnimatePresence>
        {isAddEditModalOpen && <AddEditEntryModal />}
        {isExportModalOpen && <ExportModal />}
      </AnimatePresence>
      <button
        onClick={() => openAddModal()}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-primary hover:bg-primary-light text-white rounded-full p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out z-40"
        aria-label="Add new time entry"
      >
        <Plus size={28} />
      </button>
    </div>
  );
}

export default App;
