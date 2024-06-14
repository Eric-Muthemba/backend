import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

const PaymentMethod = z.enum(['MPESA', 'CARD']);

export const TransactionsSchema = z.object({
  id: z.string().uuid(),
  method: PaymentMethod,
  amount: z.number(),
});
export const triggerPaymentSchema = z.object({
  prescriptionId: z.string().uuid(),
  method: PaymentMethod,
  phone_number: z.string().regex(/^(?:0|254)((?:7|1)[0-9]{8})$/, 'Invalid phone number'),
});

const CallbackMetadataItemSchema = z.object({
  Name: z.string(),
  Value: z.union([z.number(), z.string()]),
});

const CallbackMetadataSchema = z.object({
  Item: z.array(CallbackMetadataItemSchema),
});

const StkCallbackSchema = z.object({
  MerchantRequestID: z.string(),
  CheckoutRequestID: z.string(),
  ResultCode: z.number(),
  ResultDesc: z.string(),
  CallbackMetadata: CallbackMetadataSchema,
});

const BodySchema = z.object({
  stkCallback: StkCallbackSchema,
});

export const MpesaSTKPushCallbackSchema = z.object({
  Body: BodySchema,
});
