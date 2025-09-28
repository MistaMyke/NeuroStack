import express, { json } from 'express';
import request from 'supertest';

import { registerStaffRoute } from '../src/routes/staff';
import { listContactRequests } from '../src/services/contact/StaffContactService';

jest.mock('../src/services/contact/StaffContactService', () => ({
  listContactRequests: jest.fn().mockResolvedValue([]),
  updateContactRequestStatus: jest.fn().mockResolvedValue({ status: 'RECEIVED' }),
  addContactRequestNote: jest.fn().mockResolvedValue({ id: 'note', body: 'note', staffEmail: 'staff@example.com' }),
}));

describe('Staff routes', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      STAFF_ACCESS_CODE: 'secret',
      STAFF_ALLOWED_EMAILS: 'staff@example.com,placeholder@example.com',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  const buildApp = () => {
    const app = express();
    app.use(json());
    registerStaffRoute(app);
    return app;
  };

  it('rejects requests without proper headers', async () => {
    const app = buildApp();

    const response = await request(app).get('/staff/contact-requests');
    expect(response.status).toBe(403);
  });

  it('lists contact requests when authorized', async () => {
    const app = buildApp();

    const response = await request(app)
      .get('/staff/contact-requests')
      .set('x-staff-email', 'staff@example.com')
      .set('x-staff-access', 'secret');

    expect(response.status).toBe(200);
    expect(listContactRequests).toHaveBeenCalled();
  });
});
