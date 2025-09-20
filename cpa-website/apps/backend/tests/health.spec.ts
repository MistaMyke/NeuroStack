import request from 'supertest';

import app from '../src/index.js';

describe('GET /health', () => {
  it('returns ok status payload', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
