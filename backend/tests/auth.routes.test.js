process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '1h';

const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../src/models/user.model', () => {
  const actual = jest.requireActual('../src/models/user.model');
  return {
    ...actual,
    findByEmail: jest.fn(),
    create: jest.fn(),
  };
});

jest.mock('../src/utils/hashPassword', () => ({
  hashPassword: jest.fn(async () => 'hashed-password'),
  comparePassword: jest.fn(),
}));

const createApp = require('../src/app');
const userModel = require('../src/models/user.model');
const { comparePassword } = require('../src/utils/hashPassword');

const app = createApp();

const sampleUser = {
  id: '11111111-1111-1111-1111-111111111111',
  full_name: 'Ada Lovelace',
  email: 'ada@example.com',
  created_at: '2026-01-01T00:00:00.000Z',
};

describe('auth routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/auth/register creates a user and returns a JWT', async () => {
    userModel.findByEmail.mockResolvedValue(null);
    userModel.create.mockResolvedValue(sampleUser);

    const res = await request(app)
      .post('/api/auth/register')
      .send({ fullName: 'Ada Lovelace', email: 'ada@example.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('ada@example.com');
    expect(res.body.user.password_hash).toBeUndefined();
    expect(res.body.token).toBeTruthy();
    const payload = jwt.verify(res.body.token, 'test-secret');
    expect(payload.id).toBe(sampleUser.id);
  });

  test('POST /api/auth/register returns 409 when email exists', async () => {
    userModel.findByEmail.mockResolvedValue(sampleUser);

    const res = await request(app)
      .post('/api/auth/register')
      .send({ fullName: 'Ada Lovelace', email: 'ada@example.com', password: 'password123' });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe('Email already registered');
  });

  test('POST /api/auth/login returns 401 for bad credentials', async () => {
    userModel.findByEmail.mockResolvedValue(sampleUser);
    comparePassword.mockResolvedValue(false);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ada@example.com', password: 'wrongpass' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  test('POST /api/auth/login returns a token on success', async () => {
    userModel.findByEmail.mockResolvedValue({
      ...sampleUser,
      password_hash: 'hashed-password',
    });
    comparePassword.mockResolvedValue(true);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ada@example.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.password_hash).toBeUndefined();
  });

  test('POST /api/auth/logout documents client-side token discard', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Discard the JWT/i);
  });
});
