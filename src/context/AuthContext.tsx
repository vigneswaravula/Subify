import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { showToast } from '../components/ui/Toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'creator' | 'buyer') => Promise<void>;
  logout: () => void;
  updateUserRole: (userId: string, role: 'admin' | 'creator' | 'buyer') => Promise<void>;
  suspendUser: (userId: string) => Promise<void>;
  activateUser: (userId: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Enhanced mock users with more variety and realistic data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@subify.com',
    name: 'Admin User',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-02-15T10:30:00Z',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Platform administrator with 10+ years of experience in SaaS management.',
    company: 'Subify Inc.',
    website: 'https://subify.com'
  },
  {
    id: '2',
    email: 'creator@example.com',
    name: 'John Creator',
    role: 'creator',
    status: 'active',
    createdAt: '2024-01-15T00:00:00Z',
    lastLoginAt: '2024-02-14T15:45:00Z',
    phone: '+1 (555) 234-5678',
    location: 'Austin, TX',
    bio: 'Full-stack developer and entrepreneur building productivity tools.',
    company: 'CreatorTech Solutions',
    website: 'https://johndev.com'
  },
  {
    id: '3',
    email: 'buyer@example.com',
    name: 'Jane Buyer',
    role: 'buyer',
    status: 'active',
    createdAt: '2024-02-01T00:00:00Z',
    lastLoginAt: '2024-02-15T09:20:00Z',
    phone: '+1 (555) 345-6789',
    location: 'New York, NY',
    bio: 'Marketing manager always looking for tools to improve team productivity.',
    company: 'Digital Marketing Pro',
    website: 'https://digitalmarketingpro.com'
  },
  {
    id: '4',
    email: 'creator2@example.com',
    name: 'Sarah Designer',
    role: 'creator',
    status: 'active',
    createdAt: '2024-01-20T00:00:00Z',
    lastLoginAt: '2024-02-13T14:15:00Z',
    phone: '+1 (555) 456-7890',
    location: 'Los Angeles, CA',
    bio: 'UI/UX designer passionate about creating beautiful and functional design systems.',
    company: 'Design Studio Plus',
    website: 'https://sarahdesigns.com'
  },
  {
    id: '5',
    email: 'buyer2@example.com',
    name: 'Mike Johnson',
    role: 'buyer',
    status: 'active',
    createdAt: '2024-02-05T00:00:00Z',
    lastLoginAt: '2024-02-15T11:00:00Z',
    phone: '+1 (555) 567-8901',
    location: 'Chicago, IL',
    bio: 'Small business owner focused on streamlining operations and reducing costs.',
    company: 'Johnson Consulting',
    website: 'https://johnsonconsulting.biz'
  },
  {
    id: '6',
    email: 'alex.dev@example.com',
    name: 'Alex Developer',
    role: 'creator',
    status: 'active',
    createdAt: '2024-01-25T00:00:00Z',
    lastLoginAt: '2024-02-14T16:30:00Z',
    phone: '+1 (555) 678-9012',
    location: 'Seattle, WA',
    bio: 'Senior software engineer specializing in AI and machine learning tools.',
    company: 'AI Solutions Inc.',
    website: 'https://alexdev.ai'
  },
  {
    id: '7',
    email: 'emma.support@example.com',
    name: 'Emma Support',
    role: 'creator',
    status: 'active',
    createdAt: '2024-01-30T00:00:00Z',
    lastLoginAt: '2024-02-14T12:45:00Z',
    phone: '+1 (555) 789-0123',
    location: 'Boston, MA',
    bio: 'Customer success expert building tools to improve support experiences.',
    company: 'Support Excellence',
    website: 'https://supportexcellence.com'
  },
  {
    id: '8',
    email: 'david.finance@example.com',
    name: 'David Finance',
    role: 'creator',
    status: 'active',
    createdAt: '2024-02-05T00:00:00Z',
    lastLoginAt: '2024-02-14T18:20:00Z',
    phone: '+1 (555) 890-1234',
    location: 'Miami, FL',
    bio: 'Financial analyst and fintech entrepreneur focused on small business solutions.',
    company: 'FinTech Innovations',
    website: 'https://fintechinnovations.com'
  },
  {
    id: '9',
    email: 'lisa.buyer@example.com',
    name: 'Lisa Chen',
    role: 'buyer',
    status: 'active',
    createdAt: '2024-01-25T00:00:00Z',
    lastLoginAt: '2024-02-15T08:15:00Z',
    phone: '+1 (555) 901-2345',
    location: 'Portland, OR',
    bio: 'Tech startup founder looking for tools to scale operations efficiently.',
    company: 'StartupTech',
    website: 'https://startuptech.io'
  },
  {
    id: '10',
    email: 'robert.manager@example.com',
    name: 'Robert Manager',
    role: 'buyer',
    status: 'active',
    createdAt: '2024-01-30T00:00:00Z',
    lastLoginAt: '2024-02-15T13:30:00Z',
    phone: '+1 (555) 012-3456',
    location: 'Denver, CO',
    bio: 'Operations manager at a growing e-commerce company.',
    company: 'E-Commerce Solutions',
    website: 'https://ecommercesolutions.com'
  },
  {
    id: '11',
    email: 'jennifer.buyer@example.com',
    name: 'Jennifer Smith',
    role: 'buyer',
    status: 'suspended',
    createdAt: '2024-01-15T00:00:00Z',
    lastLoginAt: '2024-02-10T10:00:00Z',
    phone: '+1 (555) 123-4567',
    location: 'Phoenix, AZ',
    bio: 'Former customer with payment issues.',
    company: 'Phoenix Marketing'
  }
];

