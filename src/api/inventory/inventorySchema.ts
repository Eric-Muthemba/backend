import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type Inventory = z.infer<typeof InventorySchema>;
export const InventorySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  quantity: z.number().int(),
  price: z.number(),
});

// Input Validation for 'GET users/:id' endpoint
export const GetInventorySchema = z.object({
  params: z.object({ id: z.string().optional(), name: z.string().optional() }),
});

export const inventoryParamsSchema = z.object({
  params: z.object({ id: z.string().optional()}),
});