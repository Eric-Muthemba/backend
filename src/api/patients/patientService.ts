import { StatusCodes } from 'http-status-codes';

import { patientRepository } from '@/api/patients/patientRepository';
import { Patient } from '@/api/patients/patientSchema';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

export const patientService = {
  findAll: async (id: string): Promise<ServiceResponse<Patient[] | null>> => {
    try {
      const patients = await patientRepository.findAllAsync(id);
      if (!patients || patients.length === 0) {
        return new ServiceResponse(ResponseStatus.Success, 'No Patients found', [], StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Patient[]>(ResponseStatus.Success, 'Patients found', patients, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all patients: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  deleteById: async (id: string): Promise<ServiceResponse<Patient | null>> => {
    try {
      const patient = await patientRepository.deleteByIdAsync(id);
      if (!patient) {
        return new ServiceResponse<Patient>(ResponseStatus.Success, `No Patient with id ${id} found`, null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Patient>(ResponseStatus.Success, 'Patient deleted', patient, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error deleting Patient with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  UpdateById: async (id: string, parsedData: Partial<Patient>): Promise<ServiceResponse<Patient | null>> => {
    try {
      const patient = await patientRepository.findByIdAsync(id);
      if (!patient) {
        return new ServiceResponse<Patient>(ResponseStatus.Success, `No Patient with id ${id} found`, null, StatusCodes.NOT_FOUND);
      }
      await patientRepository.updateByIdAsync(id, parsedData);
      return new ServiceResponse<Patient>(ResponseStatus.Success, 'Patient updated', null, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error updating Patient with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  create: async (
    firstName: string,
    lastName: string,
    DOB: string,
    gender: string,
    address: string,
    phone: string,
    createdById: any
  ): Promise<ServiceResponse<Patient | null>> => {
    try {
      const patient = await patientRepository.createAsync(firstName, lastName, DOB, gender, address, phone, createdById);
      return new ServiceResponse<Patient>(ResponseStatus.Success, 'Patient created', patient, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error creating Patient: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
