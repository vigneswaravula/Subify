import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Zap, 
  Clock, 
  Database, 
  Wifi, 
  Server,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Monitor,
  Globe,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  threshold: number;
  icon: React.ComponentType<any>;
}

export function PerformanceMonitor() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const [metrics, setMetrics] = useState<PerformanceMetric[]>([
    {
      name: 'Response Time',
      value: 245,
      unit: 'ms',
      status: 'good',
      trend: 'stable',
      threshold: 500,
      icon: Clock
    },
    {
      name: 'CPU Usage',
      value: 68,
      unit: '%',
      status: 'warning',
      trend: 'up',
      threshold: 80,
      icon: Activity
    },
    {
      name: 'Memory Usage',
      value: 72,
      unit: '%',
      status: 'good',
      trend: 'stable',
      threshold: 85,
      icon: Database
    },
    {
      name: 'Network Latency',
      value: 12,
      unit: 'ms',
      status: 'good',
      trend: 'down',
      threshold: 50,
      icon: Wifi
    },
    {
      name: 'Error Rate',
      value: 0.02,
      unit: '%',
      status: 'good',
      trend: 'stable',
      threshold: 1,
      icon: AlertTriangle
    },
    {
      name: 'Uptime',
      value: 99.98,
      unit: '%',
      status: 'good',
      trend: 'stable',
      threshold: 99.9,
      icon: Server
    }
  ]);

  const performanceData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    responseTime: Math.floor(Math.random() * 100 + 200),
    cpuUsage: Math.floor(Math.random() * 30 + 50),
    memoryUsage: Math.floor(Math.random() * 20 + 60),
    errorRate: Math.random() * 0.1
  }));

  const systemHealth = {
    overall: 'healthy',
    services: [
      { name: 'API Gateway', status: 'healthy', uptime: '99.99%' },
      { name: 'Database', status: 'healthy', uptime: '99.95%' },
      { name: 'Cache Layer', status: 'healthy', uptime: '99.98%' },
      { name: 'CDN', status: 'healthy', uptime: '99.99%' },
      { name: 'Payment Service', status: 'warning', uptime: '99.85%' },
      { name: 'Email Service', status: 'healthy', uptime: '99.92%' }
    ]
  };

  const refreshMetrics = () => {
    setIsLoading(true);
    setTimeout(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.name === 'Response Time' 
          ? Math.floor(Math.random() * 200 + 200)
          : metric.name === 'CPU Usage'
          ? Math.floor(Math.random() * 40 + 40)
          : metric.name === 'Memory Usage'
          ? Math.floor(Math.random() * 30 + 60)
          : metric.value + (Math.random() - 0.5) * 10
      })));
      setLastUpdate(new Date());
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const interval = setInterval(refreshMetrics, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Monitor className="w-7 h-7 mr-3 text-blue-500" />
            Performance Monitor
          </h2>
          <p className="text-gray-600 mt-1">Real-time system performance and health metrics</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <button
            onClick={refreshMetrics}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-600">All Systems Operational</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemHealth.services.map((service) => (
            <div key={service.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(service.status)}
                <div>
                  <p className="font-medium text-gray-900">{service.name}</p>
                  <p className="text-sm text-gray-600">Uptime: {service.uptime}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                service.status === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {service.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <motion.div
            key={metric.name}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getStatusColor(metric.status)}`}>
                <metric.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center space-x-2">
                {getTrendIcon(metric.trend)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                  {metric.status}
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {metric.value.toFixed(metric.name === 'Error Rate' ? 2 : 0)}{metric.unit}
              </p>
              <p className="text-gray-600 text-sm font-medium">{metric.name}</p>
              <p className="text-gray-500 text-xs mt-1">
                Threshold: {metric.threshold}{metric.unit}
              </p>
            </div>
            
            {/* Mini progress bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    metric.value > metric.threshold ? 'bg-red-500' : 
                    metric.value > metric.threshold * 0.8 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ 
                    width: `${Math.min((metric.value / metric.threshold) * 100, 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Response Time Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="responseTime"
                stroke="#3b82f6"
                fill="url(#responseGradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="responseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Resource Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="cpuUsage"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
                name="CPU Usage"
              />
              <Line
                type="monotone"
                dataKey="memoryUsage"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                name="Memory Usage"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts and Incidents */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Alerts & Incidents</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">High CPU Usage Detected</p>
                <p className="text-sm text-yellow-700">CPU usage exceeded 80% threshold</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-yellow-600">5 minutes ago</p>
              <button className="text-xs text-yellow-700 hover:text-yellow-800">Acknowledge</button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Database Backup Completed</p>
                <p className="text-sm text-green-700">Scheduled backup finished successfully</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-600">2 hours ago</p>
              <button className="text-xs text-green-700 hover:text-green-800">View Details</button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">Performance Optimization Applied</p>
                <p className="text-sm text-blue-700">Cache configuration updated for better performance</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600">1 day ago</p>
              <button className="text-xs text-blue-700 hover:text-blue-800">View Report</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}