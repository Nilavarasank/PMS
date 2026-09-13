process.env.JWT_SECRET = 'test-secret';

const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../src/models/task.model', () => {
  const actual = jest.requireActual('../src/models/task.model');
  return {
    ...actual,
    findByIdWithOwner: jest.fn(),
    listForUser: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
});

jest.mock('../src/models/project.model', () => {
  const actual = jest.requireActual('../src/models/project.model');
  return {
    ...actual,
    findById: jest.fn(),
  };
});

const createApp = require('../src/app');
const taskModel = require('../src/models/task.model');
const projectModel = require('../src/models/project.model');

const app = createApp();

const userA = { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', email: 'a@example.com' };
const userB = { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', email: 'b@example.com' };
const projectId = '11111111-1111-4111-8111-111111111111';
const taskId = '22222222-2222-4222-8222-222222222222';

function tokenFor(user) {
  return jwt.sign(user, 'test-secret', { expiresIn: '1h' });
}

const ownedTask = {
  id: taskId,
  project_id: projectId,
  user_id: userA.id,
  name: 'Write spec',
  description: null,
  priority: 'High',
  status: 'Pending',
  due_date: '2026-03-01',
  created_at: '2026-01-01T00:00:00.000Z',
};

describe('task routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('rejects unauthenticated access', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(401);
  });

  test('returns 403 when a second user reads another user task', async () => {
    taskModel.findByIdWithOwner.mockResolvedValue(ownedTask);

    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${tokenFor(userB)}`);

    expect(res.status).toBe(403);
  });

  test('prevents creating a task on another user project', async () => {
    projectModel.findById.mockResolvedValue({
      id: projectId,
      user_id: userA.id,
      name: 'Website',
    });

    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${tokenFor(userB)}`)
      .send({ projectId, name: 'Steal this', priority: 'Low', status: 'Pending' });

    expect(res.status).toBe(403);
    expect(taskModel.create).not.toHaveBeenCalled();
  });

  test('creates a task when the project belongs to the current user', async () => {
    projectModel.findById.mockResolvedValue({
      id: projectId,
      user_id: userA.id,
      name: 'Website',
    });
    taskModel.create.mockResolvedValue(ownedTask);

    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${tokenFor(userA)}`)
      .send({ projectId, name: 'Write spec', priority: 'High', status: 'Pending' });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Write spec');
  });
});
