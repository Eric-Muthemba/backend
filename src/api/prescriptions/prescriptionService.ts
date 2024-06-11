import { StatusCodes } from 'http-status-codes';

import { patientRepository } from '@/api/patients/patientRepository';
import { Patient } from '@/api/patients/patientSchema';
import { prescriptionRepository } from '@/api/prescriptions/prescriptionRepository';
import { Prescription } from '@/api/prescriptions/prescriptionSchema';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

export const prescriptionService = {
  // Retrieves all users from the database
  findAll: async (id: string, medical_record_id: string): Promise<ServiceResponse<Prescription[] | null>> => {
    try {
      const prescriptions = await prescriptionRepository.findAllAsync(id, medical_record_id);
      if (!prescriptions || prescriptions.length == 0) {
        return new ServiceResponse(ResponseStatus.Success, 'No prescriptions found', [], StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Prescription[]>(
        ResponseStatus.Success,
        'prescriptions found',
        prescriptions,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error finding all prescriptions: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  updateById: async (id: string, action: string, createdById: string, drugs: any): Promise<ServiceResponse<Prescription[] | null>> => {
    try {
      await prescriptionRepository.updateByIdAsync(id, action, createdById, drugs);
      return new ServiceResponse<Prescription[]>(
        ResponseStatus.Success,
        `prescription ${action}`,
        [],
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error ${action} prescription with id ${id}: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  create: async (
    createdById: string,
    medicalRecordId: string,
    drugs: any
  ): Promise<ServiceResponse<Prescription | null>> => {
    try {
      const prescription = await prescriptionRepository.createAsync(createdById, medicalRecordId, drugs);
      return new ServiceResponse<Prescription>(
        ResponseStatus.Success,
        'Prescription found',
        prescription,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error creating Patient :, ${(ex as Error).message}`;
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
