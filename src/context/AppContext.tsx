import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Subscription, Purchase, Analytics, CreatorAnalytics, Receipt } from '../types';
import { getAllUsers } from './AuthContext';

interface AppContextType {
  products: Product[];
  subscriptions: Subscription[];
  purchases: Purchase[];
  receipts: Receipt[];
  analytics: Analytics;
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  approveProduct: (id: string) => void;
  rejectProduct: (id: string) => void;
  createSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt'>) => void;
  cancelSubscription: (id: string) => void;
  getCreatorAnalytics: (creatorId: string) => CreatorAnalytics;
  uploadReceipt: (receipt: Omit<Receipt, 'id' | 'createdAt'>) => void;
  refreshAnalytics: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Expanded mock data with more realistic products and variety
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'TaskFlow Pro',
    description: 'Advanced project management tool with team collaboration features, time tracking, automated workflows, and comprehensive reporting. Perfect for growing teams and enterprises.',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
    creatorId: '2',
    creatorName: 'John Creator',
    monthlyPrice: 29,
    yearlyPrice: 290,
    stripeProductId: 'prod_taskflow',
    stripePriceMonthlyId: 'price_taskflow_monthly',
    stripePriceYearlyId: 'price_taskflow_yearly',
    isActive: true,
    status: 'approved',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    tags: ['productivity', 'project-management', 'collaboration'],
    category: 'Business Tools',
    features: ['Team Collaboration', 'Time Tracking', 'Automated Workflows', 'Custom Reports', 'API Access']
  },
  {
    id: '2',
    title: 'Analytics Dashboard Pro',
    description: 'Real-time data visualization and business intelligence platform with custom reporting, advanced metrics, team collaboration, and AI-powered insights.',
    image: 'https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg?auto=compress&cs=tinysrgb&w=800',
    creatorId: '2',
    creatorName: 'John Creator',
    monthlyPrice: 49,
    yearlyPrice: 490,
    stripeProductId: 'prod_analytics',
    stripePriceMonthlyId: 'price_analytics_monthly',
    stripePriceYearlyId: 'price_analytics_yearly',
    isActive: true,
    status: 'approved',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
    tags: ['analytics', 'business-intelligence', 'data-visualization'],
    category: 'Analytics',
    features: ['Real-time Dashboards', 'Custom Reports', 'Data Export', 'Team Sharing', 'API Integration']
  },
  {
    id: '3',
    title: 'Design System Kit',
    description: 'Complete UI component library with design tokens, templates, documentation, and Figma integration. Includes React, Vue, and Angular components.',
    image: 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=800',
    creatorId: '4',
    creatorName: 'Sarah Designer',
    monthlyPrice: 19,
    yearlyPrice: 190,
    stripeProductId: 'prod_design_kit',
    stripePriceMonthlyId: 'price_design_monthly',
    stripePriceYearlyId: 'price_design_yearly',
    isActive: true,
    status: 'approved',
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
    tags: ['design', 'ui-components', 'figma'],
    category: 'Design Tools',
    features: ['Component Library', 'Design Tokens', 'Figma Integration', 'Documentation', 'Multi-framework Support']
  },
  {
    id: '4',
    title: 'Email Marketing Suite',
    description: 'Comprehensive email marketing platform with automation, segmentation, A/B testing, detailed analytics, and CRM integration. Grow your audience effectively.',
    image: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=800',
    creatorId: '4',
    creatorName: 'Sarah Designer',
    monthlyPrice: 39,
    yearlyPrice: 390,
    stripeProductId: 'prod_email_suite',
    stripePriceMonthlyId: 'price_email_monthly',
    stripePriceYearlyId: 'price_email_yearly',
    isActive: true,
    status: 'approved',
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
    tags: ['email-marketing', 'automation', 'crm'],
    category: 'Marketing',
    features: ['Email Automation', 'A/B Testing', 'Segmentation', 'Analytics', 'CRM Integration']
  },
  {
    id: '5',
    title: 'Social Media Manager',
    description: 'All-in-one social media management tool with scheduling, analytics, content creation, team collaboration, and multi-platform support.',
    image: 'https://images.pexels.com/photos/3184300/pexels-photo-3184300.jpeg?auto=compress&cs=tinysrgb&w=800',
    creatorId: '2',
    creatorName: 'John Creator',
    monthlyPrice: 25,
    yearlyPrice: 250,
    stripeProductId: 'prod_social_manager',
    stripePriceMonthlyId: 'price_social_monthly',
    stripePriceYearlyId: 'price_social_yearly',
    isActive: true,
    status: 'pending',
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-02-20T00:00:00Z',
    tags: ['social-media', 'scheduling', 'analytics'],
    category: 'Marketing',
    features: ['Multi-platform Posting', 'Content Calendar', 'Analytics', 'Team Collaboration', 'Content Library']
  },
  {
    id: '6',
    title: 'Code Review Assistant',
    description: 'AI-powered code review tool with automated suggestions, security scanning, performance optimization, and team collaboration features.',
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
    creatorId: '6',
    creatorName: 'Alex Developer',
    monthlyPrice: 35,
    yearlyPrice: 350,
    stripeProductId: 'prod_code_review',
    stripePriceMonthlyId: 'price_code_monthly',
    stripePriceYearlyId: 'price_code_yearly',
    isActive: true,
    status: 'approved',
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
    tags: ['development', 'code-review', 'ai'],
    category: 'Developer Tools',
    features: ['AI Code Analysis', 'Security Scanning', 'Performance Tips', 'Team Reviews', 'IDE Integration']
  },
  {
    id: '7',
    title: 'Customer Support Hub',
    description: 'Complete customer support solution with ticketing, live chat, knowledge base, automation, and customer satisfaction tracking.',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    creatorId: '7',
    creatorName: 'Emma Support',
    monthlyPrice: 45,
    yearlyPrice: 450,
    stripeProductId: 'prod_support_hub',
    stripePriceMonthlyId: 'price_support_monthly',
    stripePriceYearlyId: 'price_support_yearly',
    isActive: true,
    status: 'approved',
    createdAt: '2024-01-30T00:00:00Z',
    updatedAt: '2024-01-30T00:00:00Z',
    tags: ['customer-support', 'ticketing', 'live-chat'],
    category: 'Customer Service',
    features: ['Ticket Management', 'Live Chat', 'Knowledge Base', 'Automation', 'Satisfaction Surveys']
  },
  {
    id: '8',
    title: 'Financial Dashboard',
    description: 'Comprehensive financial tracking and reporting tool with expense management, invoicing, tax preparation, and business insights.',
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
    creatorId: '8',
    creatorName: 'David Finance',
    monthlyPrice: 55,
    yearlyPrice: 550,
    stripeProductId: 'prod_financial',
    stripePriceMonthlyId: 'price_financial_monthly',
    stripePriceYearlyId: 'price_financial_yearly',
    isActive: true,
    status: 'approved',
    createdAt: '2024-02-05T00:00:00Z',
    updatedAt: '2024-02-05T00:00:00Z',
    tags: ['finance', 'accounting', 'invoicing'],
    category: 'Finance',
    features: ['Expense Tracking', 'Invoicing', 'Tax Reports', 'Cash Flow', 'Financial Insights']
  }
];

