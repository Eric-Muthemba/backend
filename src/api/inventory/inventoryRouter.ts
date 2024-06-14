import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Response, Router } from 'express';
import { z } from 'zod';

import { GetInventorySchema, inventoryParamsSchema, InventorySchema } from '@/api/inventory/inventorySchema';
import { inventoryService } from '@/api/inventory/inventoryService';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { UserRequest } from '@/common/utils/interfaces';

export const inventoryRegistry = new OpenAPIRegistry();

inventoryRegistry.register('Inventory', InventorySchema);

const bearerAuth = inventoryRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

export const inventoryRouter: Router = (() => {
  const router = express.Router();

  // GET /inventory
  inventoryRegistry.registerPath({
    method: 'get',
    path: '/inventory',
    request: { query: GetInventorySchema.shape.params },
    security: [{ [bearerAuth.name]: [] }],
    tags: ['Inventory'],
    responses: createApiResponse(z.array(InventorySchema), 'Success'),
  });

  router.get('/', async (req: UserRequest, res: Response) => {
    const { id, name } = req.query as { id?: string; name?: string };
    const serviceResponse = await inventoryService.findMany(id, name);
    handleServiceResponse(serviceResponse, res);
  });

  // POST /inventory
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

  router.post('/', async (req: UserRequest, res: Response) => {
    const { name, description, quantity, price } = req.body as {
      name: string;
      description: string;
      quantity: number;
      price: number;
    };
    const createdById = req.user?._id;
    const serviceResponse = await inventoryService.create(name, description, quantity, createdById, price);
    handleServiceResponse(serviceResponse, res);
  });

  // PUT /inventory/:id
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

  router.put('/:id', async (req: UserRequest, res: Response) => {
    const drugId = req.params.id as string;
    const { name, description, quantity, price } = req.body as {
      name: string;
      description: string;
      quantity: number;
      price: number;
    };
    const serviceResponse = await inventoryService.updateById(name, description, quantity, price, drugId);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
