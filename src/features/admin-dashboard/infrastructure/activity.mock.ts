import type { ActivityHistory } from "../domain/activity-history.entity";

export const MOCK_ACTIVITY_HISTORY: ActivityHistory[] = [
  {
    id: "1",
    title: "Nueva solicitud de registro: Dra. María González",
    actor: "Sistema",
    date: "2024-01-20 a las 14:30",
    type: "REGISTRATION",
  },
  {
    id: "2",
    title: "Servicio aprobado: Dr. Roberto Sánchez",
    actor: "Admin",
    date: "2024-01-19 a las 11:15",
    type: "APPROVAL",
  },
  {
    id: "3",
    title: "Nueva solicitud de registro: Farmacia del Pueblo",
    actor: "Sistema",
    date: "2024-01-19 a las 09:45",
    type: "REGISTRATION",
  },
  {
    id: "4",
    title: "Nuevo anuncio creado: Chequeo Cardiológico Completo",
    actor: "Dr. Carlos Mendoza",
    date: "2024-01-18 a las 16:20",
    type: "ANNOUNCEMENT",
  },
  {
    id: "5",
    title: "Solicitud rechazada: Insumos Médicos Plus (documentos incompletos)",
    actor: "Admin",
    date: "2024-01-17 a las 10:00",
    type: "REJECTION",
  },
  {
    id: "6",
    title: "Perfil actualizado: Farmacia San José",
    actor: "Farmacia San José",
    date: "2024-01-16 a las 15:30",
    type: "UPDATE",
  },
  {
    id: "7",
    title: "Servicio aprobado: Ambulancias Rápidas",
    actor: "Admin",
    date: "2024-01-15 a las 12:00",
    type: "APPROVAL",
  },
  {
    id: "8",
    title: "Nueva solicitud de registro: Laboratorio Diagnóstico",
    actor: "Sistema",
    date: "2024-01-14 a las 08:30",
    type: "REGISTRATION",
  },
];

export const getActivityHistoryMock = (): Promise<ActivityHistory[]> => {
  return Promise.resolve(MOCK_ACTIVITY_HISTORY);
};