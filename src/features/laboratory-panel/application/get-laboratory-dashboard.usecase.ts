import {
  getLaboratoryDashboardAPI,
  getLaboratoryExamsAPI,
  getLaboratoryProfileAPI,
} from "../infrastructure/laboratories.repository";
import type { LaboratoryDashboard, WorkSchedule } from "../domain/LaboratoryDashboard.entity";

const DAYS: Array<WorkSchedule["day"]> = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const buildFullWeekSchedule = (schedules: Array<{ day: string; start: string; end: string }>) => {
  const map = new Map(schedules.map((s) => [s.day, s]));
  return DAYS.map((day) => {
    const s = map.get(day);
    if (!s) return { day, isOpen: false, startTime: "09:00", endTime: "18:00" };
    return { day, isOpen: true, startTime: s.start, endTime: s.end };
  });
};

export const getLaboratoryDashboardUseCase = async (userId: string) => {
  const [dashboard, profile, examsResp] = await Promise.all([
    getLaboratoryDashboardAPI(userId),
    getLaboratoryProfileAPI(),
    getLaboratoryExamsAPI().catch(() => ({ exams: [] })), // backend might not have exams yet
  ]);

  const workSchedule = buildFullWeekSchedule(profile.schedules || []);

  const merged: LaboratoryDashboard = {
    ...dashboard,
    laboratory: {
      ...dashboard.laboratory,
      name: profile.full_name || dashboard.laboratory.name,
      description: profile.description ?? dashboard.laboratory.description,
      logoUrl: profile.logo_url ?? dashboard.laboratory.logoUrl,
      address: profile.address ?? dashboard.laboratory.address,
      whatsapp: profile.whatsapp ?? dashboard.laboratory.whatsapp,
      workSchedule,
      location:
        profile.latitude != null && profile.longitude != null
          ? {
              latitude: profile.latitude,
              longitude: profile.longitude,
              address: profile.address,
            }
          : dashboard.laboratory.location,
      studies: (examsResp.exams || []).map((e) => ({
        id: e.id,
        name: e.name,
        preparation: e.preparation || "",
      })),
    },
  };

  return merged;
};
