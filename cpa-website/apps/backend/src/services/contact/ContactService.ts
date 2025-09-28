import type { ContactRequest } from '@cpa/shared-types';
import { randomUUID } from 'node:crypto';

import { prisma } from '@db/prismaClient';

export type ContactSubmission = ContactRequest & {
  id: string;
  status: ContactStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type ContactStatus = 'RECEIVED' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';

export interface ContactService {
  submitRequest(request: ContactRequest): Promise<ContactSubmission>;
}

class PrismaContactService implements ContactService {
  async submitRequest(request: ContactRequest): Promise<ContactSubmission> {
    const submission = await prisma.contactRequest.create({
      data: {
        name: request.name,
        email: request.email,
        phone: request.phone,
        reason: request.reason,
        message: request.message,
      },
    });

    return {
      id: submission.id,
      name: submission.name,
      email: submission.email,
      phone: submission.phone ?? undefined,
      reason: submission.reason ?? undefined,
      message: submission.message,
      status: submission.status,
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt,
    };
  }
}

class InMemoryContactService implements ContactService {
  private submissions: ContactSubmission[] = [];

  async submitRequest(request: ContactRequest): Promise<ContactSubmission> {
    const submission: ContactSubmission = {
      id: randomUUID(),
      status: 'RECEIVED',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...request,
    };

    this.submissions.push(submission);

    return submission;
  }

  reset(): void {
    this.submissions = [];
  }

  all(): ContactSubmission[] {
    return this.submissions;
  }
}

const sharedInMemoryService = new InMemoryContactService();

export const createContactService = (): ContactService => {
  const shouldUsePrisma =
    process.env.DATABASE_URL && process.env.NODE_ENV !== 'test';

  if (shouldUsePrisma) {
    return new PrismaContactService();
  }

  return sharedInMemoryService;
};

export const __testUtils = {
  resetInMemoryStore: (): void => sharedInMemoryService.reset(),
  getInMemorySubmissions: (): ContactSubmission[] => sharedInMemoryService.all(),
};
