import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import {
  CreatePrescriptionSchema,
  GetPrescriptionSchema,
  PrescriptionSchema,
  updateParamsPrescriptionSchema,
} from '@/api/prescriptions/prescriptionSchema';
import { prescriptionService } from '@/api/prescriptions/prescriptionService';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';
import { UserRequest } from '@/common/utils/interfaces';

export const prescriptionRegistry = new OpenAPIRegistry();

prescriptionRegistry.register('Prescription', PrescriptionSchema);
const bearerAuth = prescriptionRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});
export const prescriptionRouter: Router = (() => {
  const router = express.Router();

  prescriptionRegistry.registerPath({
    method: 'get',
    path: '/prescriptions',
    request: { query: GetPrescriptionSchema.shape.params },
    security: [{ [bearerAuth.name]: [] }],
    tags: ['Prescription'],
    responses: createApiResponse(z.array(PrescriptionSchema), 'Success'),
  });

  router.get('/', async (req: Request, res: Response) => {
    const { id, medical_record_id } = req.query as { id?: string; medical_record_id?: string };
    const serviceResponse = await prescriptionService.findAll(id, medical_record_id);
    handleServiceResponse(serviceResponse, res);
  });

  prescriptionRegistry.registerPath({
    method: 'post',
    path: '/prescriptions/{medical_record_id}',
    request: {
      params: CreatePrescriptionSchema.shape.params,
      body: {
        content: {
          'application/json': {
            schema: PrescriptionSchema,
          },
        },
      },
    },
    security: [{ [bearerAuth.name]: [] }],
    tags: ['Prescription'],
    responses: createApiResponse(PrescriptionSchema, 'Success'),
  });

  router.post(
    '/:medical_record_id',
    validateRequest(CreatePrescriptionSchema),
    async (req: UserRequest, res: Response) => {
      const { drugs } = req.body;
      const createdById = req.user?._id;
      const medicalRecordId = req.params.medical_record_id as string;
      const serviceResponse = await prescriptionService.create(createdById, medicalRecordId, drugs);
      handleServiceResponse(serviceResponse, res);
    }
  );

  prescriptionRegistry.registerPath({
    method: 'put',
    path: '/prescriptions/{id}/{action}',
    request: {
      params: updateParamsPrescriptionSchema.shape.params,
      body: {
        content: {
          'application/json': {
            schema: PrescriptionSchema,
          },
        },
      },
    },
    security: [{ [bearerAuth.name]: [] }],
    tags: ['Prescription'],
    responses: createApiResponse(PrescriptionSchema, 'Success'),
  });

  router.put('/:id/:action', validateRequest(GetPrescriptionSchema), async (req: UserRequest, res: Response) => {
    const id = req.params.id as string;
    const action = req.params.action as string;
    const createdById = req.user?._id;

    const { drugs } = req.body;

    const serviceResponse = await prescriptionService.updateById(id, action, createdById, drugs);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
