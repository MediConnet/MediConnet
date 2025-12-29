export type ActivityType = 
  | "REGISTRATION" 
  | "APPROVAL" 
  | "REJECTION" 
  | "ANNOUNCEMENT" 
  | "UPDATE";

export interface ActivityHistory {
  id: string;
  title: string;
  actor: string;
  date: string;
  type: ActivityType;
}