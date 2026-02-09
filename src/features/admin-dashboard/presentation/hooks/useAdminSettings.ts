import { useEffect, useState } from "react";
import { getAdminSettingsUseCase } from "../../application/get-admin-settings.usecase";
import type { AdminSettings } from "../../domain/admin-settings.entity";

export const useAdminSettings = () => {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const data = await getAdminSettingsUseCase();
        setSettings(data);
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const toggleSetting = (key: keyof AdminSettings) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  const updateCommission = (key: keyof AdminSettings, value: number) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      [key]: value,
    } as AdminSettings);
  };

  return { settings, isLoading, toggleSetting, updateCommission };
};