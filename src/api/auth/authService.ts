import { compareSync } from 'bcrypt';
import { StatusCodes } from 'http-status-codes';

import { Auth } from '@/api/auth/authSchema';
import { authRepository } from '@/api/auth/authRepository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

export const authService = {
  login: async (email: string, password: string): Promise<ServiceResponse<Auth | null>> => {
    try {
      const user = await authRepository.findFirstAsync(email);
      if (!user) {
        return new ServiceResponse(ResponseStatus.Failed, 'User does not exists', null, StatusCodes.NOT_FOUND);
      }

      if (!compareSync(password, user.password)) {
        const errorMessage = `Incorrect password.`;
        return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.UNAUTHORIZED);
      }
      const token = await authRepository.loginAsync(user.id, user.roles);
      return new ServiceResponse<Auth>(
        ResponseStatus.Success,
        'User successfully logged in',
        { user, token },
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error login ${email}:, ${(ex as Error).message}`;
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
