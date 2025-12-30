import { useEffect, useState } from "react";
import { getPharmacySettingsUseCase } from "../../application/get-pharmacy-settings.usecase";
import type { PharmacySettings } from "../../domain/pharmacy-settings.entity";

export const usePharmacySettings = () => {
  const [settings, setSettings] = useState<PharmacySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const data = await getPharmacySettingsUseCase();
        setSettings(data);
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Función para cambiar el estado de un switch
  const toggleNotification = (key: keyof PharmacySettings["notifications"]) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    });
  };

  return { settings, isLoading, toggleNotification };
};