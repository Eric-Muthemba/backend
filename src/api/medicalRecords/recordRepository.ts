import { Record } from '@/api/medicalRecords/recordsSchema';
import { prismaClient } from '@/server';

export const recordRepository = {
  findAllAsync: async (id: string | undefined, patientId: string | undefined): Promise<Record[]> => {
    let medicalRecords: Record[] = [];

    try {
      if (id && patientId) {
        // Fetch medical record by both id and patientId
        medicalRecords = await prismaClient.medicalRecord.findMany({
          where: {
            id: id,
            patientId: patientId,
          },
        });
      } else if (id) {
        // Fetch medical record by id only
        medicalRecords = await prismaClient.medicalRecord.findMany({
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
    } catch (error) {
      console.error('Error fetching medical records:', error);
      return [];
    }
  },

  createAsync: async (notes: string, patientId: string, createdById: string): Promise<Record | null> => {
    try {
      const newRecord = await prismaClient.medicalRecord.create({
        data: {
          notes,
          patientId,
          date: new Date(),
          createdById,
        },
      });
      return newRecord;
    } catch (error) {
      console.error('Error creating medical record:', error);
      return null;
    }
  },

  updateByIdAsync: async (id: string, parsedData: Partial<Record>): Promise<Record | null> => {
    try {
      const updatedRecord = await prismaClient.medicalRecord.update({
        where: { id },
        data: parsedData,
      });
      return updatedRecord;
    } catch (error) {
      console.error(`Error updating medical record with id ${id}:`, error);
      return null;
    }
  },

  deleteByIdAsync: async (id: string): Promise<Record | null> => {
    try {
      const deletedRecord = await prismaClient.medicalRecord.delete({
        where: { id },
      });
      return deletedRecord;
    } catch (error) {
      console.error(`Error deleting medical record with id ${id}:`, error);
      return null;
    }
  },
};
