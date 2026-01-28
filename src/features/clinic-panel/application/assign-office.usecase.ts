import { assignOfficeAPI } from '../infrastructure/clinic-doctors.api';

export const assignOfficeUseCase = async (
  clinicId: string,
  doctorId: string,
  officeNumber: string
): Promise<void> => {
  await assignOfficeAPI(doctorId, officeNumber);
};
