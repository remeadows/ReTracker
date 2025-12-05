import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { ApiResponse } from '@shared/types/index.js';

export interface AuthRequest extends Request {
  userId?: string;
}

interface JWTPayload {
  userId: string;
  email: string;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header or cookies
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : req.cookies?.token;

    if (!token) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Authentication required',
      };
      return res.status(401).json(response);
    }

    // Verify token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined in environment variables');
      const response: ApiResponse<never> = {
        success: false,
        error: 'Server configuration error',
      };
      return res.status(500).json(response);
    }

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

    // Attach user ID to request
    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Token expired',
      };
      return res.status(401).json(response);
    }

    if (error instanceof jwt.JsonWebTokenError) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Invalid token',
      };
      return res.status(401).json(response);
    }

    const response: ApiResponse<never> = {
      success: false,
      error: 'Authentication failed',
    };
    return res.status(401).json(response);
  }
};
