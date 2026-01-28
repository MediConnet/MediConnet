import { updateReceptionStatusAPI } from '../infrastructure/clinic-appointments.api';

export const updateReceptionStatusUseCase = async (
  clinicId: string,
  appointmentId: string,
  receptionStatus: 'arrived' | 'not_arrived' | 'attended',
  notes?: string
): Promise<void> => {
  await updateReceptionStatusAPI(appointmentId, receptionStatus, notes);
};
