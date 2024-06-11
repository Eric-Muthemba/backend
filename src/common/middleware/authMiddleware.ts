import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { string } from 'zod';

import { env } from '@/common/utils/envConfig'; // Ensure prismaClient is correctly imported

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const token_blocks = token.split(' ');
    const jwtSecret = env.JWT_SECRET || '';
    const decoded = jwt.verify(token_blocks[token_blocks.length - 1], jwtSecret) as JwtPayload;
    if (!decoded || !decoded.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const { userId, roles } = decoded;
    req.user = { _id: userId, roles: roles };
    next();
  } catch (e) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
};

const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRoles = req.user?.roles;

    if (!userRoles || !userRoles.some((role: string) => allowedRoles.includes(role))) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
};

export { authenticate, authorize };
