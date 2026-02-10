import type { AmbulanceProfile } from "../../domain/ambulance-profile.entity";

const getInitials = (name: string) => {
  const cleaned = (name || "").trim();
  if (!cleaned) return "A";
  const parts = cleaned.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "A";
  const second = parts[1]?.[0] ?? parts[0]?.[1] ?? "";
  return (first + second).toUpperCase();
};

export const buildAmbulanceUserHeaderProfile = (profile?: AmbulanceProfile | null) => {
  const name = profile?.commercialName || "Ambulancia";
  return {
    name,
    roleLabel: "Proveedor",
    initials: getInitials(name),
    isActive: profile?.isActive !== false,
  };
};

