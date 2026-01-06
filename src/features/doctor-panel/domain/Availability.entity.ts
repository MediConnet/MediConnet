export interface Availability {
  id: string;
  date: string; // ISO date string
  startTime: string; // 'HH:mm'
  endTime?: string; // 'HH:mm'
  isAvailable: boolean;
}

