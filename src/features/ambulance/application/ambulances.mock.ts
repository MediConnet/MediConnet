import type { AmbulanceService } from '../domain/AmbulanceService.entity';

export const ambulancesMock: AmbulanceService[] = [
  {
    id: '1',
    name: 'Ambulancias VidaRápida',
    address: 'Av. 12 de Octubre N27-30 y Orellana',
    phone: '+593987690001',
    image: 'https://images.unsplash.com/photo-1582560469781-1965b9af903d?w=400',
    available24_7: true,
    sponsored: false,
  },
  {
    id: '2',
    name: 'Ambulancias Express Quito',
    address: 'Av. 10 de Agosto N30-120 y Villalengua',
    phone: '+593987690002',
    image: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=400',
    available24_7: true,
    sponsored: false,
  },
  {
    id: '3',
    name: 'Cruz Roja Ecuatoriana - Quito Norte',
    address: 'Av. Eloy Alfaro N50-120 y Galo Plaza',
    phone: '+593987690003',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsHFSAl0X64hTcJLdJXbhAXajGOe93F35X8w&s',
    available24_7: true,
    sponsored: false,
  },
  {
    id: '4',
    name: 'Servicios Médicos Móviles',
    address: 'Av. Prensa N58-120 y Diego de Vásquez',
    phone: '+593987690004',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQemuJ0_ittFXfkWVpcB5F6O07QYDnaiXrbEg&s',
    available24_7: true,
    sponsored: false,
  },
  {
    id: '5',
    name: 'Ambulancias Salud Total',
    address: 'Av. República N36-120 y Checoslovaquia',
    phone: '+593987690003',
    image: 'https://i0.wp.com/revistabuenviaje.com.ec/wp-content/uploads/2020/09/AMBULANCIA-H350.png?fit=800%2C600&ssl=1',
    available24_7: true,
    sponsored: true,
  },
];

