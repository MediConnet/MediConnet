export type AdStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Ad {
  id: string;
  
  badge_text?: string;
  title?: string;
  subtitle?: string;
  action_text?: string;
  image_url?: string | null;
  start_date?: string | Date;
  end_date?: string | Date | null;
  
  status?: AdStatus;
  is_active?: boolean;
  
  bg_color_hex?: string;
  accent_color_hex?: string;

  // --- CAMPOS DE FRONTEND (Camel Case) ---
  label?: string;       
  discount?: string;    
  description?: string; 
  buttonText?: string;  
  imageUrl?: string;    
  startDate?: string | Date;
  endDate?: string | Date;
}