import type { Patient } from "../domain/Patient.entity";
import { generateMockAppointments, type DoctorAppointment } from "../infrastructure/appointments.mock";

// Generar pacientes automáticamente desde las citas
export const generatePatientsFromAppointments = (appointments: DoctorAppointment[]): Patient[] => {
  const patientMap = new Map<string, Patient>();

  // Solo incluir citas que estén completadas (Atendidas)
  const completedAppointments = appointments.filter((apt) => apt.status === "completed");

  completedAppointments.forEach((apt) => {
    const patientId = apt.patientName.toLowerCase().replace(/\s+/g, "-");
    
    if (!patientMap.has(patientId)) {
      patientMap.set(patientId, {
        id: patientId,
        name: apt.patientName,
        phone: apt.patientPhone || `09${Math.floor(Math.random() * 90000000) + 10000000}`,
        email: apt.patientEmail || `${patientId}@email.com`,
        appointments: [],
      });
    }

    const patient = patientMap.get(patientId)!;
    patient.appointments.push({
      id: apt.id,
      date: apt.date,
      time: apt.time,
      reason: apt.reason,
      status: "completed",
      paymentMethod: apt.paymentMethod || (Math.random() > 0.5 ? "card" : "cash"),
      amount: apt.price,
    });
  });

  return Array.from(patientMap.values());
};

export const getPatientsMock = (): Patient[] => {
  // Intentar leer citas desde localStorage
  const savedAppointments = localStorage.getItem("doctor_appointments");
  let appointments: DoctorAppointment[];
  
  if (savedAppointments) {
    appointments = JSON.parse(savedAppointments);
  } else {
    appointments = generateMockAppointments();
  }
  
  return generatePatientsFromAppointments(appointments);
};

