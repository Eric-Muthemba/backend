import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type Prescription = z.infer<typeof PrescriptionSchema>;

export const DrugSchema = z.object({
  id: z.string(),
  quantity: z.number().int(),
  price: z.number(),
  note: z.string(),
});

export const PrescriptionSchema = z.object({
  drugs: z.array(DrugSchema),
});

// Input Validation for 'GET users/:id' endpoint
export const GetPrescriptionSchema = z.object({
  params: z.object({
    id: z.string().optional(),
    medical_record_id: z.string().optional(),
  }),
});

export const CreatePrescriptionSchema = z.object({
  params: z.object({
    medical_record_id: z.string().optional(),
  }),
});

export const updateParamsPrescriptionSchema = z.object({
  params: z.object({
    id: z.string(),
    action: z.string(),
  }),
});
