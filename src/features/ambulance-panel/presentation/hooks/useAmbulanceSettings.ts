import { useEffect, useState } from "react";
import { getAmbulanceSettingsUseCase } from "../../application/get-settings.usecase";
import type { AmbulanceSettings } from "../../domain/ambulance-settings.entity";

export const useAmbulanceSettings = () => {
  const [settings, setSettings] = useState<AmbulanceSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const data = await getAmbulanceSettingsUseCase();
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
  const toggleNotification = (key: keyof AmbulanceSettings["notifications"]) => {
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