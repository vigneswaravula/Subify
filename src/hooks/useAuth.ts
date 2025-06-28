import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { showToast } from '../components/ui/Toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await authService.login(email, password);
      setUser(user);
      setIsAuthenticated(true);
      showToast.success('Welcome back!');
      return user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      showToast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    name: string;
    role: 'creator' | 'buyer';
  }) => {
    setIsLoading(true);
    try {
      const user = await authService.register(data);
      setUser(user);
      setIsAuthenticated(true);
      showToast.success('Account created successfully!');
      return user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      showToast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      showToast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = await authService.updateProfile(user.id, updates);
      setUser(updatedUser);
      showToast.success('Profile updated successfully');
      return updatedUser;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Update failed';
      showToast.error(message);
      throw error;
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    checkAuth
  };
}