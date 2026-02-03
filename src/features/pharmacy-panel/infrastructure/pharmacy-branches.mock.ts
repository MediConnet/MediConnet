import type { PharmacyBranch } from "../domain/pharmacy-branch.entity";

export const MOCK_PHARMACY_BRANCHES: PharmacyBranch[] = [
  {
    id: "BR-001",
    name: "Sucursal Matriz - Centro",
    address: "Av. Amazonas N25 y Colón",
    openingHours: "24 Horas",
    phone: "02 2555 555",
    whatsapp: "+593 99 123 4567",
    hasHomeDelivery: true,
    isActive: true,
  },
  {
    id: "BR-002",
    name: "Sucursal Cumbayá",
    address: "Paseo San Francisco, Local 12",
    openingHours: "Lun-Dom 09:00 - 21:00",
    phone: "02 2890 123",
    whatsapp: "+593 98 765 4321",
    hasHomeDelivery: true,
    isActive: true,
  },
  {
    id: "BR-003",
    name: "Sucursal Valle de los Chillos",
    address: "Av. Ilaló y Gral. Rumiñahui",
    openingHours: "Lun-Sab 08:00 - 22:00",
    phone: "02 2345 678",
    whatsapp: "+593 99 876 5432",
    hasHomeDelivery: false,
    isActive: true,
  },
  {
    id: "BR-004",
    name: "Sucursal Norte - El Condado",
    address: "Av. de la Prensa N78",
    openingHours: "Lun-Vie 08:00 - 20:00",
    phone: "02 2456 789",
    whatsapp: "+593 97 654 3210",
    hasHomeDelivery: true,
    isActive: false, 
  },
];

export const getPharmacyBranchesMock = (): Promise<PharmacyBranch[]> => {
  return Promise.resolve(MOCK_PHARMACY_BRANCHES);
};