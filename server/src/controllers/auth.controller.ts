import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { ApiResponse } from '@shared/types/index.js';
import { pool } from '../config/database.js';
import { AuthRequest } from '../middleware/auth.js';

const SALT_ROUNDS = 10;

interface RegisterRequest {
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface UserResponse {
  id: string;
  email: string;
  createdAt: string;
}

interface AuthResponse {
  user: UserResponse;
  token: string;
}

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as RegisterRequest;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Email already registered',
      };
      return res.status(409).json(response);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash)
       VALUES ($1, $2)
       RETURNING id, email, created_at`,
      [email, passwordHash]
    );

    const user = result.rows[0];

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined');
      const response: ApiResponse<never> = {
        success: false,
        error: 'Server configuration error',
      };
      return res.status(500).json(response);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
    );

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const responseData: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
      },
      token,
    };

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: responseData,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error registering user:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to register user',
    };
    res.status(500).json(response);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginRequest;

    // Find user
    const result = await pool.query(
      'SELECT id, email, password_hash, created_at FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Invalid email or password',
      };
      return res.status(401).json(response);
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Invalid email or password',
      };
      return res.status(401).json(response);
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined');
      const response: ApiResponse<never> = {
        success: false,
        error: 'Server configuration error',
      };
      return res.status(500).json(response);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
    );

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const responseData: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
      },
      token,
    };

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: responseData,
    };

    res.json(response);
  } catch (error) {
    console.error('Error logging in:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to login',
    };
    res.status(500).json(response);
  }
};

export const logout = async (_req: Request, res: Response) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Logged out successfully' },
    };

    res.json(response);
  } catch (error) {
    console.error('Error logging out:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to logout',
    };
    res.status(500).json(response);
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'User not authenticated',
      };
      return res.status(401).json(response);
    }

    // Get user data
    const result = await pool.query(
      'SELECT id, email, created_at FROM users WHERE id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'User not found',
      };
      return res.status(404).json(response);
    }

    const user = result.rows[0];

    const userData: UserResponse = {
      id: user.id,
      email: user.email,
      createdAt: user.created_at,
    };

    const response: ApiResponse<UserResponse> = {
      success: true,
      data: userData,
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting current user:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to get user',
    };
    res.status(500).json(response);
  }
};
