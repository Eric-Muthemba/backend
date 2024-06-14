import { Patient } from '@prisma/client';

import { prismaClient } from '@/server';

export const patientRepository = {
  createAsync: async (
    firstName: string,
    lastName: string,
    DOB: string,
    gender: string,
    address: string,
    phone: string,
    createdById: string
  ): Promise<Patient | null> => {
    try {
      const patient = await prismaClient.patient.create({
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
      return patient;
    } catch (error) {
      console.error(`Error creating patient: ${error}`);
      return null;
    }
  },

  deleteByIdAsync: async (id: string): Promise<Patient | null> => {
    try {
      const patient = await prismaClient.patient.delete({
        where: { id },
      });
      return patient;
    } catch (error) {
      console.error(`Error deleting patient with id ${id}: ${error}`);
      return null;
    }
  },

  findAllAsync: async (id: string | null): Promise<Patient[]> => {
    try {
      let patients: Patient[] | [];
      if (id) {
        patients = await prismaClient.patient.findMany({ where: { id } });
      } else {
        patients = await prismaClient.patient.findMany();
      }
      return patients;
    } catch (error) {
      console.error(`Error fetching all patients: ${error}`);
      return [];
    }
  },

  findByIdAsync: async (id: string): Promise<Patient | null> => {
    try {
      const patient = await prismaClient.patient.findUnique({
        where: { id },
      });
      return patient;
    } catch (error) {
      console.error(`Error fetching patient with id ${id}: ${error}`);
      return null;
    }
  },

  updateByIdAsync: async (id: string, parsedData: Partial<Patient>): Promise<Patient | null> => {
    try {
      const patient = await prismaClient.patient.update({
        where: { id },
        data: parsedData,
      });
      return patient;
    } catch (error) {
      console.error(`Error updating patient with id ${id}: ${error}`);
      return null;
    }
  },
};