// Enhanced subscriptions with more variety
const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    userId: '3',
    productId: '1',
    stripeSubscriptionId: 'sub_1234567890',
    status: 'active',
    currentPeriodStart: '2024-02-01T00:00:00Z',
    currentPeriodEnd: '2024-03-01T00:00:00Z',
    interval: 'monthly',
    amount: 29,
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: '2',
    userId: '5',
    productId: '2',
    stripeSubscriptionId: 'sub_0987654321',
    status: 'active',
    currentPeriodStart: '2024-02-05T00:00:00Z',
    currentPeriodEnd: '2025-02-05T00:00:00Z',
    interval: 'yearly',
    amount: 490,
    createdAt: '2024-02-05T00:00:00Z'
  },
  {
    id: '3',
    userId: '3',
    productId: '3',
    stripeSubscriptionId: 'sub_1122334455',
    status: 'active',
    currentPeriodStart: '2024-02-10T00:00:00Z',
    currentPeriodEnd: '2024-03-10T00:00:00Z',
    interval: 'monthly',
    amount: 19,
    createdAt: '2024-02-10T00:00:00Z'
  },
  {
    id: '4',
    userId: '5',
    productId: '4',
    stripeSubscriptionId: 'sub_5566778899',
    status: 'active',
    currentPeriodStart: '2024-02-15T00:00:00Z',
    currentPeriodEnd: '2025-02-15T00:00:00Z',
    interval: 'yearly',
    amount: 390,
    createdAt: '2024-02-15T00:00:00Z'
  },
  {
    id: '5',
    userId: '9',
    productId: '6',
    stripeSubscriptionId: 'sub_6677889900',
    status: 'active',
    currentPeriodStart: '2024-01-25T00:00:00Z',
    currentPeriodEnd: '2024-02-25T00:00:00Z',
    interval: 'monthly',
    amount: 35,
    createdAt: '2024-01-25T00:00:00Z'
  },
  {
    id: '6',
    userId: '10',
    productId: '7',
    stripeSubscriptionId: 'sub_7788990011',
    status: 'active',
    currentPeriodStart: '2024-01-30T00:00:00Z',
    currentPeriodEnd: '2025-01-30T00:00:00Z',
    interval: 'yearly',
    amount: 450,
    createdAt: '2024-01-30T00:00:00Z'
  },
  {
    id: '7',
    userId: '11',
    productId: '8',
    stripeSubscriptionId: 'sub_8899001122',
    status: 'canceled',
    currentPeriodStart: '2024-01-15T00:00:00Z',
    currentPeriodEnd: '2024-02-15T00:00:00Z',
    interval: 'monthly',
    amount: 55,
    createdAt: '2024-01-15T00:00:00Z',
    canceledAt: '2024-02-10T00:00:00Z'
  }
];

