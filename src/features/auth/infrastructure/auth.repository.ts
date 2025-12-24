import type { ResetPasswordRequest, ResetPasswordResponse } from '../domain/ResetPasswordRequest.entity';
import { sendResetPasswordAPI } from './auth.api';

/**
 * Repository: Abstracción de acceso a datos de autenticación
 */
export class AuthRepository {
  async sendResetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    return await sendResetPasswordAPI(request);
  }
}

