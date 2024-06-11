import { StatusCodes } from 'http-status-codes';

import { recordRepository } from '@/api/medicalRecords/recordRepository';
import { Record } from '@/api/medicalRecords/recordsSchema';
import { patientRepository } from '@/api/patients/patientRepository';
import { Patient } from '@/api/patients/patientSchema';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

export const recordService = {
  // Retrieves all users from the database
  findAll: async (id: string, patientId: string): Promise<ServiceResponse<Record[] | null>> => {
    try {
      const records = await recordRepository.findAllAsync(id, patientId);
      if (!records || records.length === 0) {
        return new ServiceResponse(ResponseStatus.Success, 'No Record found', [], StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Record[]>(ResponseStatus.Success, 'Record found', records, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all records: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  // Retrieves a single user by their ID
  create: async (notes: string, patientId: string, createdById: string): Promise<ServiceResponse<Record | null>> => {
    try {
      const medical_record = await recordRepository.createAsync(notes, patientId, createdById);
      return new ServiceResponse<Record>(
        ResponseStatus.Success,
        'Medical record found',
        medical_record,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error creating Medical record:, ${(ex as Error).message}`;
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  UpdateById: async (id: string, parsedData: any): Promise<ServiceResponse<Patient | null>> => {
    try {
      await recordRepository.updateByIdAsync(id, parsedData);
      return new ServiceResponse<Patient>(ResponseStatus.Success, 'Record updated', null, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error updating Record with id ${id}:, ${(ex as Error).message}`;
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  deleteById: async (id: string): Promise<ServiceResponse<Patient | null>> => {
    try {
      await recordRepository.deleteByIdAsync(id);
      return new ServiceResponse<Patient>(ResponseStatus.Success, 'Record deleted', null, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error deleting Record with id ${id}:, ${(ex as Error).message}`;
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },



};
