import { Payment } from '@prisma/client';

import { prismaClient } from '@/server';

export const transactionsRepository = {
  createAsync: async (
    totalAmount: number,
    method: string,
    checkout_id: string,
    prescriptionId: string
  ): Promise<Payment | null> => {
    const payment = await prismaClient.payment.create({
      data: {
        amount: totalAmount,
        method: method as any,
        checkout_id,
        status: 'PENDING',
      },
    });

    await prismaClient.prescriptionPayments.create({
      data: {
        prescriptionId,
        paymentId: payment.id,
      },
    });

    return payment;
  },

  findByCheckoutAsync: async (checkout_id: string): Promise<Payment | null> => {
    return await prismaClient.payment.findFirst({
      where: { checkout_id, status: 'PENDING', method: 'MPESA' },
    });
  },

  updateByIdAsync: async (id: string, status: string, description?: string, reference?: string): Promise<Payment> => {
    const dataToUpdate: any = { status };

    if (description) {
      dataToUpdate.description = description;
    }
    if (reference) {
      dataToUpdate.reference = reference;
    }

    return await prismaClient.payment.update({
      where: { id },
      data: dataToUpdate,
    });
  },

  findAllAsync: async (): Promise<Payment[]> => {
    return await prismaClient.payment.findMany();
  },
};
