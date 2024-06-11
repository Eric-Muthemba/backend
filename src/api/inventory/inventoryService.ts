import { StatusCodes } from 'http-status-codes';
import { string } from 'zod';

import { inventoryRepository } from '@/api/inventory/inventoryRepository';
import { Inventory } from '@/api/inventory/inventorySchema';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

export const inventoryService = {
  // Retrieves all users from the database
  findAll: async (id: string, name: string): Promise<ServiceResponse<Inventory[] | null>> => {
    try {
      const inventory = await inventoryRepository.findAllAsync(id, name);
      if (!inventory || inventory.length === 0) {
        return new ServiceResponse(ResponseStatus.Success, 'No Inventory found', [], StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Inventory[]>(ResponseStatus.Success, 'Inventory found', inventory, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all inventory: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  // Retrieves a single user by their ID
  create: async (
    name: string,
    description: string,
    quantity: number,
    createdById: string,
    price: number
  ): Promise<ServiceResponse<Inventory | null>> => {
    try {
      const inventory = await inventoryRepository.createAsync(name, description, quantity, createdById, price);
      return new ServiceResponse<Inventory>(
        ResponseStatus.Success,
        'Inventory successfully created',
        inventory,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error creating inventory with the name ${name}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  // Retrieves a single user by their ID
  updateById: async (
    name: string,
    description: string,
    quantity: number,
    price: number,
    drugId: string
  ): Promise<ServiceResponse<Inventory | null>> => {
    try {
      const inventory = await inventoryRepository.updateAsync(name, description, quantity, price, drugId);
      return new ServiceResponse<Inventory>(
        ResponseStatus.Success,
        'Inventory successfully updated',
        inventory,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error updating inventory with the id ${drugId}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
