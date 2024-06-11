import { Inventory } from '@prisma/client'; // Import User model if using TypeScript
import { string } from 'zod';

import { prismaClient } from '@/server';

export const inventoryRepository = {
  findAllAsync: async (id: string, name: string): Promise<Inventory[]> => {
    if (id && name) {
      return await prismaClient.drug.findMany({
        where: {
          id: id,
          name: name,
        },
      });
    } else if (id) {
      return await prismaClient.drug.findUnique({
        where: {
          id: id,
        },
      });
    } else if (name) {
      return await prismaClient.drug.findMany({
        where: {
          name: name,
        },
      });
    } else {
      return await prismaClient.drug.findMany();
    }
  },
  createAsync: async (
    name: string,
    description: string,
    quantity: number,
    createdById: string,
    price: number
  ): Promise<Inventory | null> => {
    return await prismaClient.drug.create({
      data: { name: name, description: description, quantity: quantity, createdById: createdById, price: price },
    });
  },
  updateAsync: async (
    name: string,
    description: string,
    quantity: number,
    price: number,
    drugId: string
  ): Promise<Inventory | null> => {
    return prismaClient.drug.update({
      where: { id: drugId },
      data: { name, description, quantity, price },
    });
  },
};
