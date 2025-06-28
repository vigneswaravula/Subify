import { User } from '../types';
import { sanitizeInput } from '../utils/security';
import Cookies from 'js-cookie';

class AuthService {
  private readonly TOKEN_KEY = 'subify_token';
  private readonly USER_KEY = 'subify_user';
  
  // Mock users database
  private users: User[] = [
    {
      id: '1',
      email: 'admin@subify.com',
      name: 'Admin User',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      lastLoginAt: '2024-02-15T10:30:00Z',
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          marketing: false
        }
      }
    },
    {
      id: '2',
      email: 'creator@example.com',
      name: 'John Creator',
      role: 'creator',
      status: 'active',
      createdAt: '2024-01-15T00:00:00Z',
      lastLoginAt: '2024-02-14T15:45:00Z',
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          marketing: true
        }
      }
    },
    {
      id: '3',
      email: 'buyer@example.com',
      name: 'Jane Buyer',
      role: 'buyer',
      status: 'active',
      createdAt: '2024-02-01T00:00:00Z',
      lastLoginAt: '2024-02-15T09:20:00Z',
      preferences: {
        theme: 'dark',
        language: 'en',
        notifications: {
          email: true,
          push: false,
          marketing: false
        }
      }
    }
  ];

  async login(email: string, password: string): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const sanitizedEmail = sanitizeInput(email);
    const user = this.users.find(u => u.email === sanitizedEmail);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    if (user.status === 'suspended') {
      throw new Error('Account suspended. Please contact support.');
    }
    
    // Update last login
    user.lastLoginAt = new Date().toISOString();
    
    // Store auth token and user data
    const token = this.generateToken(user.id);
    Cookies.set(this.TOKEN_KEY, token, { expires: 7, secure: true, sameSite: 'strict' });
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    
    return user;
  }

  async register(data: {
    email: string;
    password: string;
    name: string;
    role: 'creator' | 'buyer';
  }): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const sanitizedEmail = sanitizeInput(data.email);
    const sanitizedName = sanitizeInput(data.name);
    
    // Check if user already exists
    if (this.users.find(u => u.email === sanitizedEmail)) {
      throw new Error('User already exists');
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      email: sanitizedEmail,
      name: sanitizedName,
      role: data.role,
      status: data.role === 'creator' ? 'pending' : 'active',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          marketing: false
        }
      }
    };
    
    this.users.push(newUser);
    
    // Store auth token and user data
    const token = this.generateToken(newUser.id);
    Cookies.set(this.TOKEN_KEY, token, { expires: 7, secure: true, sameSite: 'strict' });
    localStorage.setItem(this.USER_KEY, JSON.stringify(newUser));
    
    return newUser;
  }

  async logout(): Promise<void> {
    Cookies.remove(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  async getCurrentUser(): Promise<User | null> {
    const token = Cookies.get(this.TOKEN_KEY);
    const userData = localStorage.getItem(this.USER_KEY);
    
    if (!token || !userData) {
      return null;
    }
    
    try {
      const user = JSON.parse(userData);
      // Verify token is valid
      if (this.verifyToken(token, user.id)) {
        return user;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    
    return null;
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Sanitize inputs
    const sanitizedUpdates = {
      ...updates,
      name: updates.name ? sanitizeInput(updates.name) : undefined,
      email: updates.email ? sanitizeInput(updates.email) : undefined
    };
    
    this.users[userIndex] = { ...this.users[userIndex], ...sanitizedUpdates };
    const updatedUser = this.users[userIndex];
    
    // Update localStorage
    localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
    
    return updatedUser;
  }

  getAllUsers(): User[] {
    return this.users;
  }

  async updateUserRole(userId: string, role: 'admin' | 'creator' | 'buyer'): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex].role = role;
    }
  }

  async suspendUser(userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex].status = 'suspended';
    }
  }

  async activateUser(userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex].status = 'active';
    }
  }

  private generateToken(userId: string): string {
    // In a real app, this would be a proper JWT token
    return btoa(`${userId}:${Date.now()}`);
  }

  private verifyToken(token: string, userId: string): boolean {
    try {
      const decoded = atob(token);
      const [tokenUserId] = decoded.split(':');
      return tokenUserId === userId;
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();