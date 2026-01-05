import type { Product } from "../domain/Product.entity";

// Mock data para productos de insumos médicos
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Silla de ruedas estándar",
    description: "Silla de ruedas plegable para uso diario, ajustable y cómoda",
    category: "Movilidad",
    price: 350.00,
    stock: 15,
    isActive: true,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "2",
    name: "Muletas axilares ajustables",
    description: "Par de muletas axilares con altura ajustable, soporte hasta 100kg",
    category: "Movilidad",
    price: 45.00,
    stock: 30,
    isActive: true,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "3",
    name: "Andador con ruedas",
    description: "Andador con ruedas delanteras y frenos, altura ajustable",
    category: "Movilidad",
    price: 120.00,
    stock: 20,
    isActive: true,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "4",
    name: "Rodillera ortopédica ajustable",
    description: "Rodillera con soporte lateral, talla ajustable",
    category: "Ortopedia",
    price: 35.00,
    stock: 50,
    isActive: true,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "5",
    name: "Collarín cervical",
    description: "Collarín cervical ajustable, material suave y transpirable",
    category: "Ortopedia",
    price: 28.00,
    stock: 40,
    isActive: true,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "6",
    name: "Faja lumbar ortopédica",
    description: "Faja lumbar con varillas de soporte, tallas disponibles",
    category: "Ortopedia",
    price: 42.00,
    stock: 35,
    isActive: true,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
];

export const getProductsMock = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Intentar cargar desde localStorage
      const stored = localStorage.getItem("supply-products");
      if (stored) {
        try {
          const products = JSON.parse(stored);
          resolve(products);
          return;
        } catch (e) {
          // Si hay error, usar mock
        }
      }
      resolve(mockProducts);
    }, 300);
  });
};

export const saveProductsMock = (products: Product[]): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem("supply-products", JSON.stringify(products));
      resolve();
    }, 200);
  });
};

