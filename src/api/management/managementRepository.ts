import { User } from '@prisma/client'; // Import User model if using TypeScript
import { hashSync } from 'bcrypt';
import randomstring from 'randomstring';

import { sendMail } from '@/common/utils/send_emails';
import { prismaClient } from '@/server';

export const managementRepository = {
  findFirstAsync: async (email: string): Promise<User | null> => {
    return await prismaClient.user.findFirst({ where: { email } });
  },
  findAllAsync: async (): Promise<User[] | null> => {
    return await prismaClient.user.findMany();
  },
  createAsync: async (name: string, email: string, phone_number: string, roles: any): Promise<User | null> => {
    const password: string = randomstring.generate({ charset: ['alphanumeric'], length: 8 });
    const user = prismaClient.user.create({
      data: {
        name: name,
        email: email,
        password: hashSync(password, 10),
        phone_number: phone_number,
        roles: roles,
      },
    });

    sendMail(
      email,
      'User invitation',
      `You have been invited to join E-health as a ${roles[0]}. Your password is ${password}.`
    );

    return user;
  },
};
