import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type Auth = z.infer<typeof UserSchema>;

export const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone_number: z.string(),
  roles: z.string(),
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
