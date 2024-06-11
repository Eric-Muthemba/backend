import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

extendZodWithOpenApi(z);

export type Patient = z.infer<typeof PatientSchema>;
export const PatientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  DOB: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date of birth'),
  gender: z.enum(['male', 'female', 'other']),
  address: z.string().optional(),
  phone: z.string().optional(),
});

export const updatePatientRequestSchema = PatientSchema.partial();
// Input Validation for 'GET users/:id' endpoint
export const GetPatientSchema = z.object({
  params: z.object({ id: z.string().optional() }),
});
