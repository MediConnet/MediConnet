import type { AmbulanceService } from '../domain/AmbulanceService.entity';

export const ambulancesMock: AmbulanceService[] = [
  {
    id: '1',
    name: 'Ambulancias VidaRápida',
    address: 'Av. 12 de Octubre N27-30 y Orellana',
    phone: '+593987690001',
    image: 'https://via.placeholder.com/400x300/ef4444/ffffff?text=VidaRapida',
    available24_7: true,
    sponsored: false,
  },
  {
    id: '2',
    name: 'Ambulancias Express Quito',
    address: 'Av. 10 de Agosto N30-120 y Villalengua',
    phone: '+593987690002',
    image: 'https://via.placeholder.com/400x300/ef4444/ffffff?text=Express+Quito',
    available24_7: true,
    sponsored: false,
  },
  {
    id: '3',
    name: 'Cruz Roja Ecuatoriana - Quito Norte',
    address: 'Av. Eloy Alfaro N50-120 y Galo Plaza',
    phone: '+593987690003',
    image: 'https://via.placeholder.com/400x300/ef4444/ffffff?text=Cruz+Roja',
    available24_7: true,
    sponsored: false,
  },
  {
    id: '4',
    name: 'Servicios Médicos Móviles',
    address: 'Av. Prensa N58-120 y Diego de Vásquez',
    phone: '+593987690004',
    image: 'https://via.placeholder.com/400x300/ef4444/ffffff?text=Medicos+Moviles',
    available24_7: true,
    sponsored: false,
  },
  {
    id: '5',
    name: 'Ambulancias Salud Total',
    address: 'Av. República N36-120 y Checoslovaquia',
    phone: '+593987690003',
    image: 'https://via.placeholder.com/400x300/ef4444/ffffff?text=Salud+Total',
    available24_7: true,
    sponsored: true,
  },
];

