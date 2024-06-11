import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { recordService } from '@/api/medicalRecords/recordService';
import { GetRecordSchema, RecordSchema, updateRecordRequestSchema } from '@/api/medicalRecords/recordsSchema';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';
import {PatientSchema} from "@/api/patients/patientSchema";

export const recordRegistry = new OpenAPIRegistry();

recordRegistry.register('Record', RecordSchema);

const bearerAuth = recordRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});
export const recordRouter: Router = (() => {
  const router = express.Router();

  recordRegistry.registerPath({
    method: 'get',
    path: '/medical_records',
    tags: ['Medical record'],
    security: [{ [bearerAuth.name]: [] }],
    request: { query: GetRecordSchema.shape.params },
    responses: createApiResponse(z.array(RecordSchema), 'Success'),
  });

  router.get('/', async (_req: Request, res: Response) => {
    const { id, patientId } = _req.query;
    const serviceResponse = await recordService.findAll(id, patientId);
    handleServiceResponse(serviceResponse, res);
  });

  recordRegistry.registerPath({
    method: 'post',
    path: '/medical_records/{patient_id}',
    request: {
      params: GetRecordSchema.shape.params,
      body: {
        content: {
          'application/json': {
            schema: RecordSchema,
          },
        },
      },
    },
    security: [{ [bearerAuth.name]: [] }],
    tags: ['Medical record'],
    responses: createApiResponse(z.array(RecordSchema), 'Success'),
  });

  router.post('/:patient_id', async (_req: Request, res: Response) => {
    const { notes } = _req.body;
    const patientId = _req.params.patient_id as string;
    const createdById = _req.user._id;


    const serviceResponse = await recordService.create(notes, patientId, createdById);
    handleServiceResponse(serviceResponse, res);
  });

  recordRegistry.registerPath({
    method: 'put',
    path: '/medical_records/{id}',
    request: {
      params: GetRecordSchema.shape.params,
      body: {
        content: {
          'application/json': {
            schema: updateRecordRequestSchema,
          },
        },
      },
    },
    security: [{ [bearerAuth.name]: [] }],
    tags: ['Medical record'],
    responses: createApiResponse(z.array(RecordSchema), 'Success'),
  });

  router.put('/:id', async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const parsedData = updateRecordRequestSchema.parse(req.body);
    const serviceResponse = await recordService.UpdateById(id, parsedData);
    handleServiceResponse(serviceResponse, res);
  });

  recordRegistry.registerPath({
    method: 'delete',
    path: '/medical_records/{id}',
    request: {
      params: GetRecordSchema.shape.params,
    },
    security: [{ [bearerAuth.name]: [] }],
    tags: ['Medical record'],
    responses: createApiResponse(z.array(RecordSchema), 'Success'),
  });

  router.delete('/:id', async (_req: Request, res: Response) => {
    const id = _req.params.id as string;
    const serviceResponse = await recordService.deleteById(id);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
