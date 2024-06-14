import { StatusCodes } from 'http-status-codes';

import { recordRepository } from '@/api/medicalRecords/recordRepository';
import { Record } from '@/api/medicalRecords/recordsSchema';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

export const recordService = {
  findAll: async (id: string | undefined, patientId: string | undefined): Promise<ServiceResponse<Record[] | null>> => {
    try {
      const records = await recordRepository.findAllAsync(id, patientId);
      if (!records || records.length === 0) {
        return new ServiceResponse(ResponseStatus.Success, 'No records found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Record[]>(ResponseStatus.Success, 'Records found', records, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all records: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  create: async (notes: string, patientId: string, createdById: any): Promise<ServiceResponse<Record | null>> => {
    try {
      const medicalRecord = await recordRepository.createAsync(notes, patientId, createdById);
      return new ServiceResponse<Record>(
        ResponseStatus.Success,
        'Medical record created',
        medicalRecord,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error creating medical record: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  updateById: async (id: string, parsedData: Partial<Record>): Promise<ServiceResponse<Record | null>> => {
    try {
      const updatedRecord = await recordRepository.updateByIdAsync(id, parsedData);
      if (!updatedRecord) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          `Record with id ${id} not found`,
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return new ServiceResponse<Record>(ResponseStatus.Success, 'Record updated', updatedRecord, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error updating record with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  deleteById: async (id: string): Promise<ServiceResponse<Record | null>> => {
    try {
      const deletedRecord = await recordRepository.deleteByIdAsync(id);
      if (!deletedRecord) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          `Record with id ${id} not found`,
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return new ServiceResponse<Record>(ResponseStatus.Success, 'Record deleted', deletedRecord, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error deleting record with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
