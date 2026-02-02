import { deleteDoctorAPI } from '../infrastructure/clinic-doctors.api';

export const deleteDoctorUseCase = async (
  _clinicId: string,
  doctorId: string
): Promise<void> => {
  await deleteDoctorAPI(doctorId);
};
