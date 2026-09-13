const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const AppError = require('../utils/AppError');

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
}

async function register(req, res, next) {
  try {
    const { fullName, email, password } = req.body;
    const existing = await userModel.findByEmail(email);
    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    const passwordHash = await hashPassword(password);
    const user = await userModel.create({ fullName, email, passwordHash });
    const token = signToken(user);

    res.status(201).json({
      user: userModel.toPublic(user),
      token,
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const matches = await comparePassword(password, user.password_hash);
    if (!matches) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = signToken(user);
    res.json({
      user: userModel.toPublic(user),
      token,
    });
  } catch (err) {
    next(err);
  }
}

function logout(req, res) {
  res.json({
    message: 'Logged out. Discard the JWT on the client; this API is stateless and does not store sessions.',
  });
}

module.exports = {
  register,
  login,
  logout,
};
