import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { GetInventorySchema, inventoryParamsSchema, InventorySchema } from '@/api/inventory/inventorySchema';
import { inventoryService } from '@/api/inventory/inventoryService';
import { patientRegistry } from '@/api/patients/patientRouter';
import { GetPatientSchema } from '@/api/patients/patientSchema';
import { prescriptionService } from '@/api/prescriptions/prescriptionService';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

export const inventoryRegistry = new OpenAPIRegistry();

inventoryRegistry.register('Inventory', InventorySchema);

const bearerAuth = inventoryRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

export const inventoryRouter: Router = (() => {
  const router = express.Router();

  inventoryRegistry.registerPath({
    method: 'get',
    path: '/inventory',
    request: { query: GetInventorySchema.shape.params },
    security: [{ [bearerAuth.name]: [] }],
    tags: ['Inventory'],
    responses: createApiResponse(z.array(InventorySchema), 'Success'),
  });

  router.get('/', async (req: Request, res: Response) => {
    const { id, name } = req.query;
    const serviceResponse = await inventoryService.findAll(id, name);
    handleServiceResponse(serviceResponse, res);
  });

  inventoryRegistry.registerPath({
    method: 'post',
    path: '/inventory',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: InventorySchema,
          },
        },
      },
    },
    tags: ['Inventory'],
    responses: createApiResponse(InventorySchema, 'Success'),
  });

  router.post('/', async (req: Request, res: Response) => {
    const { name, description, quantity, price } = req.body;
    const createdById = req.user._id;
    const serviceResponse = await inventoryService.create(name, description, quantity, createdById, price);
    handleServiceResponse(serviceResponse, res);
  });

  inventoryRegistry.registerPath({
    method: 'put',
    path: '/inventory/{id}',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: inventoryParamsSchema.shape.params,
      body: {
        content: {
          'application/json': {
            schema: InventorySchema,
          },
        },
      },
    },
    tags: ['Inventory'],
    responses: createApiResponse(InventorySchema, 'Success'),
  });

  router.put('/:id', async (req: Request, res: Response) => {
    const drugId = req.params.id;
    const { name, description, quantity, price } = req.body;
    const serviceResponse = await inventoryService.updateById(name, description, quantity, price, drugId);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
