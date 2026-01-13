export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  appointments: AppointmentHistory[];
}

export interface AppointmentHistory {
  id: string;
  date: string;
  time: string;
  reason: string;
  status: "completed" | "cancelled" | "no-show";
  paymentMethod: "card" | "cash";
  amount?: number;
}

