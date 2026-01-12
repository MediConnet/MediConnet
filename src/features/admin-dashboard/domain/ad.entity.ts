export interface Ad {
  id: string;
  providerId: string;
  title: string;
  description: string;
  imageUrl?: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
}

