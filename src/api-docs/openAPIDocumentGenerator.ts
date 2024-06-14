import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { authRegistry } from '@/api/auth/authRouter';
import { healthCheckRegistry } from '@/api/healthCheck/healthCheckRouter';
import { inventoryRegistry } from '@/api/inventory/inventoryRouter';
import { recordRegistry } from '@/api/medicalRecords/recordRouter';
import { patientRegistry } from '@/api/patients/patientRouter';
import { prescriptionRegistry } from '@/api/prescriptions/prescriptionRouter';
import { managementRegistry } from '@/api/management/managementRouter';
import { transactionsRegistry } from "@/api/transactions/transactionsRouter";

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([
    healthCheckRegistry,
    authRegistry,
    patientRegistry,
    recordRegistry,
    prescriptionRegistry,
    inventoryRegistry,
    managementRegistry,
    transactionsRegistry,
  ]);
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Swagger API',
    },
    externalDocs: {
      description: "E-health backend API's",
      url: '/swagger.json',
    },
  });
}