// Enhanced purchases with more data
const mockPurchases: Purchase[] = [
  {
    id: '1',
    userId: '3',
    productId: '1',
    subscriptionId: '1',
    amount: 29,
    status: 'completed',
    stripePaymentIntentId: 'pi_1234567890',
    invoiceUrl: 'https://invoice.stripe.com/i/acct_1234567890/test_1234567890',
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: '2',
    userId: '5',
    productId: '2',
    subscriptionId: '2',
    amount: 490,
    status: 'completed',
    stripePaymentIntentId: 'pi_0987654321',
    invoiceUrl: 'https://invoice.stripe.com/i/acct_1234567890/test_0987654321',
    createdAt: '2024-02-05T00:00:00Z'
  },
  {
    id: '3',
    userId: '3',
    productId: '3',
    subscriptionId: '3',
    amount: 19,
    status: 'completed',
    stripePaymentIntentId: 'pi_1122334455',
    invoiceUrl: 'https://invoice.stripe.com/i/acct_1234567890/test_1122334455',
    createdAt: '2024-02-10T00:00:00Z'
  },
  {
    id: '4',
    userId: '5',
    productId: '4',
    subscriptionId: '4',
    amount: 390,
    status: 'completed',
    stripePaymentIntentId: 'pi_5566778899',
    invoiceUrl: 'https://invoice.stripe.com/i/acct_1234567890/test_5566778899',
    createdAt: '2024-02-15T00:00:00Z'
  },
  {
    id: '5',
    userId: '9',
    productId: '6',
    subscriptionId: '5',
    amount: 35,
    status: 'completed',
    stripePaymentIntentId: 'pi_6677889900',
    invoiceUrl: 'https://invoice.stripe.com/i/acct_1234567890/test_6677889900',
    createdAt: '2024-01-25T00:00:00Z'
  },
  {
    id: '6',
    userId: '10',
    productId: '7',
    subscriptionId: '6',
    amount: 450,
    status: 'completed',
    stripePaymentIntentId: 'pi_7788990011',
    invoiceUrl: 'https://invoice.stripe.com/i/acct_1234567890/test_7788990011',
    createdAt: '2024-01-30T00:00:00Z'
  },
  {
    id: '7',
    userId: '11',
    productId: '8',
    subscriptionId: '7',
    amount: 55,
    status: 'refunded',
    stripePaymentIntentId: 'pi_8899001122',
    invoiceUrl: 'https://invoice.stripe.com/i/acct_1234567890/test_8899001122',
    createdAt: '2024-01-15T00:00:00Z',
    refundedAt: '2024-02-10T00:00:00Z',
    refundAmount: 55
  }
];

