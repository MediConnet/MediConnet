import * as Yup from "yup";

/** Validación compartida para formularios de cuenta bancaria (clínica, médico, etc.). */
export const bankAccountValidationSchema = Yup.object({
  bankName: Yup.string().required("El banco es requerido"),
  accountNumber: Yup.string()
    .required("El número de cuenta es requerido")
    .min(10, "El número de cuenta debe tener al menos 10 dígitos")
    .matches(/^\d+$/, "Solo se permiten números"),
  accountType: Yup.string()
    .oneOf(["checking", "savings"], "Selecciona un tipo de cuenta válido")
    .required("El tipo de cuenta es requerido"),
  accountHolder: Yup.string().required("El titular de la cuenta es requerido"),
  identificationNumber: Yup.string().optional(),
});
