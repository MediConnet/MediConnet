import type { Diagnosis } from "../domain/Diagnosis.entity";

// Mock data para diagnósticos
export const getDiagnosesMock = (): Diagnosis[] => {
  const stored = localStorage.getItem("doctor_diagnoses");
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
};

export const saveDiagnosesMock = (diagnoses: Diagnosis[]) => {
  localStorage.setItem("doctor_diagnoses", JSON.stringify(diagnoses));
  // Disparar evento para notificar actualización
  window.dispatchEvent(new CustomEvent("diagnosesUpdated"));
};

export const createDiagnosisMock = (diagnosis: Omit<Diagnosis, "id" | "createdAt">): Diagnosis => {
  const newDiagnosis: Diagnosis = {
    ...diagnosis,
    id: `diag-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  const diagnoses = getDiagnosesMock();
  diagnoses.push(newDiagnosis);
  saveDiagnosesMock(diagnoses);

  return newDiagnosis;
};

export const getDiagnosesByPatientMock = (patientId: string): Diagnosis[] => {
  const diagnoses = getDiagnosesMock();
  return diagnoses.filter((d) => d.patientId === patientId);
};

export const getDiagnosesByAppointmentMock = (appointmentId: string): Diagnosis | null => {
  const diagnoses = getDiagnosesMock();
  return diagnoses.find((d) => d.appointmentId === appointmentId) || null;
};

