import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

extendZodWithOpenApi(z);

export type Auth = z.infer<typeof UserSchema>;

export const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone_number: z.string(),
  roles: z.string(),
});

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone_number: z.string(),
  roles: z.array(z.string()), // Updated to an array of strings
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const createUserResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  phone_number: z.string(),
});

export const GetAuthSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
