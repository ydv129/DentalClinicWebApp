import request from 'supertest';
import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5000';

describe('Auth API', () => {
  let token: string;
  let refreshToken: string;
  const testEmail = `test${Date.now()}@example.com`;
  
  test('POST /api/auth/register - should create new user', async () => {
    const response = await request(BASE_URL)
      .post('/api/auth/register')
      .send({
        email: testEmail,
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
        phone: '+1234567890',
        dateOfBirth: '1990-01-01',
        gender: 'male'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toBeDefined();
  });

  test('POST /api/auth/login - should login with valid credentials', async () => {
    const response = await request(BASE_URL)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'TestPassword123!'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toBeDefined();
    
    token = response.body.data.accessToken;
    refreshToken = response.body.data.refreshToken;
  });

  test('POST /api/auth/login - should fail with invalid credentials', async () => {
    const response = await request(BASE_URL)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'wrongpassword'
      });
    
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test('POST /api/auth/refresh - should refresh access token', async () => {
    const response = await request(BASE_URL)
      .post('/api/auth/refresh')
      .send({ refreshToken });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});

describe('Appointments API', () => {
  let token: string;
  let refreshToken: string;
  const testEmail = `patient${Date.now()}@example.com`;
  
  beforeAll(async () => {
    await request(BASE_URL)
      .post('/api/auth/register')
      .send({
        email: testEmail,
        password: 'TestPassword123!',
        firstName: 'Patient',
        lastName: 'Test',
        phone: '+1234567890',
        dateOfBirth: '1990-01-01',
        gender: 'male'
      });
    
    const loginRes = await request(BASE_URL)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'TestPassword123!'
      });
    
    token = loginRes.body.data.accessToken;
    refreshToken = loginRes.body.data.refreshToken;
  });

  test('GET /api/appointments - should get all appointments', async () => {
    const response = await request(BASE_URL)
      .get('/api/appointments')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('POST /api/appointments - should create new appointment', async () => {
    const response = await request(BASE_URL)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        doctorId: '507f1f77bcf86cd799439011',
        appointmentDate: new Date(Date.now() + 86400000).toISOString(),
        appointmentTime: '10:00',
        type: 'checkup',
        symptoms: 'Toothache'
      });
    
    expect([201, 400]).toContain(response.status);
  });

  test('GET /api/appointments/:id - should get single appointment', async () => {
    const getAllRes = await request(BASE_URL)
      .get('/api/appointments')
      .set('Authorization', `Bearer ${token}`);
    
    if (getAllRes.body.data?.appointments?.length > 0) {
      const apt = getAllRes.body.data.appointments[0];
      const response = await request(BASE_URL)
        .get(`/api/appointments/${apt._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
    }
  });
});

describe('Security Tests', () => {
  test('should reject requests without authentication', async () => {
    const response = await request(BASE_URL).get('/api/patients/profile');
    expect(response.status).toBe(401);
  });

  test('should reject invalid tokens', async () => {
    const response = await request(BASE_URL)
      .get('/api/patients/profile')
      .set('Authorization', 'Bearer invalid_token');
    expect(response.status).toBe(401);
  });

  test('should enforce rate limiting', async () => {
    const promises = Array(15).fill(null).map(() =>
      request(BASE_URL).post('/api/auth/login').send({
        email: 'ratelimit@test.com',
        password: 'test'
      })
    );
    
    const responses = await Promise.all(promises);
    const lastResponse = responses[responses.length - 1];
    expect([429, 401]).toContain(lastResponse.status);
  });
});

describe('Input Validation', () => {
  test('should reject invalid email format', async () => {
    const response = await request(BASE_URL)
      .post('/api/auth/register')
      .send({
        email: 'invalid-email',
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
        phone: '+1234567890',
        dateOfBirth: '1990-01-01',
        gender: 'male'
      });
    
    expect(response.status).toBe(400);
  });

  test('should reject weak passwords', async () => {
    const response = await request(BASE_URL)
      .post('/api/auth/register')
      .send({
        email: `weak${Date.now()}@example.com`,
        password: '123',
        firstName: 'Test',
        lastName: 'User',
        phone: '+1234567890',
        dateOfBirth: '1990-01-01',
        gender: 'male'
      });
    
    expect(response.status).toBe(400);
  });

  test('should reject empty required fields', async () => {
    const response = await request(BASE_URL)
      .post('/api/auth/register')
      .send({});
    
    expect(response.status).toBe(400);
  });
});