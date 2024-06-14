import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';

import { createUserResponseSchema, loginUserSchema, UserSchema } from '@/api/auth/authSchema';
import { authService } from '@/api/auth/authService';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

export const authRegistry = new OpenAPIRegistry();

authRegistry.register('Auth', UserSchema);

export const authRouter: Router = (() => {
  const router = express.Router();

  authRegistry.registerPath({
    method: 'post',
    path: '/auth/login',
    request: {
      body: {
        content: {
          'application/json': {
            schema: loginUserSchema,
          },
        },
      },
    },
    tags: ['Auth'],
    responses: createApiResponse(createUserResponseSchema, 'Success'),
  });

  router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const serviceResponse = await authService.login(email, password);
    handleServiceResponse(serviceResponse, res);
  });
  return router;
})();
