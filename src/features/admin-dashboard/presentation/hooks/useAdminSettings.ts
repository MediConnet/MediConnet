import { useEffect, useState } from "react";
import { getAdminSettingsUseCase } from "../../application/get-admin-settings.usecase";
import { updateAdminSettingsUseCase } from "../../application/update-admin-settings.usecase";
import type { AdminSettings } from "../../domain/admin-settings.entity";

export const useAdminSettings = () => {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      console.log("🎣 useAdminSettings: Iniciando fetchSettings...");
      setIsLoading(true);
      const data = await getAdminSettingsUseCase();
      console.log("🎣 useAdminSettings: Datos recibidos:", data);
      setSettings(data);
    } catch (error) {
      console.error("❌ useAdminSettings: Error fetching settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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

  const saveSettings = async (): Promise<boolean> => {
    if (!settings) return false;
    
    try {
      console.log("💾 useAdminSettings: Guardando settings:", settings);
      setIsSaving(true);
      const updatedSettings = await updateAdminSettingsUseCase(settings);
      console.log("💾 useAdminSettings: Settings guardados exitosamente:", updatedSettings);
      setSettings(updatedSettings);
      return true;
    } catch (error) {
      console.error("❌ useAdminSettings: Error saving settings:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { 
    settings, 
    isLoading, 
    isSaving,
    toggleSetting, 
    updateCommission,
    saveSettings,
    refetch: fetchSettings
  };
};