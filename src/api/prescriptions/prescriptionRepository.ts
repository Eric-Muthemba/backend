import { Prescription } from '@prisma/client';

import { prismaClient } from '@/server';

export const prescriptionRepository = {
  findAllAsync: async (id?: string, medical_record_id?: string): Promise<Prescription[]> => {
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

    return [] || prescriptions;
  },

  updateByIdAsync: async (id: string, action: string, createdById: string, drugs: any): Promise<void> => {
    if (action === 'delete') {
      const prescription_drugs_ids = drugs.map((pd: any) => pd.id);
      await prismaClient.prescriptionDrug.deleteMany({
        where: {
          prescriptionId: id,
          drugId: { in: prescription_drugs_ids },
        },
      });
    } else if (action === 'add') {
      await prismaClient.prescriptionDrug.createMany({
        data: drugs.map((pd: any) => ({
          prescriptionId: id,
          drugId: pd.id,
          quantity: pd.quantity,
          sellingPrice: pd.price,
          note: pd.note,
        })),
      });
    }
  },

  createAsync: async (createdById: string, medicalRecordId: string, drugs: any): Promise<Prescription | null> => {
    const prescription = await prismaClient.prescription.create({
      data: {
        medicalRecordId: medicalRecordId,
        prescriptionDrugs: {
          create: drugs.map((pd: any) => ({
            drugId: pd.id,
            quantity: pd.quantity,
            sellingPrice: pd.price,
            note: pd.note,
          })),
        },
        createdById,
      },
      include: {
        prescriptionDrugs: {
          include: {
            drug: true,
          },
        },
      },
    });

    return prescription;
  },

  findUniqueAsync: async (prescriptionId: string): Promise<Prescription | null> => {
    const prescription = await prismaClient.prescription.findUnique({
      where: { id: prescriptionId },
      include: {
        prescriptionDrugs: {
          include: {
            drug: true,
          },
        },
      },
    });

    return prescription;
  },
};
