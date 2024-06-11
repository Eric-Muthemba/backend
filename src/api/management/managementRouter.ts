import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import {
  createUserResponseSchema,
  createUserSchema,
  GetmanagementSchema,
  UserSchema,
} from '@/api/management/managementSchema';
import { managementService } from '@/api/management/managementService';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { authorize } from '@/common/middleware/authMiddleware';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

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
    path: '/management/me',
    tags: ['management'],
    request: {},
    security: [{ [bearerAuth.name]: [] }],
    responses: createApiResponse(UserSchema, 'Success'),
  });

  router.get('/me', async (req: Request, res: Response) => {
    const userId = req.user._id;
    console.log(userId);
    const serviceResponse = await managementService.findById(userId);
    handleServiceResponse(serviceResponse, res);
  });

  managementRegistry.registerPath({
    method: 'post',
    path: '/management/invitation',
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

  router.post('/invitation', authorize(['ADMIN']), async (req: Request, res: Response) => {
    const { name, email, phone_number, roles } = req.body;
    const serviceResponse = await managementService.create(name, email, phone_number, roles);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