let users = [...mockUsers];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider - Initializing...');
    // Check for stored user session
    try {
      const storedUser = localStorage.getItem('subify_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log('AuthProvider - Found stored user:', userData);
        // Update last login time
        const updatedUser = { ...userData, lastLoginAt: new Date().toISOString() };
        setUser(updatedUser);
        localStorage.setItem('subify_user', JSON.stringify(updatedUser));
        console.log('AuthProvider - User restored from localStorage');
      } else {
        console.log('AuthProvider - No stored user found');
      }
    } catch (error) {
      console.error('AuthProvider - Error loading stored user:', error);
      localStorage.removeItem('subify_user');
    }
    setIsLoading(false);
    console.log('AuthProvider - Initialization complete');
  }, []);

  // Debug user state changes
  useEffect(() => {
    console.log('AuthProvider - User state changed:', user ? `${user.name} (${user.role})` : 'null');
  }, [user]);

  const login = async (email: string, password: string) => {
    console.log('AuthProvider - Login attempt:', { email, availableUsers: users.map(u => u.email) });
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Normalize email for comparison
      const normalizedEmail = email.toLowerCase().trim();
      const foundUser = users.find(u => u.email.toLowerCase() === normalizedEmail);
      
      console.log('AuthProvider - Found user:', foundUser);
      
      if (!foundUser) {
        throw new Error(`No account found with email: ${email}. Available demo accounts: admin@subify.com, creator@example.com, buyer@example.com`);
      }
      
      if (foundUser.status === 'suspended') {
        throw new Error('Account suspended. Please contact support.');
      }
      
      const updatedUser = { ...foundUser, lastLoginAt: new Date().toISOString() };
      
      // Update user in mock data first
      const userIndex = users.findIndex(u => u.id === foundUser.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
      }
      
      // Store in localStorage
      localStorage.setItem('subify_user', JSON.stringify(updatedUser));
      console.log('AuthProvider - User stored in localStorage');
      
      // Set user state (this should trigger re-render)
      setUser(updatedUser);
      console.log('AuthProvider - User state updated:', updatedUser);
      
      showToast.success(`Welcome back, ${updatedUser.name}!`);
      console.log('AuthProvider - Login successful');
    } catch (error) {
      console.error('AuthProvider - Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: 'creator' | 'buyer') => {
    console.log('AuthProvider - Registration attempt:', { email, name, role });
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const normalizedEmail = email.toLowerCase().trim();
      const existingUser = users.find(u => u.email.toLowerCase() === normalizedEmail);
      
      if (existingUser) {
        throw new Error('An account with this email already exists. Please use a different email or try logging in.');
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        email: normalizedEmail,
        name: name.trim(),
        role,
        status: role === 'creator' ? 'pending' : 'active',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('subify_user', JSON.stringify(newUser));
      setUser(newUser);
      
      showToast.success(`Account created successfully! Welcome, ${newUser.name}!`);
      console.log('AuthProvider - Registration successful:', newUser);
    } catch (error) {
      console.error('AuthProvider - Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: 'admin' | 'creator' | 'buyer') => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], role };
      showToast.success('User role updated successfully');
    }
  };

  const suspendUser = async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], status: 'suspended' };
      showToast.success('User suspended successfully');
    }
  };

  const activateUser = async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], status: 'active' };
      showToast.success('User activated successfully');
    }
  };

  const logout = () => {
    const userName = user?.name;
    console.log('AuthProvider - Logging out user:', userName);
    setUser(null);
    localStorage.removeItem('subify_user');
    showToast.success(`Goodbye, ${userName}!`);
    console.log('AuthProvider - User logged out');
  };

  const contextValue = {
    user, 
    login, 
    register, 
    logout, 
    updateUserRole,
    suspendUser,
    activateUser,
    isLoading 
  };

  console.log('AuthProvider - Rendering with context:', { 
    hasUser: !!user, 
    userRole: user?.role, 
    isLoading 
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export users for use in other contexts
export const getAllUsers = () => users;