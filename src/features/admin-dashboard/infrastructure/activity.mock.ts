import type { ActivityHistory } from "../domain/activity-history.entity";

// Función para obtener fecha y hora relativa
const getRecentDateTime = (hoursAgo: number) => {
  const now = new Date();
  now.setHours(now.getHours() - hoursAgo);
  const day = now.getDate();
  const month = now.toLocaleDateString("es-ES", { month: "long" });
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${day} de ${month} de ${year} a las ${hours}:${minutes}`;
};

export const MOCK_ACTIVITY_HISTORY: ActivityHistory[] = [
  {
    id: "1",
    title: "Nueva solicitud de registro: Dra. María González",
    actor: "Sistema",
    date: getRecentDateTime(2),
    type: "REGISTRATION",
  },
  {
    id: "2",
    title: "Servicio aprobado: Dr. Roberto Sánchez",
    actor: "Admin General",
    date: getRecentDateTime(5),
    type: "APPROVAL",
  },
  {
    id: "3",
    title: "Nueva solicitud de registro: Farmacia del Pueblo",
    actor: "Sistema",
    date: getRecentDateTime(8),
    type: "REGISTRATION",
  },
  {
    id: "4",
    title: "Nuevo anuncio creado: Chequeo Cardiológico Completo",
    actor: "Dr. Carlos Mendoza",
    date: getRecentDateTime(12),
    type: "ANNOUNCEMENT",
  },
  {
    id: "5",
    title: "Solicitud rechazada: Insumos Médicos Plus (documentos incompletos)",
    actor: "Admin General",
    date: getRecentDateTime(18),
    type: "REJECTION",
  },
  {
    id: "6",
    title: "Perfil actualizado: Farmacia San José",
    actor: "Farmacia San José",
    date: getRecentDateTime(24),
    type: "UPDATE",
  },
  {
    id: "7",
    title: "Servicio aprobado: Ambulancias Rápidas",
    actor: "Admin Secundario",
    date: getRecentDateTime(30),
    type: "APPROVAL",
  },
  {
    id: "8",
    title: "Nueva solicitud de registro: Laboratorio Diagnóstico",
    actor: "Sistema",
    date: getRecentDateTime(36),
    type: "REGISTRATION",
  },
  {
    id: "9",
    title: "Anuncio aprobado: Descuento 20% en Medicamentos",
    actor: "Admin General",
    date: getRecentDateTime(42),
    type: "APPROVAL",
  },
  {
    id: "10",
    title: "Servicio suspendido: Dr. Juan Pérez (violación de términos)",
    actor: "Admin General",
    date: getRecentDateTime(48),
    type: "REJECTION",
  },
  {
    id: "11",
    title: "Nueva solicitud de anuncio: Promoción de Verano",
    actor: "Farmacia Fybeca",
    date: getRecentDateTime(54),
    type: "ANNOUNCEMENT",
  },
  {
    id: "12",
    title: "Servicio aprobado: Laboratorio Clínico Vital",
    actor: "Admin Secundario",
    date: getRecentDateTime(60),
    type: "APPROVAL",
  },
  {
    id: "13",
    title: "Perfil actualizado: Dr. Ana Martínez",
    actor: "Dr. Ana Martínez",
    date: getRecentDateTime(72),
    type: "UPDATE",
  },
  {
    id: "14",
    title: "Nueva solicitud de registro: Insumos Médicos ABC",
    actor: "Sistema",
    date: getRecentDateTime(80),
    type: "REGISTRATION",
  },
  {
    id: "15",
    title: "Anuncio creado: Servicio de Ambulancia 24/7",
    actor: "Ambulancias Vida",
    date: getRecentDateTime(90),
    type: "ANNOUNCEMENT",
  },
];

export const getActivityHistoryMock = (): Promise<ActivityHistory[]> => {
  return Promise.resolve(MOCK_ACTIVITY_HISTORY);
};