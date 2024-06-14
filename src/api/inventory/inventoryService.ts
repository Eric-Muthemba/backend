import { Drug } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { inventoryRepository } from '@/api/inventory/inventoryRepository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

export const inventoryService = {
  findMany: async (id: string | undefined, name: string | undefined): Promise<ServiceResponse<Drug[] | null>> => {
    try {
      let inventory: Drug[] | Drug | null;

      if (id && name) {
        inventory = await inventoryRepository.findAllAsync(id, name);
      } else if (id) {
        inventory = await inventoryRepository.findAllAsync(id, '');
      } else if (name) {
        inventory = await inventoryRepository.findAllAsync('', name);
      } else {
        inventory = await inventoryRepository.findAllAsync('', '');
      }

      if (!inventory || (Array.isArray(inventory) && inventory.length === 0)) {
        return new ServiceResponse(ResponseStatus.Success, 'No Inventory found', null, StatusCodes.NOT_FOUND);
      }

      return new ServiceResponse<Drug[]>(ResponseStatus.Success, 'Inventory found', inventory, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding inventory: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  create: async (
    name: string,
    description: string,
    quantity: number,
    createdById: any,
    price: number
  ): Promise<ServiceResponse<Drug | null>> => {
    try {
      const inventory = await inventoryRepository.createAsync(name, description, quantity, createdById, price);
      return new ServiceResponse<Drug>(
        ResponseStatus.Success,
        'Inventory successfully created',
        inventory,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error creating inventory: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  updateById: async (
    name: string,
    description: string,
    quantity: number,
    price: number,
    drugId: string
  ): Promise<ServiceResponse<Drug | null>> => {
    try {
      const inventory = await inventoryRepository.updateAsync(name, description, quantity, price, drugId);
      return new ServiceResponse<Drug>(
        ResponseStatus.Success,
        'Inventory successfully updated',
        inventory,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error updating inventory: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
