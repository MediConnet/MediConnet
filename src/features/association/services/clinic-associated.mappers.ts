import type {
  ClinicAssociatedAppointment,
  DateBlockRequest,
  ReceptionMessage,
} from "../types/clinic-associated.entity";

export function unwrapSingleApiPayload(raw: unknown): Record<string, unknown> {
  const isNestedSingle =
    raw != null &&
    typeof raw === "object" &&
    "data" in raw &&
    !("pagination" in raw) &&
    !Array.isArray((raw as { data: unknown }).data);
  return isNestedSingle
    ? (raw as { data: Record<string, unknown> }).data
    : (raw as Record<string, unknown>);
}

export function mapReceptionMessageFromApi(
  raw: Record<string, unknown>,
): ReceptionMessage {
  const senderRaw = String(
    raw.senderType ?? raw.sender_type ?? raw.from ?? "reception",
  ).toLowerCase();
  const from: ReceptionMessage["from"] =
    senderRaw === "doctor" ? "doctor" : "reception";

  return {
    id: String(raw.id ?? ""),
    clinicId: String(raw.clinicId ?? raw.clinic_id ?? ""),
    doctorId: String(raw.doctorId ?? raw.doctor_id ?? ""),
    from,
    message: String(raw.message ?? ""),
    timestamp: String(raw.timestamp ?? raw.createdAt ?? raw.created_at ?? ""),
    isRead: Boolean(raw.isRead ?? raw.is_read ?? false),
    senderName:
      raw.senderName != null
        ? String(raw.senderName)
        : raw.clinicName != null
          ? String(raw.clinicName)
          : undefined,
  };
}

export function mapDateBlockFromApi(raw: Record<string, unknown>): DateBlockRequest {
  const dateIso = String(raw.date ?? raw.startDate ?? "");
  const endIso = String(raw.endDate ?? raw.endTime ?? dateIso);
  const toDateOnly = (iso: string) => (iso.includes("T") ? iso.split("T")[0] : iso);

  return {
    id: String(raw.id ?? ""),
    doctorId: String(raw.doctorId ?? ""),
    clinicId: String(raw.clinicId ?? ""),
    startDate: toDateOnly(dateIso),
    endDate: toDateOnly(endIso),
    reason: String(raw.reason ?? ""),
    status: (raw.status as DateBlockRequest["status"]) || "pending",
    createdAt: String(raw.createdAt ?? ""),
    reviewedAt: raw.reviewedAt ? String(raw.reviewedAt) : undefined,
    reviewedBy: raw.reviewedBy ? String(raw.reviewedBy) : undefined,
    rejectionReason: raw.rejectionReason ? String(raw.rejectionReason) : undefined,
  };
}

export function normalizeClinicAppointmentStatus(
  status: string,
): ClinicAssociatedAppointment["status"] {
  const s = status.toLowerCase();
  if (s === "confirmed" || s === "scheduled") return "CONFIRMED";
  if (s === "completed" || s === "attended") return "COMPLETED";
  if (s === "no_show") return "NO_SHOW";
  if (s === "cancelled") return "CANCELLED";
  if (s === "pending") return "PENDING";
  if (s === "pending_confirmation") return "PENDING_CONFIRMATION";
  const upper = status.toUpperCase();
  if (
    upper === "CONFIRMED" ||
    upper === "COMPLETED" ||
    upper === "NO_SHOW" ||
    upper === "CANCELLED" ||
    upper === "PENDING" ||
    upper === "PENDING_CONFIRMATION"
  ) {
    return upper as ClinicAssociatedAppointment["status"];
  }
  return "CONFIRMED";
}

export function mapClinicAssociatedAppointmentFromApi(
  raw: Record<string, unknown>,
): ClinicAssociatedAppointment {
  const dateTime = String(
    raw.date ?? raw.scheduledFor ?? raw.scheduled_for ?? "",
  );
  const parsed = dateTime ? new Date(dateTime) : null;
  const dateOnly =
    parsed && !Number.isNaN(parsed.getTime())
      ? parsed.toISOString().split("T")[0]
      : dateTime.includes("T")
        ? dateTime.split("T")[0]
        : dateTime;
  const timeOnly =
    raw.time != null
      ? String(raw.time)
      : parsed && !Number.isNaN(parsed.getTime())
        ? parsed.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "";

  return {
    id: String(raw.id ?? ""),
    patientId: String(raw.patientId ?? raw.patient_id ?? ""),
    patientName: String(raw.patientName ?? raw.patient_name ?? "Paciente"),
    patientPhone:
      raw.patientPhone != null
        ? String(raw.patientPhone)
        : raw.patient_phone != null
          ? String(raw.patient_phone)
          : undefined,
    date: dateOnly,
    time: timeOnly,
    reason: raw.reason != null ? String(raw.reason) : undefined,
    status: normalizeClinicAppointmentStatus(String(raw.status ?? "confirmed")),
  };
}
