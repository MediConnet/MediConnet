import type { Specialty } from "../domain/specialty.entity";
// Importamos los íconos de Material UI
import {
  Air,
  Biotech,
  ChildCare,
  ContentCut,
  Coronavirus,
  DirectionsRun,
  FaceRetouchingNatural,
  Favorite,
  Healing,
  HealthAndSafety,
  Hearing,
  LocalPharmacy,
  MedicalServices,
  MedicationLiquid,
  Psychology,
  RemoveRedEye,
  SelfImprovement,
  Water,
  WaterDrop,
  Woman,
} from "@mui/icons-material";

export const MOCK_SPECIALTIES: Specialty[] = [
  // --- Fila 1 ---
  {
    id: "1",
    name: "Medicina General",
    icon: <MedicalServices fontSize="inherit" />,
    colorClass: "bg-emerald-500",
  },
  {
    id: "2",
    name: "Cardiología",
    icon: <Favorite fontSize="inherit" />,
    colorClass: "bg-red-500",
  },
  {
    id: "3",
    name: "Dermatología",
    icon: <FaceRetouchingNatural fontSize="inherit" />,
    colorClass: "bg-pink-500",
  },
  {
    id: "4",
    name: "Ginecología",
    icon: <Woman fontSize="inherit" />,
    colorClass: "bg-purple-500",
  },
  // --- Fila 2 ---
  {
    id: "5",
    name: "Pediatría",
    icon: <ChildCare fontSize="inherit" />,
    colorClass: "bg-green-500",
  },
  {
    id: "6",
    name: "Oftalmología",
    icon: <RemoveRedEye fontSize="inherit" />,
    colorClass: "bg-cyan-500",
  },
  {
    id: "7",
    name: "Traumatología",
    icon: <Healing fontSize="inherit" />,
    colorClass: "bg-orange-500",
  },
  {
    id: "8",
    name: "Neurología",
    icon: <Psychology fontSize="inherit" />,
    colorClass: "bg-indigo-500",
  },
  // --- Fila 3 ---
  {
    id: "9",
    name: "Psiquiatría",
    icon: <SelfImprovement fontSize="inherit" />,
    colorClass: "bg-teal-500",
  },
  {
    id: "10",
    name: "Urología",
    icon: <WaterDrop fontSize="inherit" />,
    colorClass: "bg-amber-500",
  },
  {
    id: "11",
    name: "Endocrinología",
    icon: <Biotech fontSize="inherit" />,
    colorClass: "bg-lime-500",
  },
  {
    id: "12",
    name: "Gastroenterología",
    icon: <LocalPharmacy fontSize="inherit" />,
    colorClass: "bg-emerald-600",
  },
  // --- Fila 4  ---
  {
    id: "13",
    name: "Neumología",
    icon: <Air fontSize="inherit" />,
    colorClass: "bg-sky-500",
  },
  {
    id: "14",
    name: "Otorrinolaringología",
    icon: <Hearing fontSize="inherit" />,
    colorClass: "bg-orange-400",
  },
  {
    id: "15",
    name: "Oncología",
    icon: <Coronavirus fontSize="inherit" />, // Representación celular
    colorClass: "bg-rose-500",
  },
  {
    id: "16",
    name: "Reumatología",
    icon: <DirectionsRun fontSize="inherit" />,
    colorClass: "bg-violet-500",
  },
  // --- Fila 5 ---
  {
    id: "17",
    name: "Nefrología",
    icon: <Water fontSize="inherit" />,
    colorClass: "bg-fuchsia-500",
  },
  {
    id: "18",
    name: "Cirugía General",
    icon: <ContentCut fontSize="inherit" />,
    colorClass: "bg-slate-500",
  },
  {
    id: "19",
    name: "Anestesiología",
    icon: <MedicationLiquid fontSize="inherit" />,
    colorClass: "bg-gray-600",
  },
  {
    id: "20",
    name: "Odontología",
    icon: <HealthAndSafety fontSize="inherit" />,
    colorClass: "bg-blue-500",
  },
];
