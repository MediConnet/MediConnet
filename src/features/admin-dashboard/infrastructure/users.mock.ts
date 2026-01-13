import type { User } from "../domain/user.entity";

export const MOCK_USERS: User[] = [
  {
    id: "admin-1",
    name: "Admin General",
    email: "admin@medicones.com",
    role: "ADMIN",
    isActive: true,
    createdAt: "2024-01-01",
  },
  {
    id: "admin-2",
    name: "Admin Secundario",
    email: "admin2@medicones.com",
    role: "ADMIN",
    isActive: true,
    createdAt: "2024-01-15",
  },
  {
    id: "doctor-1",
    name: "Dr. Juan Pérez",
    email: "juan.perez@medicones.com",
    role: "PROVIDER",
    tipo: "doctor",
    isActive: true,
    createdAt: "2024-02-01",
  },
  {
    id: "pharmacy-1",
    name: "Farmacia Fybeca",
    email: "fybeca@medicones.com",
    role: "PROVIDER",
    tipo: "pharmacy",
    isActive: true,
    createdAt: "2024-02-10",
  },
  {
    id: "lab-1",
    name: "Laboratorio Clínico XYZ",
    email: "lab@medicones.com",
    role: "PROVIDER",
    tipo: "lab",
    isActive: true,
    createdAt: "2024-02-15",
  },
  {
    id: "ambulance-1",
    name: "Ambulancias Vida",
    email: "ambulancia@medicones.com",
    role: "PROVIDER",
    tipo: "ambulance",
    isActive: true,
    createdAt: "2024-02-20",
  },
  {
    id: "supplies-1",
    name: "Insumos Médicos ABC",
    email: "insumos@medicones.com",
    role: "PROVIDER",
    tipo: "supplies",
    isActive: true,
    createdAt: "2024-02-25",
  },
];

export const getUsersMock = (): User[] => {
  return MOCK_USERS;
};

