/**
 * Entidad Availability
 */
export interface Availability {
  id: string;
  doctorId: string;
  date: Date;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  duration: number; // minutos
}