// Enhanced receipts with more variety
const mockReceipts: Receipt[] = [
  {
    id: '1',
    userId: '2',
    vendor: 'Adobe Creative Cloud',
    date: '2024-02-01',
    total: 52.99,
    category: 'Software',
    description: 'Monthly subscription for design tools',
    extractedData: { confidence: 0.95 },
    createdAt: '2024-02-01T00:00:00Z',
    tags: ['design', 'subscription'],
    taxAmount: 4.24,
    currency: 'USD'
  },
  {
    id: '2',
    userId: '4',
    vendor: 'AWS',
    date: '2024-02-05',
    total: 127.45,
    category: 'Software',
    description: 'Cloud hosting and storage services',
    extractedData: { confidence: 0.92 },
    createdAt: '2024-02-05T00:00:00Z',
    tags: ['hosting', 'cloud'],
    taxAmount: 10.20,
    currency: 'USD'
  },
  {
    id: '3',
    userId: '2',
    vendor: 'Office Depot',
    date: '2024-02-08',
    total: 89.99,
    category: 'Office Supplies',
    description: 'Printer paper, pens, and office supplies',
    extractedData: { confidence: 0.88 },
    createdAt: '2024-02-08T00:00:00Z',
    tags: ['office', 'supplies'],
    taxAmount: 7.20,
    currency: 'USD'
  },
  {
    id: '4',
    userId: '4',
    vendor: 'Figma',
    date: '2024-02-12',
    total: 15.00,
    category: 'Software',
    description: 'Design collaboration platform',
    extractedData: { confidence: 0.97 },
    createdAt: '2024-02-12T00:00:00Z',
    tags: ['design', 'collaboration'],
    taxAmount: 1.20,
    currency: 'USD'
  },
  {
    id: '5',
    userId: '2',
    vendor: 'Starbucks',
    date: '2024-02-14',
    total: 12.50,
    category: 'Meals',
    description: 'Client meeting coffee',
    extractedData: { confidence: 0.85 },
    createdAt: '2024-02-14T00:00:00Z',
    tags: ['meeting', 'client'],
    taxAmount: 1.00,
    currency: 'USD'
  }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);
  const [receipts, setReceipts] = useState<Receipt[]>(mockReceipts);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalRevenue: 0,
    mrr: 0,
    totalUsers: 0,
    totalCreators: 0,
    totalBuyers: 0,
    activeSubscriptions: 0,
    churnRate: 0,
    revenueOverTime: [],
    userGrowth: [],
    churnOverTime: [],
    topCreators: [],
    topProducts: [],
    conversionRate: 0,
    averageOrderValue: 0,
    customerLifetimeValue: 0
  });

  const refreshAnalytics = () => {
    const users = getAllUsers();
    const totalRevenue = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
    const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
    const totalUsers = users.length;
    const totalCreators = users.filter(u => u.role === 'creator').length;
    const totalBuyers = users.filter(u => u.role === 'buyer').length;
    
    const mrr = subscriptions
      .filter(sub => sub.status === 'active')
      .reduce((sum, sub) => {
        const monthlyAmount = sub.interval === 'yearly' ? sub.amount / 12 : sub.amount;
        return sum + monthlyAmount;
      }, 0);

    // Calculate enhanced metrics
    const totalSubscriptions = subscriptions.length;
    const canceledSubscriptions = subscriptions.filter(sub => sub.status === 'canceled').length;
    const churnRate = totalSubscriptions > 0 ? (canceledSubscriptions / totalSubscriptions) * 100 : 0;
    
    const conversionRate = totalUsers > 0 ? (activeSubscriptions / totalUsers) * 100 : 0;
    const averageOrderValue = purchases.length > 0 ? totalRevenue / purchases.length : 0;
    const customerLifetimeValue = totalBuyers > 0 ? totalRevenue / totalBuyers : 0;

    // Generate realistic time series data with trends
    const revenueOverTime = Array.from({ length: 12 }, (_, i) => {
      const baseRevenue = 2000;
      const growth = i * 400; // Growing trend
      const seasonality = Math.sin((i / 12) * 2 * Math.PI) * 300; // Seasonal variation
      const variance = (Math.random() - 0.5) * 400;
      return {
        date: new Date(2024, i, 1).toISOString().split('T')[0],
        revenue: Math.max(0, Math.floor(baseRevenue + growth + seasonality + variance))
      };
    });

    const userGrowth = Array.from({ length: 12 }, (_, i) => {
      const baseUsers = 50;
      const growth = i * 25; // Steady growth
      const variance = Math.floor(Math.random() * 15);
      const totalUsers = baseUsers + growth + variance;
      return {
        date: new Date(2024, i, 1).toISOString().split('T')[0],
        users: totalUsers,
        creators: Math.floor(totalUsers * 0.25) + Math.floor(Math.random() * 5),
        buyers: Math.floor(totalUsers * 0.75) + Math.floor(Math.random() * 10)
      };
    });

    const churnOverTime = Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2024, i, 1).toISOString().split('T')[0],
      churnRate: Math.max(1, Math.min(12, 5 + Math.sin(i / 2) * 3 + (Math.random() - 0.5) * 2))
    }));

    // Calculate top creators with enhanced metrics
    const creatorRevenue = new Map<string, { revenue: number; subscribers: number }>();
    purchases.forEach(purchase => {
      const product = products.find(p => p.id === purchase.productId);
      if (product) {
        const current = creatorRevenue.get(product.creatorName) || { revenue: 0, subscribers: 0 };
        creatorRevenue.set(product.creatorName, {
          revenue: current.revenue + purchase.amount,
          subscribers: current.subscribers
        });
      }
    });

    subscriptions.forEach(sub => {
      const product = products.find(p => p.id === sub.productId);
      if (product && sub.status === 'active') {
        const current = creatorRevenue.get(product.creatorName) || { revenue: 0, subscribers: 0 };
        creatorRevenue.set(product.creatorName, {
          revenue: current.revenue,
          subscribers: current.subscribers + 1
        });
      }
    });

    const topCreators = Array.from(creatorRevenue.entries())
      .map(([name, data]) => ({ name, revenue: data.revenue, subscribers: data.subscribers }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Calculate top products with enhanced metrics
    const productRevenue = new Map<string, { title: string; revenue: number; subscribers: number }>();
    purchases.forEach(purchase => {
      const product = products.find(p => p.id === purchase.productId);
      if (product) {
        const current = productRevenue.get(product.id) || { title: product.title, revenue: 0, subscribers: 0 };
        productRevenue.set(product.id, {
          title: product.title,
          revenue: current.revenue + purchase.amount,
          subscribers: current.subscribers
        });
      }
    });

    subscriptions.forEach(sub => {
      const product = products.find(p => p.id === sub.productId);
      if (product && sub.status === 'active') {
        const current = productRevenue.get(product.id) || { title: product.title, revenue: 0, subscribers: 0 };
        productRevenue.set(product.id, {
          title: product.title,
          revenue: current.revenue,
          subscribers: current.subscribers + 1
        });
      }
    });

    const topProducts = Array.from(productRevenue.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    setAnalytics({
      totalRevenue,
      mrr,
      totalUsers,
      totalCreators,
      totalBuyers,
      activeSubscriptions,
      churnRate,
      revenueOverTime,
      userGrowth,
      churnOverTime,
      topCreators,
      topProducts,
      conversionRate,
      averageOrderValue,
      customerLifetimeValue
    });
  };

  useEffect(() => {
    refreshAnalytics();
  }, [products, subscriptions, purchases]);

  const createProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updates, updatedAt: new Date().toISOString() } : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
    // Also remove related subscriptions and purchases
    setSubscriptions(prev => prev.filter(sub => sub.productId !== id));
    setPurchases(prev => prev.filter(purchase => purchase.productId !== id));
  };

  const approveProduct = (id: string) => {
    updateProduct(id, { status: 'approved', isActive: true });
  };

  const rejectProduct = (id: string) => {
    updateProduct(id, { status: 'rejected', isActive: false });
  };

  const createSubscription = (subscriptionData: Omit<Subscription, 'id' | 'createdAt'>) => {
    const newSubscription: Subscription = {
      ...subscriptionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setSubscriptions(prev => [...prev, newSubscription]);

    // Create corresponding purchase
    const newPurchase: Purchase = {
      id: Date.now().toString(),
      userId: subscriptionData.userId,
      productId: subscriptionData.productId,
      subscriptionId: newSubscription.id,
      amount: subscriptionData.amount,
      status: 'completed',
      stripePaymentIntentId: `pi_${Date.now()}`,
      invoiceUrl: `https://invoice.stripe.com/i/acct_1234567890/test_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setPurchases(prev => [...prev, newPurchase]);
  };

  const cancelSubscription = (id: string) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, status: 'canceled' as const, canceledAt: new Date().toISOString() } : sub
    ));
  };

  const getCreatorAnalytics = (creatorId: string): CreatorAnalytics => {
    const creatorProducts = products.filter(p => p.creatorId === creatorId);
    const creatorSubscriptions = subscriptions.filter(sub => 
      creatorProducts.some(product => product.id === sub.productId)
    );
    const creatorPurchases = purchases.filter(purchase => 
      creatorProducts.some(product => product.id === purchase.productId)
    );

    const totalRevenue = creatorPurchases.reduce((sum, purchase) => sum + purchase.amount, 0);
    const currentMonth = new Date().getMonth();
    const monthlyRevenue = creatorPurchases
      .filter(purchase => new Date(purchase.createdAt).getMonth() === currentMonth)
      .reduce((sum, purchase) => sum + purchase.amount, 0);

    const totalSubscribers = creatorSubscriptions.length;
    const activeSubscribers = creatorSubscriptions.filter(sub => sub.status === 'active').length;
    const canceledSubscribers = creatorSubscriptions.filter(sub => sub.status === 'canceled').length;
    
    const churnRate = totalSubscribers > 0 ? (canceledSubscribers / totalSubscribers) * 100 : 0;
    const conversionRate = Math.random() * 15 + 5; // Mock conversion rate 5-20%
    const averageRevenuePerUser = activeSubscribers > 0 ? totalRevenue / activeSubscribers : 0;

    const revenueOverTime = Array.from({ length: 12 }, (_, i) => {
      const baseRevenue = 500;
      const growth = i * 150;
      const variance = Math.random() * 300;
      return {
        date: new Date(2024, i, 1).toISOString().split('T')[0],
        revenue: Math.floor(baseRevenue + growth + variance)
      };
    });

    const subscriberGrowth = Array.from({ length: 12 }, (_, i) => {
      const baseSubscribers = 10;
      const growth = i * 8;
      return {
        date: new Date(2024, i, 1).toISOString().split('T')[0],
        subscribers: baseSubscribers + growth + Math.floor(Math.random() * 15)
      };
    });

    const productPerformance = creatorProducts.map(product => {
      const productSubscriptions = creatorSubscriptions.filter(sub => sub.productId === product.id);
      const productPurchases = creatorPurchases.filter(purchase => purchase.productId === product.id);
      
      return {
        productId: product.id,
        title: product.title,
        revenue: productPurchases.reduce((sum, purchase) => sum + purchase.amount, 0),
        subscribers: productSubscriptions.filter(sub => sub.status === 'active').length
      };
    });

    return {
      totalRevenue,
      monthlyRevenue,
      totalSubscribers,
      activeSubscribers,
      revenueOverTime,
      subscriberGrowth,
      productPerformance,
      conversionRate,
      churnRate,
      averageRevenuePerUser
    };
  };

  const uploadReceipt = (receiptData: Omit<Receipt, 'id' | 'createdAt'>) => {
    const newReceipt: Receipt = {
      ...receiptData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setReceipts(prev => [...prev, newReceipt]);
  };

  return (
    <AppContext.Provider value={{
      products,
      subscriptions,
      purchases,
      receipts,
      analytics,
      createProduct,
      updateProduct,
      deleteProduct,
      approveProduct,
      rejectProduct,
      createSubscription,
      cancelSubscription,
      getCreatorAnalytics,
      uploadReceipt,
      refreshAnalytics
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};