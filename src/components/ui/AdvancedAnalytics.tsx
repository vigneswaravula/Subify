import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target, 
  Zap,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Clock,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  ScatterChart
} from 'recharts';

interface AdvancedAnalyticsProps {
  userRole: 'admin' | 'creator' | 'buyer';
}

export function AdvancedAnalytics({ userRole }: AdvancedAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [isLoading, setIsLoading] = useState(false);

  // Advanced metrics data
  const metrics = {
    revenue: {
      current: 125420,
      previous: 98750,
      change: 27.0,
      trend: 'up',
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: Math.floor(Math.random() * 5000 + 3000 + i * 100),
        target: 4000 + i * 120
      }))
    },
    users: {
      current: 8945,
      previous: 7234,
      change: 23.6,
      trend: 'up',
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: Math.floor(Math.random() * 50 + 200 + i * 5),
        organic: Math.floor(Math.random() * 30 + 120 + i * 3),
        paid: Math.floor(Math.random() * 20 + 80 + i * 2)
      }))
    },
    conversion: {
      current: 3.8,
      previous: 3.2,
      change: 18.8,
      trend: 'up',
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: Math.random() * 2 + 2.5 + Math.sin(i / 5) * 0.5
      }))
    },
    churn: {
      current: 2.1,
      previous: 2.8,
      change: -25.0,
      trend: 'down',
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: Math.random() * 1.5 + 1.5 + Math.sin(i / 7) * 0.3
      }))
    }
  };

  const cohortData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
    retention: Math.max(20, 95 - i * 6 + Math.random() * 10),
    revenue: Math.floor(Math.random() * 20000 + 30000)
  }));

  const geographicData = [
    { country: 'United States', users: 3245, revenue: 45670, color: '#3b82f6' },
    { country: 'United Kingdom', users: 1876, revenue: 28340, color: '#8b5cf6' },
    { country: 'Canada', users: 1234, revenue: 19850, color: '#10b981' },
    { country: 'Germany', users: 987, revenue: 15670, color: '#f59e0b' },
    { country: 'France', users: 756, revenue: 12340, color: '#ef4444' },
    { country: 'Others', users: 847, revenue: 13550, color: '#6b7280' }
  ];

  const funnelData = [
    { stage: 'Visitors', value: 10000, conversion: 100 },
    { stage: 'Sign-ups', value: 2500, conversion: 25 },
    { stage: 'Trial Users', value: 1200, conversion: 12 },
    { stage: 'Paid Users', value: 380, conversion: 3.8 },
    { stage: 'Retained (30d)', value: 342, conversion: 3.4 }
  ];

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="space-y-8">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
          <p className="text-gray-600">Deep insights into your platform performance</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(metrics).map(([key, metric]) => (
          <motion.div
            key={key}
            whileHover={{ scale: 1.02 }}
            className={`bg-white rounded-xl border-2 p-6 cursor-pointer transition-all ${
              selectedMetric === key ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedMetric(key)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                key === 'revenue' ? 'bg-green-100 text-green-600' :
                key === 'users' ? 'bg-blue-100 text-blue-600' :
                key === 'conversion' ? 'bg-purple-100 text-purple-600' :
                'bg-red-100 text-red-600'
              }`}>
                {key === 'revenue' && <DollarSign className="w-6 h-6" />}
                {key === 'users' && <Users className="w-6 h-6" />}
                {key === 'conversion' && <Target className="w-6 h-6" />}
                {key === 'churn' && <TrendingDown className="w-6 h-6" />}
              </div>
              
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span>{Math.abs(metric.change)}%</span>
              </div>
            </div>
            
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {key === 'revenue' ? formatCurrency(metric.current) :
                 key === 'users' ? metric.current.toLocaleString() :
                 formatPercent(metric.current)}
              </p>
              <p className="text-gray-600 text-sm font-medium capitalize">{key.replace('_', ' ')}</p>
              <p className="text-gray-500 text-xs mt-1">
                vs {key === 'revenue' ? formatCurrency(metric.previous) :
                    key === 'users' ? metric.previous.toLocaleString() :
                    formatPercent(metric.previous)} last period
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 capitalize">
            {selectedMetric.replace('_', ' ')} Trend
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Real-time data</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={metrics[selectedMetric as keyof typeof metrics].data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              fill="url(#gradient)"
              stroke="#3b82f6"
              strokeWidth={3}
            />
            {selectedMetric === 'revenue' && (
              <Line
                type="monotone"
                dataKey="target"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Advanced Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cohort Analysis */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Cohort Retention Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={cohortData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Retention']}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="retention"
                stroke="#8b5cf6"
                fill="url(#retentionGradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Geographic Distribution</h3>
          <div className="space-y-4">
            {geographicData.map((country, index) => (
              <div key={country.country} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: country.color }}
                  ></div>
                  <span className="font-medium text-gray-900">{country.country}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{country.users.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{formatCurrency(country.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Conversion Funnel</h3>
          <div className="space-y-3">
            {funnelData.map((stage, index) => (
              <div key={stage.stage} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{stage.stage}</span>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">{stage.value.toLocaleString()}</span>
                    <span className="text-sm text-gray-500 ml-2">({stage.conversion}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${stage.conversion * 10}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-500" />
            Real-time Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">New subscription</span>
              </div>
              <span className="text-xs text-gray-500">2 min ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">User registration</span>
              </div>
              <span className="text-xs text-gray-500">5 min ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Product view</span>
              </div>
              <span className="text-xs text-gray-500">8 min ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-500" />
          AI-Powered Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="font-medium text-green-800">Growth Opportunity</span>
            </div>
            <p className="text-sm text-gray-600">Your conversion rate is 23% higher than industry average. Consider increasing marketing spend.</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-blue-800">Optimization</span>
            </div>
            <p className="text-sm text-gray-600">Users from mobile devices have 15% lower conversion. Optimize mobile experience.</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-purple-500" />
              <span className="font-medium text-purple-800">Timing</span>
            </div>
            <p className="text-sm text-gray-600">Peak activity occurs at 2-4 PM EST. Schedule important updates accordingly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}