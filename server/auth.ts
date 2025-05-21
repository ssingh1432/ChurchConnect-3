import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { storage } from './storage';
import { insertUserSchema } from '@shared/schema';
import { z } from 'zod';

// JWT Secret - should be in environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || 'church-app-secret-key';
const JWT_EXPIRES_IN = '24h';

// Login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// JWT payload type
export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

// Generate JWT token
export const generateToken = (user: { id: number; email: string; role: string }): string => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = insertUserSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(validatedData.email);
    if (existingUser) {
      res.status(400).json({ message: 'User with this email already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    // Create user with default role "visitor"
    const user = await storage.createUser({ 
      ...validatedData, 
      password: hashedPassword, 
      role: 'visitor' 
    });

    // Generate JWT token
    const token = generateToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    res.status(201).json({ 
      user: userWithoutPassword, 
      token 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
      return;
    }
    res.status(500).json({ message: 'Error creating user' });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    // Find user by email
    const user = await storage.getUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = generateToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(200).json({ 
      user: userWithoutPassword, 
      token 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
      return;
    }
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Middleware to authenticate JWT token
export const authenticate = (req: Request & { user?: JwtPayload }, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to check admin role
export const isAdmin = (req: Request & { user?: JwtPayload }, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }

  next();
};

// Get current user
export const getCurrentUser = async (req: Request & { user?: JwtPayload }, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const user = await storage.getUser(req.user.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user' });
  }
};
