import type { Patient } from "../domain/Patient.entity";
// IMPORTANTE: Eliminamos imports de appointments.mock.ts porque ese archivo ya no existe

// Función para obtener fechas pasadas recientes
const getPastDate = (daysAgo: number) => {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - daysAgo);
  return pastDate.toISOString().split("T")[0];
};

// Generador de datos autónomo (Hardcoded para no depender de citas externas)
const getAdditionalPatientsMock = (): Patient[] => {
  return [
    {
      id: "maria-garcia",
      name: "María García",
      phone: "+593 99 123 4567",
      email: "maria.garcia@email.com",
      profilePicture: "https://i.pravatar.cc/150?u=maria",
      appointments: [
        {
          id: "apt-1",
          date: getPastDate(5),
          time: "10:00",
          reason: "Consulta de seguimiento post-operatorio",
          status: "COMPLETED",
          paymentMethod: "CARD",
          amount: 50,
        },
        {
          id: "apt-2",
          date: getPastDate(30),
          time: "14:00",
          reason: "Control de presión arterial",
          status: "COMPLETED",
          paymentMethod: "CASH",
          amount: 45,
        }
      ],
    },
    {
      id: "juan-lopez",
      name: "Juan López",
      phone: "+593 99 234 5678",
      email: "juan.lopez@email.com",
      profilePicture: "https://i.pravatar.cc/150?u=juan",
      appointments: [
        {
          id: "apt-4",
          date: getPastDate(3),
          time: "11:00",
          reason: "Primera consulta médica general",
          status: "COMPLETED",
          paymentMethod: "CASH",
          amount: 45,
        }
      ],
    },
    {
      id: "ana-martinez",
      name: "Ana Martínez",
      phone: "+593 99 345 6789",
      email: "ana.martinez@email.com",
      appointments: [
        {
          id: "apt-6",
          date: getPastDate(7),
          time: "09:00",
          reason: "Control de presión arterial",
          status: "COMPLETED",
          paymentMethod: "CARD",
          amount: 40,
        },
        {
          id: "apt-8",
          date: getPastDate(90),
          time: "16:00",
          reason: "Chequeo anual",
          status: "COMPLETED",
          paymentMethod: "CARD",
          amount: 60,
        },
      ],
    },
    {
      id: "carlos-rodriguez",
      name: "Carlos Rodríguez",
      phone: "+593 99 456 7890",
      email: "carlos.rodriguez@email.com",
      appointments: [
        {
          id: "apt-9",
          date: getPastDate(2),
          time: "11:00",
          reason: "Revisión de resultados",
          status: "COMPLETED",
          paymentMethod: "CARD",
          amount: 55,
        }
      ],
    },
    {
      id: "diego-morales",
      name: "Diego Morales",
      phone: "+593 98 123 4567",
      email: "diego.morales@email.com",
      appointments: [
        {
          id: "apt-26",
          date: getPastDate(12),
          time: "13:00",
          reason: "Consulta por alergias",
          status: "COMPLETED",
          paymentMethod: "CASH",
          amount: 45,
        }
      ],
    }
  ];
};

export const getPatientsMock = (): Patient[] => {
  // Simplemente devolvemos la lista estática
  // En el futuro, aquí harás un fetch al endpoint /api/doctors/patients
  return getAdditionalPatientsMock();
};