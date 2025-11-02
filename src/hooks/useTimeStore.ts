import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TimeEntry } from '../types';
import { format, parseISO, isSameDay, compareAsc } from 'date-fns';

interface TimeState {
  entries: TimeEntry[];
  currentDate: Date;
  theme: 'light' | 'dark';
  isAddEditModalOpen: boolean;
  isExportModalOpen: boolean;
  editingEntry: TimeEntry | null;
  entriesForCurrentDate: TimeEntry[];
  
  setCurrentDate: (date: Date) => void;
  toggleTheme: () => void;
  
  openAddModal: () => void;
  openEditModal: (entry: TimeEntry) => void;
  closeAddEditModal: () => void;
  
  openExportModal: () => void;
  closeExportModal: () => void;
  
  addEntry: (entry: Omit<TimeEntry, 'id' | 'createdAt'>) => void;
  updateEntry: (entry: TimeEntry) => void;
  deleteEntry: (id: string) => void;
}

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'light';
};

const seedData: TimeEntry[] = [
  {
    id: '1',
    date: '2025-11-02',
    startTime: '00:00',
    endTime: '06:00',
    title: 'Sleeping',
    notes: 'Deep sleep cycle.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    date: '2025-11-02',
    startTime: '06:00',
    endTime: '09:00',
    title: 'Morning routine & prepare for school',
    notes: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    date: '2025-11-02',
    startTime: '09:00',
    endTime: '16:00',
    title: 'School',
    notes: 'Classes and study sessions.',
    createdAt: new Date().toISOString(),
  },
];

const filterAndSortEntries = (entries: TimeEntry[], date: Date): TimeEntry[] => {
  return entries
    .filter(entry => isSameDay(parseISO(entry.date), date))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
};

export const useTimeStore = create<TimeState>()(
  persist(
    (set, get) => ({
      entries: seedData,
      currentDate: new Date('2025-11-02T12:00:00'), // Set to a specific date for demo
      theme: getInitialTheme(),
      isAddEditModalOpen: false,
      isExportModalOpen: false,
      editingEntry: null,
      entriesForCurrentDate: filterAndSortEntries(seedData, new Date('2025-11-02T12:00:00')),

      setCurrentDate: (date) => set(state => ({
        currentDate: date,
        entriesForCurrentDate: filterAndSortEntries(state.entries, date),
      })),
      
      toggleTheme: () => set(state => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      openAddModal: () => set({ isAddEditModalOpen: true, editingEntry: null }),
      openEditModal: (entry) => set({ isAddEditModalOpen: true, editingEntry: entry }),
      closeAddEditModal: () => set({ isAddEditModalOpen: false, editingEntry: null }),

      openExportModal: () => set({ isExportModalOpen: true }),
      closeExportModal: () => set({ isExportModalOpen: false }),

      addEntry: (newEntryData) => {
        const newEntry: TimeEntry = {
          ...newEntryData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set(state => {
          const updatedEntries = [...state.entries, newEntry];
          return {
            entries: updatedEntries,
            entriesForCurrentDate: filterAndSortEntries(updatedEntries, state.currentDate),
          };
        });
      },

      updateEntry: (updatedEntry) => {
        set(state => {
          const updatedEntries = state.entries.map(entry =>
            entry.id === updatedEntry.id ? updatedEntry : entry
          );
          return {
            entries: updatedEntries,
            entriesForCurrentDate: filterAndSortEntries(updatedEntries, state.currentDate),
          };
        });
      },

      deleteEntry: (id) => {
        set(state => {
          const updatedEntries = state.entries.filter(entry => entry.id !== id);
          return {
            entries: updatedEntries,
            entriesForCurrentDate: filterAndSortEntries(updatedEntries, state.currentDate),
          };
        });
      },
    }),
    {
      name: 'time-tracker-storage',
      storage: createJSONStorage(() => localStorage),
      // Custom serialize/deserialize to handle Date objects
      serialize: (state) => JSON.stringify({
        ...state,
        state: {
          ...state.state,
          currentDate: state.state.currentDate.toISOString(),
        }
      }),
      deserialize: (str) => {
        const state = JSON.parse(str);
        state.state.currentDate = new Date(state.state.currentDate);
        // Recalculate entries for the current date on hydration
        state.state.entriesForCurrentDate = filterAndSortEntries(state.state.entries, state.state.currentDate);
        return state;
      },
    }
  )
);
