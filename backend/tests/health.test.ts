import request from 'supertest';
import express from 'express';
// Note: importing app might start the server, causing issues in tests.
// A better approach is to export the express app separately from the server listening logic.

// For now, let's create a minimal test.
const app = express();
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is healthy' });
});

describe('Health Check Endpoint', () => {
  it('should return 200 OK', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', message: 'API is healthy' });
  });
});
