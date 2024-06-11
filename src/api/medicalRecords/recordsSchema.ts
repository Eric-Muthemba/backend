import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';
import {PatientSchema} from "@/api/patients/patientSchema";

extendZodWithOpenApi(z);

export type Record = z.infer<typeof RecordSchema>;
export const RecordSchema = z.object({
  notes: z.string(),
});
export const updateRecordRequestSchema = RecordSchema.partial();

// Input Validation for 'GET users/:id' endpoint
export const GetRecordSchema = z.object({
  params: z.object({ id: z.string().optional(), patient_id: z.string().optional() }),
});
