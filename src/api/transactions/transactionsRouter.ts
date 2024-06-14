import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';

import { MpesaSTKPushCallbackSchema, triggerPaymentSchema } from '@/api/transactions/transactionsSchema';
import { transactionsService } from '@/api/transactions/transactionsService';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import {authenticate} from "@/common/middleware/authMiddleware";

export const transactionsRegistry = new OpenAPIRegistry();

transactionsRegistry.register('Transactions', triggerPaymentSchema);
const bearerAuth = transactionsRegistry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});
export const transactionsRouter: Router = (() => {
  const router = express.Router();

  transactionsRegistry.registerPath({
    method: 'get',
    path: '/transactions',
    security: [{ [bearerAuth.name]: [] }],
    tags: ['Transactions'],
    responses: createApiResponse(triggerPaymentSchema, 'Success'),
  });

  router.get('/', authenticate, async (req: Request, res: Response) => {
    const serviceResponse = await transactionsService.findAll();
    handleServiceResponse(serviceResponse, res);
  });

  transactionsRegistry.registerPath({
    method: 'post',
    path: '/transactions/trigger_payment',
    request: {
      body: {
        content: {
          'application/json': {
            schema: triggerPaymentSchema,
          },
        },
      },
    },
    security: [{ [bearerAuth.name]: [] }],
    tags: ['Transactions'],
    responses: createApiResponse(triggerPaymentSchema, 'Success'),
  });

  router.post('/trigger_payment', authenticate, async (req: Request, res: Response) => {
    const { prescriptionId, method, phone_number } = req.body;
    const serviceResponse = await transactionsService.triggerPayment(prescriptionId, method, phone_number);
    handleServiceResponse(serviceResponse, res);
  });

  transactionsRegistry.registerPath({
    method: 'post',
    path: '/transactions/mpesa_callback/lipa',
    request: {
      body: {
        content: {
          'application/json': {
            schema: MpesaSTKPushCallbackSchema,
          },
        },
      },
    },
    tags: ['Transactions'],
    responses: createApiResponse(triggerPaymentSchema, 'Success'),
  });

  router.post('/mpesa_callback/lipa', async (req: Request, res: Response) => {
    const mpesa_response = req.body;
    const serviceResponse = await transactionsService.mpesaPaymentCallback(mpesa_response);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
