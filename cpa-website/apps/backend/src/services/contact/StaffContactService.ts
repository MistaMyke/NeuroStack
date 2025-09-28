import { prisma } from '@db/prismaClient';
import type { ContactStatus } from '@services/contact/ContactService';

export type ListContactsOptions = {
  status?: ContactStatus | 'ALL';
};

export const listContactRequests = async ({ status = 'ALL' }: ListContactsOptions) => {
  return prisma.contactRequest.findMany({
    where: status === 'ALL' ? undefined : { status },
    orderBy: { createdAt: 'desc' },
    include: {
      notes: {
        orderBy: { createdAt: 'desc' },
      },
    },
    take: 100,
  });
};

export const updateContactRequestStatus = async (id: string, status: ContactStatus) => {
  return prisma.contactRequest.update({
    where: { id },
    data: { status },
  });
};

export const addContactRequestNote = async (
  id: string,
  staffEmail: string,
  body: string,
) => {
  return prisma.contactRequestNote.create({
    data: {
      contactRequestId: id,
      staffEmail,
      body,
    },
  });
};
