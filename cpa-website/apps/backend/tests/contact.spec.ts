import express, { json } from 'express';
import request from 'supertest';

import app from '../src/index';
import { registerContactRoute } from '../src/routes/contact';
import { __testUtils } from '../src/services/contact/ContactService';

describe('POST /contact', () => {
  beforeEach(() => {
    __testUtils.resetInMemoryStore();
  });

  it('accepts valid payloads and stores submission metadata', async () => {
    const response = await request(app).post('/contact').send({
      name: 'Jamie Client',
      email: 'jamie@example.com',
      phone: '+1 (716) 555-0199',
      reason: 'Business Taxes',
      message: 'Looking to schedule a tax planning session.',
    });

    expect(response.status).toBe(202);
    expect(response.body).toEqual({ status: 'received' });

    const submissions = __testUtils.getInMemorySubmissions();
    expect(submissions).toHaveLength(1);
    expect(submissions[0]).toMatchObject({
      name: 'Jamie Client',
      email: 'jamie@example.com',
      phone: '+1 (716) 555-0199',
      reason: 'Business Taxes',
      message: 'Looking to schedule a tax planning session.',
    });
    expect(submissions[0].createdAt instanceof Date).toBe(true);
  });

  it('rejects invalid payloads with field errors', async () => {
    const response = await request(app).post('/contact').send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('invalid_request');

    const submissions = __testUtils.getInMemorySubmissions();
    expect(submissions).toHaveLength(0);
  });

  it('validates phone formatting when provided', async () => {
    const response = await request(app).post('/contact').send({
      name: 'Jamie Client',
      email: 'jamie@example.com',
      phone: 'invalid phone',
      message: 'Checking phone validation behaviour.',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('invalid_request');
    expect(response.body.fieldErrors?.phone?.[0]).toBeDefined();
  });

  it('invokes the notifier when submission succeeds', async () => {
    const mockSubmission = {
      id: 'test-id',
      name: 'Taylor Tester',
      email: 'taylor@example.com',
      phone: undefined,
      reason: undefined,
      message: 'Checking notifier',
      status: 'RECEIVED' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const contactService = {
      submitRequest: jest.fn().mockResolvedValue(mockSubmission),
    };

    const notifier = {
      sendNewContactNotification: jest.fn().mockResolvedValue(undefined),
    };

    const testApp = express();
    testApp.use(json());
    registerContactRoute(testApp, { contactService, notifier });

    const response = await request(testApp).post('/contact').send({
      name: 'Taylor Tester',
      email: 'taylor@example.com',
      message: 'Checking notifier',
    });

    expect(response.status).toBe(202);
    expect(contactService.submitRequest).toHaveBeenCalledTimes(1);
    expect(notifier.sendNewContactNotification).toHaveBeenCalledWith(mockSubmission);
  });
});
