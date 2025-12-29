import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";

// Mock del Doctor (Esto es lo que cambiaría dinámicamente)
const MOCK_PROVIDER_USER = {
  name: "Dr. Carlos Mendoza",
  roleLabel: "Cardiología",
  initials: "CM",
  isActive: true,
};

export const ProviderProfilePage = () => {
  return (
    <DashboardLayout
      role="PROVIDER"
      title="Mi Perfil"
      userProfile={MOCK_PROVIDER_USER}
    >
      {/* AQUÍ IRÁ EL FORMULARIO DE PERFIL DEL MÉDICO */}
      <div className="p-4 bg-white rounded shadow">
        <h3 className="font-bold">Información del Perfil</h3>
        <p>Gestiona los datos de tu servicio.</p>
      </div>
    </DashboardLayout>
  );
};
