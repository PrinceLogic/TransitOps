import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'transitops_super_secret_key_12345', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'driver',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed initial demo users
// @route   POST /api/auth/seed
// @access  Public
export const seedDemoUsers = async (req, res) => {
  try {
    const demoUsers = [
      {
        name: 'Frank Manager',
        email: 'manager@transitops.com',
        password: 'password123',
        role: 'fleet-manager',
      },
      {
        name: 'Dan Driver',
        email: 'driver@transitops.com',
        password: 'password123',
        role: 'driver',
      },
      {
        name: 'Sarah Safety',
        email: 'safety@transitops.com',
        password: 'password123',
        role: 'safety-officer',
      },
      {
        name: 'Fiona Financial',
        email: 'finance@transitops.com',
        password: 'password123',
        role: 'financial-analyst',
      },
    ];

    const users = [];

    for (const u of demoUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        const created = await User.create(u);
        users.push(created);
      } else {
        users.push(exists);
      }
    }

    res.status(200).json({
      message: 'Demo users seeded successfully',
      users: users.map(u => ({ email: u.email, role: u.role })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
