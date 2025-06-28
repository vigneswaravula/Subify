export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'creator' | 'buyer';
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  lastLoginAt?: string;
  phone?: string;
  location?: string;
  bio?: string;
  website?: string;
  company?: string;
  avatar?: string;
  preferences?: {
    theme: 'light' | 'dark';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      marketing: boolean;
    };
  };
}

export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  creatorId: string;
  creatorName: string;
  monthlyPrice: number;
  yearlyPrice: number;
  stripeProductId?: string;
  stripePriceMonthlyId?: string;
  stripePriceYearlyId?: string;
  isActive: boolean;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  category?: string;
  features?: string[];
  demoUrl?: string;
  documentationUrl?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  productId: string;
  stripeSubscriptionId: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  interval: 'monthly' | 'yearly';
  amount: number;
  createdAt: string;
  canceledAt?: string;
  trialEnd?: string;
  metadata?: Record<string, any>;
}

export interface Purchase {
  id: string;
  userId: string;
  productId: string;
  subscriptionId: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  stripePaymentIntentId: string;
  invoiceUrl?: string;
  createdAt: string;
  refundedAt?: string;
  refundAmount?: number;
  metadata?: Record<string, any>;
}

export interface Analytics {
  totalRevenue: number;
  mrr: number;
  totalUsers: number;
  totalCreators: number;
  totalBuyers: number;
  activeSubscriptions: number;
  churnRate: number;
  revenueOverTime: Array<{ date: string; revenue: number }>;
  userGrowth: Array<{ date: string; users: number; creators: number; buyers: number }>;
  churnOverTime: Array<{ date: string; churnRate: number }>;
  topCreators: Array<{ name: string; revenue: number; subscribers: number }>;
  topProducts: Array<{ title: string; revenue: number; subscribers: number }>;
  conversionRate: number;
  averageOrderValue: number;
  customerLifetimeValue: number;
}

export interface CreatorAnalytics {
  totalRevenue: number;
  monthlyRevenue: number;
  totalSubscribers: number;
  activeSubscribers: number;
  revenueOverTime: Array<{ date: string; revenue: number }>;
  subscriberGrowth: Array<{ date: string; subscribers: number }>;
  productPerformance: Array<{ productId: string; title: string; revenue: number; subscribers: number }>;
  conversionRate: number;
  churnRate: number;
  averageRevenuePerUser: number;
}

export interface Receipt {
  id: string;
  userId: string;
  vendor: string;
  date: string;
  total: number;
  category: string;
  description: string;
  imageUrl?: string;
  extractedData: any;
  createdAt: string;
  tags?: string[];
  taxAmount?: number;
  currency?: string;
  paymentMethod?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
}