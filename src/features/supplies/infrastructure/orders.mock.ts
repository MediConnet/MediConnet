import type { SupplyOrder } from "../domain/Order.entity";

// Mock data para pedidos de insumos médicos (productos ortopédicos y de rehabilitación)
export const mockOrders: SupplyOrder[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    clientName: "María González",
    clientEmail: "maria.gonzalez@email.com",
    clientPhone: "+593 99 111 2222",
    clientAddress: "Av. Amazonas N28-75, Quito",
    items: [
      {
        id: "1",
        productName: "Silla de ruedas estándar",
        quantity: 1,
        unitPrice: 350.00,
        total: 350.00,
      },
      {
        id: "2",
        productName: "Muletas axilares ajustables (par)",
        quantity: 1,
        unitPrice: 45.00,
        total: 45.00,
      },
      {
        id: "3",
        productName: "Andador con ruedas",
        quantity: 1,
        unitPrice: 120.00,
        total: 120.00,
      },
    ],
    totalAmount: 515.00,
    status: "confirmed",
    orderDate: "2024-01-20",
    deliveryDate: "2024-01-25",
    notes: "Cliente requiere silla de ruedas para adulto",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    clientName: "Juan Pérez",
    clientEmail: "juan.perez@email.com",
    clientPhone: "+593 99 222 3333",
    clientAddress: "Av. 10 de Agosto N30-120, Quito",
    items: [
      {
        id: "4",
        productName: "Rodillera ortopédica ajustable",
        quantity: 2,
        unitPrice: 35.00,
        total: 70.00,
      },
      {
        id: "5",
        productName: "Collarín cervical",
        quantity: 1,
        unitPrice: 28.00,
        total: 28.00,
      },
      {
        id: "6",
        productName: "Faja lumbar ortopédica",
        quantity: 1,
        unitPrice: 42.00,
        total: 42.00,
      },
    ],
    totalAmount: 140.00,
    status: "preparing",
    orderDate: "2024-01-18",
    deliveryDate: "2024-01-22",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    clientName: "Ana Martínez",
    clientEmail: "ana.martinez@email.com",
    clientPhone: "+593 99 333 4444",
    clientAddress: "Av. Eloy Alfaro N50-120, Quito",
    items: [
      {
        id: "7",
        productName: "Bastón de apoyo ajustable",
        quantity: 1,
        unitPrice: 25.00,
        total: 25.00,
      },
      {
        id: "8",
        productName: "Plantillas ortopédicas personalizadas",
        quantity: 1,
        unitPrice: 85.00,
        total: 85.00,
      },
    ],
    totalAmount: 110.00,
    status: "shipped",
    orderDate: "2024-01-15",
    deliveryDate: "2024-01-20",
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    clientName: "Carlos Rodríguez",
    clientEmail: "carlos.rodriguez@email.com",
    clientPhone: "+593 99 444 5555",
    clientAddress: "Av. República N36-120, Quito",
    items: [
      {
        id: "9",
        productName: "Silla de ruedas eléctrica",
        quantity: 1,
        unitPrice: 1200.00,
        total: 1200.00,
      },
      {
        id: "10",
        productName: "Colchón antiescaras",
        quantity: 1,
        unitPrice: 180.00,
        total: 180.00,
      },
    ],
    totalAmount: 1380.00,
    status: "delivered",
    orderDate: "2024-01-10",
    deliveryDate: "2024-01-15",
  },
  {
    id: "5",
    orderNumber: "ORD-2024-005",
    clientName: "Laura Sánchez",
    clientEmail: "laura.sanchez@email.com",
    clientPhone: "+593 99 555 6666",
    clientAddress: "Av. 12 de Octubre N26-50, Quito",
    items: [
      {
        id: "11",
        productName: "Muletas canadienses (par)",
        quantity: 1,
        unitPrice: 55.00,
        total: 55.00,
      },
      {
        id: "12",
        productName: "Tobillera ortopédica",
        quantity: 1,
        unitPrice: 32.00,
        total: 32.00,
      },
      {
        id: "13",
        productName: "Coderas de compresión (par)",
        quantity: 1,
        unitPrice: 28.00,
        total: 28.00,
      },
    ],
    totalAmount: 115.00,
    status: "pending",
    orderDate: "2024-01-22",
    notes: "Cliente solicita productos para recuperación post-quirúrgica",
  },
];

export const getOrdersMock = (): Promise<SupplyOrder[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockOrders);
    }, 500);
  });
};

