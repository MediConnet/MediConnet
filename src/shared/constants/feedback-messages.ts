import { useFeedbackStore } from "../../app/store/feedback.store";

export const FEEDBACK = {
  SUCCESS: {
    SAVE: { title: "Operación completada", message: "La información se guardó correctamente." },
    UPDATE: { title: "Cambios guardados", message: "La información fue actualizada correctamente." },
    DELETE: { title: "Registro eliminado", message: "La acción se completó correctamente." },
  },
  ERROR: {
    GENERIC: { title: "Error", message: "No fue posible completar la operación." },
    NOT_FOUND: { title: "Información no encontrada", message: "No se encontraron registros para la consulta realizada." },
    UNAUTHORIZED: { title: "Acceso denegado", message: "Las credenciales proporcionadas no son válidas." },
    FORBIDDEN: { title: "Permisos insuficientes", message: "No tienes autorización para realizar esta acción." },
    NOT_FOUND_404: { title: "Registro no encontrado", message: "La información solicitada no existe." },
    SERVER: { title: "Servicio no disponible", message: "Ocurrió un problema interno. Intenta nuevamente más tarde." },
    NETWORK: { title: "Problema de conexión", message: "No fue posible conectar con el servidor." },
    VALIDATION: { title: "Información incompleta", message: "Completa todos los campos requeridos." },
  },
};

export function showSuccess(title: string, message: string, buttonText?: string) {
  useFeedbackStore.getState().showFeedback("success", title, message, buttonText);
}

export function showError(title: string, message: string, buttonText?: string) {
  useFeedbackStore.getState().showFeedback("error", title, message, buttonText);
}

export function showConfirm(title: string, message: string, onConfirm: () => void, confirmText?: string, cancelText?: string) {
  useFeedbackStore.getState().showConfirm(title, message, onConfirm, { confirmText, cancelText });
}

export function showDelete(title: string, message: string, onConfirm: () => void) {
  useFeedbackStore.getState().showDelete(title, message, onConfirm);
}

export function handleApiError(error: unknown, customMessage?: string) {
  const err = error as { status?: number; message?: string };
  console.error("[FEEDBACK] API Error:", err);

  if (err.status === 401) {
    showError(FEEDBACK.ERROR.UNAUTHORIZED.title, FEEDBACK.ERROR.UNAUTHORIZED.message);
  } else if (err.status === 403) {
    showError(FEEDBACK.ERROR.FORBIDDEN.title, FEEDBACK.ERROR.FORBIDDEN.message);
  } else if (err.status === 404) {
    showError(FEEDBACK.ERROR.NOT_FOUND_404.title, FEEDBACK.ERROR.NOT_FOUND_404.message);
  } else if (err.status != null && err.status >= 500) {
    showError(FEEDBACK.ERROR.SERVER.title, FEEDBACK.ERROR.SERVER.message);
  } else if (!(error as any)?.status) {
    showError(FEEDBACK.ERROR.NETWORK.title, FEEDBACK.ERROR.NETWORK.message);
  } else {
    showError(FEEDBACK.ERROR.GENERIC.title, customMessage || FEEDBACK.ERROR.GENERIC.message);
  }
}
