import { deleteDoctorAPI } from '../infrastructure/clinic-doctors.api';

export const deleteDoctorUseCase = async (
  clinicId: string,
  doctorId: string
): Promise<void> => {
  await deleteDoctorAPI(doctorId);
};
