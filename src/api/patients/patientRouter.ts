import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { GetRecordSchema } from '@/api/medicalRecords/recordsSchema';
import { GetPatientSchema, PatientSchema, updatePatientRequestSchema } from '@/api/patients/patientSchema';
import { patientService } from '@/api/patients/patientService';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

export const patientRegistry = new OpenAPIRegistry();

patientRegistry.register('Patient', PatientSchema);

const bearerAuth = patientRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});
export const patientRouter: Router = (() => {
  const router = express.Router();

  patientRegistry.registerPath({
    method: 'get',
    path: '/patients',
    request: { query: GetPatientSchema.shape.params },
    security: [{ [bearerAuth.name]: [] }],
    tags: ['Patient'],
    responses: createApiResponse(z.array(PatientSchema), 'Success'),
  });

  router.get('/', async (req: Request, res: Response) => {
    const id = req.query.id as string;
    const serviceResponse = await patientService.findAll(id);
    handleServiceResponse(serviceResponse, res);
  });

  patientRegistry.registerPath({
    method: 'post',
    path: '/patients',
    tags: ['Patient'],
    security: [{ [bearerAuth.name]: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: PatientSchema,
          },
        },
      },
    },
    responses: createApiResponse(PatientSchema, 'Success'),
  });

  router.post('/', async (req: Request, res: Response) => {
    const createdById = req.user._id;
    const { firstName, lastName, DOB, gender, address, phone } = req.body;
    const serviceResponse = await patientService.create(firstName, lastName, DOB, gender, address, phone, createdById);
    handleServiceResponse(serviceResponse, res);
  });

  patientRegistry.registerPath({
    method: 'put',
    path: '/patients/{id}',
    tags: ['Patient'],
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: GetPatientSchema.shape.params,
      body: {
        content: {
          'application/json': {
            schema: updatePatientRequestSchema,
          },
        },
      },
    },
    responses: createApiResponse(PatientSchema, 'Success'),
  });

  router.put('/:id', async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const parsedData = PatientSchema.partial().parse(req.body);
    const serviceResponse = await patientService.UpdateById(id, parsedData);
    handleServiceResponse(serviceResponse, res);
  });

  patientRegistry.registerPath({
    method: 'delete',
    path: '/patients/{id}',
    security: [{ [bearerAuth.name]: [] }],
    tags: ['Patient'],
    request: { params: GetPatientSchema.shape.params },
    responses: createApiResponse(PatientSchema, 'Success'),
  });

  router.delete('/:id', validateRequest(GetPatientSchema), async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const serviceResponse = await patientService.deleteById(id);
    handleServiceResponse(serviceResponse, res);
  });
  return router;
})();
