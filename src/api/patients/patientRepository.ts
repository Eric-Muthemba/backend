import { Patient } from '@prisma/client'; // Import User model if using TypeScript

import { prismaClient } from '@/server';

export const patientRepository = {
  findAllAsync: async (id: string): Promise<Patient[]> => {
    let patients;
    if (id) {
      patients = await prismaClient.patient.findUnique({
        where: {
          id: id,
        },
      });
    } else {
      patients = await prismaClient.patient.findMany();
    }
    return patients;
  },
  findByIdAsync: async (id: string): Promise<Patient | null> => {
    return await prismaClient.patient.findUnique({
      where: { id: id },
    });
  },
  updateByIdAsync: async (id: string, parsedData: any): Promise<Patient | null> => {
    return await prismaClient.patient.update({
      where: { id },
      data: parsedData,
    });
  },
  deleteByIdAsync: async (id: string): Promise<Patient | null> => {
    return await prismaClient.patient.delete({
      where: { id },
    });
  },
  createAsync: async (
    firstName: string,
    lastName: string,
    DOB: string,
    gender: string,
    address: string,
    phone: string,
    createdById: string
  ): Promise<Patient | null> => {
    return await prismaClient.patient.create({
      data: {
        firstName,
        lastName,
        dob: new Date(DOB),
        gender,
        address,
        phone,
        createdById,
      },
    });
  },
};
