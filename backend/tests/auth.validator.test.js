const { validationResult } = require('express-validator');
const { registerRules, loginRules } = require('../src/validators/auth.validator');

function runValidators(rules, body) {
  const req = { body, params: {}, query: {} };
  const res = {
    status() { return this; },
    json() { return this; },
  };
  const validators = rules.slice(0, -1);
  return Promise.all(validators.map((rule) => rule.run(req))).then(() => ({
    req,
    result: validationResult(req),
    validate: rules[rules.length - 1],
    res,
  }));
}

describe('auth validators', () => {
  test('register rejects short password and invalid email', async () => {
    const { result } = await runValidators(registerRules, {
      fullName: 'Ada Lovelace',
      email: 'not-an-email',
      password: '123',
    });
    const messages = result.array().map((e) => e.msg);
    expect(messages).toEqual(expect.arrayContaining([
      'Email must be a valid email address',
      'Password must be at least 8 characters',
    ]));
  });

  test('register accepts valid payload', async () => {
    const { result } = await runValidators(registerRules, {
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'password123',
    });
    expect(result.isEmpty()).toBe(true);
  });

  test('login requires email and password', async () => {
    const { result } = await runValidators(loginRules, {});
    const fields = result.array().map((e) => e.path);
    expect(fields).toEqual(expect.arrayContaining(['email', 'password']));
  });
});
