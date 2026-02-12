import { resetPasswordAPI } from '../infrastructure/auth.api';

export const resetPasswordUseCase = async (request: {
  token: string;
  newPassword: string;
}): Promise<{ message: string }> => {
  return await resetPasswordAPI(request);
};
