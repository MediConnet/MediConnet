import type { SupplyDashboard } from "../domain/SupplyDashboard.entity";
import { useAuthStore } from "../../../app/store/auth.store";
import { getSupplyPanelReviewsAPI, getSupplyProfileAPI } from "./supply.api";

const buildEmptyDashboard = (userId: string): SupplyDashboard => {
  const user = useAuthStore.getState().user;

  return {
    visits: 0,
    contacts: 0,
    reviews: 0,
    rating: 0,
    supply: {
      name: user?.name || "Insumos",
      email: user?.email || "",
      whatsapp: "",
      address: "",
      description: "",
      schedule: "",
      workSchedule: [],
      isActive: true,
    },
    reviewsList: [],
  };
};

export const getSupplyDashboardAPI = async (_userId: string): Promise<SupplyDashboard> => {
  try {
    const user = useAuthStore.getState().user;

    // 1) Perfil base (por token)
    let profile: any = null;
    try {
      profile = await getSupplyProfileAPI();
    } catch {
      profile = null;
    }

    // 2) Reviews (panel autenticado)
    let rating = 0;
    let reviews = 0;
    let reviewsList: SupplyDashboard["reviewsList"] = [];
    try {
      const r = await getSupplyPanelReviewsAPI();
      rating = Number(r.averageRating || 0);
      reviews = Number(r.totalReviews || 0);
      reviewsList = (r.reviews || []).slice(0, 20).map((rv: any) => ({
        id: rv.id,
        userName: rv.userName || "Usuario",
        rating: rv.rating,
        comment: rv.comment || "",
        date: rv.createdAt || rv.date || new Date().toISOString().split("T")[0],
      }));
    } catch {
      // Si falla, mantener vacío (sin DEMO)
    }

    return {
      visits: 0, // backend pendiente (analytics)
      contacts: 0, // backend pendiente
      reviews,
      rating,
      supply: {
        name: profile?.name || user?.name || "Insumos",
        email: user?.email || "",
        phone: profile?.phone || "",
        whatsapp: profile?.whatsapp || "",
        address: profile?.address || "",
        description: profile?.description || "",
        schedule: profile?.schedule || "",
        logoUrl: profile?.logoUrl ?? null,
        workSchedule: [],
        isActive: profile?.isActive !== false,
      },
      reviewsList,
    };
  } catch (error) {
    console.error("Error in getSupplyDashboardAPI:", error);
    return buildEmptyDashboard(_userId);
  }
};

