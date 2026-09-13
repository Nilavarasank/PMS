process.env.JWT_SECRET = 'test-secret';

const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../src/models/project.model', () => {
  const actual = jest.requireActual('../src/models/project.model');
  return {
    ...actual,
    findById: jest.fn(),
    listForUser: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
});

const createApp = require('../src/app');
const projectModel = require('../src/models/project.model');

const app = createApp();

const userA = { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', email: 'a@example.com' };
const userB = { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', email: 'b@example.com' };

function tokenFor(user) {
  return jwt.sign(user, 'test-secret', { expiresIn: '1h' });
}

const projectA = {
  id: '11111111-1111-4111-8111-111111111111',
  user_id: userA.id,
  name: 'Website',
  description: 'Rebuild',
  status: 'In Progress',
  start_date: '2026-01-01',
  end_date: '2026-02-01',
  created_at: '2026-01-01T00:00:00.000Z',
};

describe('project routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('rejects unauthenticated access', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(401);
  });

  test('lists only the authenticated user projects', async () => {
    projectModel.listForUser.mockResolvedValue({ rows: [projectA], total: 1 });

    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${tokenFor(userA)}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.total).toBe(1);
    expect(projectModel.listForUser).toHaveBeenCalledWith(userA.id, expect.any(Object));
  });

  test('returns 403 when another user requests a project', async () => {
    projectModel.findById.mockResolvedValue(projectA);

    const res = await request(app)
      .get(`/api/projects/${projectA.id}`)
      .set('Authorization', `Bearer ${tokenFor(userB)}`);

    expect(res.status).toBe(403);
  });

  test('creates a project for the current user', async () => {
    projectModel.create.mockResolvedValue(projectA);

    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${tokenFor(userA)}`)
      .send({ name: 'Website', status: 'In Progress', startDate: '2026-01-01', endDate: '2026-02-01' });

    expect(res.status).toBe(201);
    expect(projectModel.create).toHaveBeenCalledWith(userA.id, expect.objectContaining({ name: 'Website' }));
    expect(res.body.name).toBe('Website');
  });

  test('rejects invalid status with 400', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${tokenFor(userA)}`)
      .send({ name: 'Website', status: 'Done' });

    expect(res.status).toBe(400);
  });
});
