import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { recordService } from '@/api/medicalRecords/recordService';
import { GetRecordSchema, RecordSchema, updateRecordRequestSchema } from '@/api/medicalRecords/recordsSchema';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { UserRequest } from '@/common/utils/interfaces';

export const recordRegistry = new OpenAPIRegistry();

recordRegistry.register('Record', RecordSchema);

const bearerAuth = recordRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

export const recordRouter: Router = (() => {
  const router = express.Router();

  // GET /medical_records
  recordRegistry.registerPath({
    method: 'get',
    path: '/medical_records',
    tags: ['Medical record'],
    security: [{ [bearerAuth.name]: [] }],
    request: { query: GetRecordSchema.shape.params },
    responses: createApiResponse(z.array(RecordSchema), 'Success'),
  });

  router.get('/', async (req: Request, res: Response) => {
    const { id, patientId } = req.query as { id?: string; patientId?: string };
    const serviceResponse = await recordService.findAll(id, patientId);
    handleServiceResponse(serviceResponse, res);
  });

  // POST /medical_records/:patient_id
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
    responses: createApiResponse(RecordSchema, 'Success'),
  });

  router.post('/:patient_id', async (req: UserRequest, res: Response) => {
    const { notes } = req.body as { notes: string };
    const { patient_id } = req.params;
    const createdById = req.user?._id;

    const serviceResponse = await recordService.create(notes, patient_id, createdById);
    handleServiceResponse(serviceResponse, res);
  });

  // PUT /medical_records/:id
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
    responses: createApiResponse(RecordSchema, 'Success'),
  });

  router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const parsedData = updateRecordRequestSchema.parse(req.body);
    const serviceResponse = await recordService.updateById(id, parsedData);
    handleServiceResponse(serviceResponse, res);
  });

  // DELETE /medical_records/:id
  recordRegistry.registerPath({
    method: 'delete',
    path: '/medical_records/{id}',
    request: {
      params: GetRecordSchema.shape.params,
    },
    security: [{ [bearerAuth.name]: [] }],
    tags: ['Medical record'],
    responses: createApiResponse(RecordSchema, 'Success'),
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await recordService.deleteById(id);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
