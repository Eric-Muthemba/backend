import { StatusCodes } from 'http-status-codes';

import { managementRepository } from '@/api/management/managementRepository';
import { management } from '@/api/management/managementSchema';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';

export const managementService = {
  create: async (
    name: string,
    email: string,
    phone_number: string,
    roles: any
  ): Promise<ServiceResponse<management | null>> => {
    try {
      let user = await managementRepository.findFirstAsync(email);
      if (user) {
        return new ServiceResponse(ResponseStatus.Failed, 'User already exists', null, StatusCodes.NOT_FOUND);
      }
      user = await managementRepository.createAsync(name, email, phone_number, roles);
      return new ServiceResponse<management>(ResponseStatus.Success, 'User created', user, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error creating user with email ${email}:, ${(ex as Error).message}`;
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  findAll: async (): Promise<ServiceResponse<management | null>> => {
    try {
      const users = await managementRepository.findAllAsync();
      if (!users || !users.length) {
        return new ServiceResponse<management>(ResponseStatus.Success, `No user found`, [], StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<management>(ResponseStatus.Success, 'users', users, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding users :, ${(ex as Error).message}`;
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
