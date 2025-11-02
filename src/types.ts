export interface TimeEntry {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  title: string;
  notes?: string;
  createdAt: string; // ISO String
}
