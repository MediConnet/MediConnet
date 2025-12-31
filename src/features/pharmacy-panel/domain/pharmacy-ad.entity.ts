export type AdStatus = 'active' | 'inactive' | 'draft';

export interface PharmacyAd {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  status: AdStatus;
  startDate: string;
  endDate?: string;
}