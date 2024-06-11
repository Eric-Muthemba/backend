import { MedicalRecord, Patient } from '@prisma/client'; // Import User model if using TypeScript

import { Record } from '@/api/medicalRecords/recordsSchema';
import { prismaClient } from '@/server';
export const records: Record[] = [
  {
    id: 1,
    firstName: 'Alice',
    lastName: 'test',
    dateOfBirth: new Date(),
    gender: 'W',
    age: 23,
    email: 'alice@example.com',
    phone: '0726215805',
    address: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const recordRepository = {
  findAllAsync: async (id: string, patientId: string): Promise<Record[]> => {
    let medicalRecords = '';
    if (id && patientId) {
      // Fetch medical record by both id and patientId
      medicalRecords = await prismaClient.medicalRecord.findMany({
        where: {
          id: parseInt(id as string),
          patientId: parseInt(patientId as string),
        },
      });
    } else if (id) {
      // Fetch medical record by id only
      medicalRecords = await prismaClient.medicalRecord.findUnique({
        where: {
          id: id,
        },
      });
    } else if (patientId) {
      // Fetch medical records by patientId only
      medicalRecords = await prismaClient.medicalRecord.findMany({
        where: {
          patientId: patientId,
        },
      });
    } else {
      // Fetch all medical records if no query params provided
      medicalRecords = await prismaClient.medicalRecord.findMany();
    }

    return medicalRecords;
  },
  createAsync: async (notes: string, patientId: string, createdById: string): Promise<Record | null> => {
    return await prismaClient.medicalRecord.create({
      data: {
        notes,
        patientId,
        date: new Date(),
        createdById,
      },
    });
  },
  updateByIdAsync: async (id: string, parsedData: any): Promise<Record | null> => {
    return await prismaClient.medicalRecord.update({
      where: { id },
      data: parsedData,
    });
  },
  deleteByIdAsync: async (id: string): Promise<Record | null> => {
    return await prismaClient.medicalRecord.delete({
      where: { id },
    });
  },
};
