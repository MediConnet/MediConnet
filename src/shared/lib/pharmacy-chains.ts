import type { PharmacyChain } from "../../features/admin-dashboard/domain/pharmacy-chain.entity";

// Función compartida para obtener cadenas de farmacias
export const getPharmacyChains = (): PharmacyChain[] => {
  const saved = localStorage.getItem("pharmacy-chains");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error("Error loading pharmacy chains:", error);
    }
  }
  
  // Datos iniciales por defecto con logos
  const defaultChains: PharmacyChain[] = [
    {
      id: "1",
      name: "Fybeca",
      logoUrl: "https://scalashopping.com/wp-content/uploads/2018/08/logo-Fybeca-01-1024x683.png",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    },
    {
      id: "2",
      name: "Sana Sana",
      logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKWAttN0PrToBQ9ZKbVicBbTL9RoFXG2TiKQ&s",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    },
    {
      id: "3",
      name: "Pharmacy's",
      logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj7nO9P5Hx_jBWhln5kKvzrWxn8XCSz_1SSw&s",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    },
    {
      id: "4",
      name: "MegaFarmacias",
      logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtktD8217ZZ0okM9bxmMokMWFfX9i27xbYgA&s",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    },
  ];
  
  localStorage.setItem("pharmacy-chains", JSON.stringify(defaultChains));
  return defaultChains;
};

