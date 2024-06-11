import { Prescription, prescriptionDrugs } from '@prisma/client'; // Import User model if using TypeScript

import { prismaClient } from '@/server';

export const prescriptionRepository = {
  findAllAsync: async (id: string, medical_record_id: string): Promise<Prescription[]> => {
    let prescriptions;
    if (id && medical_record_id) {
      prescriptions = await prismaClient.prescription.findMany({
        where: {
          id: id,
          medicalRecordId: medical_record_id,
        },
        include: {
          prescriptionDrugs: {
            include: {
              drug: true,
            },
          },
        },
      });
    } else if (medical_record_id) {
      prescriptions = await prismaClient.prescription.findMany({
        where: {
          medicalRecordId: medical_record_id,
        },
        include: {
          prescriptionDrugs: {
            include: {
              drug: true,
            },
          },
        },
      });
    } else if (id) {
      prescriptions = await prismaClient.prescription.findUnique({
        where: {
          id: id,
        },
        include: {
          prescriptionDrugs: {
            include: {
              drug: true,
            },
          },
        },
      });
    } else {
      prescriptions = await prismaClient.prescription.findMany({
        include: {
          prescriptionDrugs: {
            include: {
              drug: true,
            },
          },
        },
      });
    }
    return prescriptions;
  },
  updateByIdAsync: async (id: string, action: string, createdById: string, drugs: any): Promise<Prescription[]> => {
    if (action === 'delete') {
      const prescription_drugs_ids = drugs.map(({ id }) => id);
      await prismaClient.prescriptionDrug.deleteMany({
        where: {
          prescriptionId: id,
          drugId: { in: prescription_drugs_ids },
        },
      });
    } else if (action === 'add') {
       await prismaClient.PrescriptionDrug.createMany({
        data: drugs.map((pd) => ({
            prescriptionId: id,
            drugId: pd.id,
            quantity: pd.quantity,
            sellingPrice: pd.price,
            note: pd.note,
          })),
        })
    }
  },
  createAsync: async (createdById: string, medicalRecordId: string, drugs: any): Promise<Prescription | null> => {
    return await prismaClient.prescription.create({
      data: {
        medicalRecordId,
        prescriptionDrugs: {
          create: drugs.map((pd) => ({
            drugId: pd.id,
            quantity: pd.quantity,
            sellingPrice: pd.price,
            note: pd.note,
          })),
        },
        createdById,
      },
    });
  },
};
