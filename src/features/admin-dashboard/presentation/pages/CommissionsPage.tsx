import { useState } from "react";
import { Box, Paper, Tab, Tabs, Typography, Divider, Button } from "@mui/material";
import { Save } from "@mui/icons-material";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { CommissionSettingItem } from "../components/CommissionSettingItem";
import { useAdminSettings } from "../hooks/useAdminSettings";
import { LoadingSpinner } from "../../../../shared/components/LoadingSpinner";

const CURRENT_ADMIN = {
  name: "Administrador General",
  roleLabel: "Administrator",
  initials: "AG",
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

export const CommissionsPage = () => {
  const { settings, isLoading, updateCommission } = useAdminSettings();
  const [activeTab, setActiveTab] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);

  console.log("🎬 CommissionsPage renderizado");
  console.log("📊 Settings:", settings);
  console.log("⏳ Loading:", isLoading);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCommissionChange = (key: string, value: number) => {
    if (!updateCommission) return;
    updateCommission(key as keyof typeof settings, value);
    setHasChanges(true);
  };

  const handleSave = () => {
    // Aquí iría la llamada al backend para guardar
    console.log("Guardando comisiones:", settings);
    setHasChanges(false);
    // TODO: Implementar guardado en backend
  };

  if (isLoading || !settings) {
    return (
      <DashboardLayout role="ADMIN" userProfile={CURRENT_ADMIN}>
        <Box sx={{ p: 3 }}>
          <LoadingSpinner text="Cargando configuración..." />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN" userProfile={CURRENT_ADMIN}>
      <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Configuración de Comisiones
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Define el porcentaje de comisión que la plataforma cobra por cada tipo de servicio
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "grey.200",
            overflow: "hidden",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              px: 2,
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
              },
            }}
          >
            <Tab label="Pagos a Médicos" />
            <Tab label="Pagos a Clínicas" />
            <Tab label="Pagos a Laboratorios" />
            <Tab label="Pagos a Farmacias" />
            <Tab label="Pagos a Insumos" />
            <Tab label="Pagos a Ambulancias" />
          </Tabs>

          {/* Tab 1: Médicos */}
          <TabPanel value={activeTab} index={0}>
            <Box sx={{ px: 4 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Comisión para Médicos
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configura el porcentaje de comisión que se cobra por consultas médicas
              </Typography>

              <CommissionSettingItem
                title="Porcentaje de Comisión"
                description="Comisión que la plataforma cobra por cada consulta médica realizada"
                value={settings.commissionDoctor}
                onChange={(value) => handleCommissionChange("commissionDoctor", value)}
              />

              <Box sx={{ mt: 3, p: 3, bgcolor: "#f0f9ff", borderRadius: 2 }}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Ejemplo de cálculo:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Si una consulta cuesta $100 y la comisión es {settings.commissionDoctor}%:
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  • Comisión plataforma: ${(100 * settings.commissionDoctor / 100).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Pago al médico: ${(100 - (100 * settings.commissionDoctor / 100)).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </TabPanel>

          {/* Tab 2: Clínicas */}
          <TabPanel value={activeTab} index={1}>
            <Box sx={{ px: 4 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Comisión para Clínicas
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configura el porcentaje de comisión que se cobra por servicios de clínicas
              </Typography>

              <CommissionSettingItem
                title="Porcentaje de Comisión"
                description="Comisión que la plataforma cobra por cada servicio de clínica"
                value={settings.commissionClinic}
                onChange={(value) => handleCommissionChange("commissionClinic", value)}
              />

              <Box sx={{ mt: 3, p: 3, bgcolor: "#f0f9ff", borderRadius: 2 }}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Ejemplo de cálculo:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Si un servicio cuesta $200 y la comisión es {settings.commissionClinic}%:
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  • Comisión plataforma: ${(200 * settings.commissionClinic / 100).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Pago a la clínica: ${(200 - (200 * settings.commissionClinic / 100)).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </TabPanel>

          {/* Tab 3: Laboratorios */}
          <TabPanel value={activeTab} index={2}>
            <Box sx={{ px: 4 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Comisión para Laboratorios
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configura el porcentaje de comisión que se cobra por estudios de laboratorio
              </Typography>

              <CommissionSettingItem
                title="Porcentaje de Comisión"
                description="Comisión que la plataforma cobra por cada estudio de laboratorio"
                value={settings.commissionLaboratory}
                onChange={(value) => handleCommissionChange("commissionLaboratory", value)}
              />

              <Box sx={{ mt: 3, p: 3, bgcolor: "#f0f9ff", borderRadius: 2 }}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Ejemplo de cálculo:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Si un estudio cuesta $150 y la comisión es {settings.commissionLaboratory}%:
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  • Comisión plataforma: ${(150 * settings.commissionLaboratory / 100).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Pago al laboratorio: ${(150 - (150 * settings.commissionLaboratory / 100)).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </TabPanel>

          {/* Tab 4: Farmacias */}
          <TabPanel value={activeTab} index={3}>
            <Box sx={{ px: 4 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Comisión para Farmacias
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configura el porcentaje de comisión que se cobra por ventas de medicamentos
              </Typography>

              <CommissionSettingItem
                title="Porcentaje de Comisión"
                description="Comisión que la plataforma cobra por cada venta de medicamentos"
                value={settings.commissionPharmacy}
                onChange={(value) => handleCommissionChange("commissionPharmacy", value)}
              />

              <Box sx={{ mt: 3, p: 3, bgcolor: "#f0f9ff", borderRadius: 2 }}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Ejemplo de cálculo:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Si una venta es de $80 y la comisión es {settings.commissionPharmacy}%:
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  • Comisión plataforma: ${(80 * settings.commissionPharmacy / 100).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Pago a la farmacia: ${(80 - (80 * settings.commissionPharmacy / 100)).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </TabPanel>

          {/* Tab 5: Insumos Médicos */}
          <TabPanel value={activeTab} index={4}>
            <Box sx={{ px: 4 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Comisión para Insumos Médicos
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configura el porcentaje de comisión que se cobra por venta de insumos médicos
              </Typography>

              <CommissionSettingItem
                title="Porcentaje de Comisión"
                description="Comisión que la plataforma cobra por cada venta de insumos médicos"
                value={settings.commissionSupplies}
                onChange={(value) => handleCommissionChange("commissionSupplies", value)}
              />

              <Box sx={{ mt: 3, p: 3, bgcolor: "#f0f9ff", borderRadius: 2 }}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Ejemplo de cálculo:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Si una venta es de $120 y la comisión es {settings.commissionSupplies}%:
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  • Comisión plataforma: ${(120 * settings.commissionSupplies / 100).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Pago al proveedor: ${(120 - (120 * settings.commissionSupplies / 100)).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </TabPanel>

          {/* Tab 6: Ambulancias */}
          <TabPanel value={activeTab} index={5}>
            <Box sx={{ px: 4 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Comisión para Ambulancias
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configura el porcentaje de comisión que se cobra por servicios de ambulancia
              </Typography>

              <CommissionSettingItem
                title="Porcentaje de Comisión"
                description="Comisión que la plataforma cobra por cada servicio de ambulancia"
                value={settings.commissionAmbulance}
                onChange={(value) => handleCommissionChange("commissionAmbulance", value)}
              />

              <Box sx={{ mt: 3, p: 3, bgcolor: "#f0f9ff", borderRadius: 2 }}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Ejemplo de cálculo:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Si un servicio cuesta $300 y la comisión es {settings.commissionAmbulance}%:
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  • Comisión plataforma: ${(300 * settings.commissionAmbulance / 100).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Pago a la ambulancia: ${(300 - (300 * settings.commissionAmbulance / 100)).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </TabPanel>

          <Divider />

          <Box sx={{ p: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={!hasChanges}
              sx={{
                backgroundColor: "#14b8a6",
                "&:hover": { backgroundColor: "#0d9488" },
              }}
            >
              Guardar Cambios
            </Button>
          </Box>
        </Paper>
      </Box>
    </DashboardLayout>
  );
};
