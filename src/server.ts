import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';

import { authRouter } from '@/api/auth/authRouter';
import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter';
import { inventoryRouter } from '@/api/inventory/inventoryRouter';
import { recordRouter } from '@/api/medicalRecords/recordRouter';
import { patientRouter } from '@/api/patients/patientRouter';
import { prescriptionRouter } from '@/api/prescriptions/prescriptionRouter';
import { managementRouter } from '@/api/management/managementRouter';
import { openAPIRouter } from '@/api-docs/openAPIRouter';
import { authenticate } from '@/common/middleware/authMiddleware';
import errorHandler from '@/common/middleware/errorHandler';
import rateLimiter from '@/common/middleware/rateLimiter';
import requestLogger from '@/common/middleware/requestLogger';
import { env } from '@/common/utils/envConfig';

const logger = pino({ name: 'server start' });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE']}));
app.use(helmet());
app.use(rateLimiter);
app.use(express.json());

// Request logging
app.use(requestLogger);

// Routes
app.use('/health-check', healthCheckRouter);
app.use('/auth', authRouter);
app.use('/patients', authenticate, patientRouter);
app.use('/medical_records', authenticate, recordRouter);
app.use('/inventory', authenticate, inventoryRouter);
app.use('/prescriptions', authenticate, prescriptionRouter);
app.use('/management', authenticate, managementRouter);


// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export const prismaClient = new PrismaClient({
  log: ['query'],
});

export { app, logger };
