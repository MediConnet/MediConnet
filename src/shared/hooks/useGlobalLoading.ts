import { useState, useEffect } from "react";
import { loadingManager } from "../lib/http";

export const useGlobalLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const updateLoading = () => {
      setIsLoading(loadingManager.getCount() > 0);
    };

    // Suscribirse a cambios del loading manager
    const unsubscribe = loadingManager.subscribe(updateLoading);
    
    // Actualizar estado inicial
    updateLoading();
    
    return unsubscribe;
  }, []);

  return { isLoading };
};
