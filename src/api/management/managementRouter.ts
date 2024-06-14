import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';

import { createUserResponseSchema, createUserSchema, UserSchema } from '@/api/management/managementSchema';
import { managementService } from '@/api/management/managementService';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { authorize } from '@/common/middleware/authMiddleware';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

export const managementRegistry = new OpenAPIRegistry();

managementRegistry.register('management', UserSchema);

const bearerAuth = managementRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});
export const managementRouter: Router = (() => {
  const router = express.Router();
  managementRegistry.registerPath({
    method: 'get',
    path: '/management/users',
    tags: ['management'],
    request: {},
    security: [{ [bearerAuth.name]: [] }],
    responses: createApiResponse(UserSchema, 'Success'),
  });

  router.get('/users', async (req: Request, res: Response) => {
    const serviceResponse = await managementService.findAll();
    handleServiceResponse(serviceResponse, res);
  });

  managementRegistry.registerPath({
    method: 'post',
    path: '/management/users',
    request: {
      body: {
        content: {
          'application/json': {
            schema: createUserSchema,
          },
        },
      },
    },
    security: [{ [bearerAuth.name]: [] }],
    tags: ['management'],
    responses: createApiResponse(createUserResponseSchema, 'Success'),
  });

  router.post('/users', authorize(['ADMIN']), async (req: Request, res: Response) => {
    const { name, email, phone_number, roles } = req.body;
    const serviceResponse = await managementService.create(name, email, phone_number, roles);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
