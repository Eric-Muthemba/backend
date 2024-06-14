import { User } from '@prisma/client'; // Import User model if using TypeScript
import * as jwt from 'jsonwebtoken';

import { env } from '@/common/utils/envConfig'; // Ensure prismaClient is correctly imported
import { prismaClient } from '@/server';

export const authRepository = {
  findFirstAsync: async (email: string): Promise<User | null> => {
    return await prismaClient.user.findFirst({ where: { email } });
  },
  loginAsync: async (user_id: string, roles: any): Promise<string | null> => {
    return jwt.sign({ userId: user_id, roles: roles }, env.JWT_SECRET);
  },
};
