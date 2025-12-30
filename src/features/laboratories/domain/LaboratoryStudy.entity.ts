export interface LaboratoryStudy {
    paciente: string;
    tipo: string;
    fecha: string;
    hora: string;
    estado: "pendiente" | "en proceso" | "completado";
  }
  