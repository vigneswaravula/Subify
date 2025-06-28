import React, { useState, useEffect } from 'react';
import { Bell, X, Check, AlertCircle, Info, CheckCircle, Settings, Filter, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  category: 'system' | 'billing' | 'product' | 'user' | 'security';
  priority: 'low' | 'medium' | 'high';
}

interface NotificationCenterProps {
  className?: string;
}

export function NotificationCenter({ className = '' }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'system' | 'billing' | 'product'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Generate role-specific notifications
    const baseNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: 'Payment Received',
        message: 'You received a payment of $29.99 for TaskFlow Pro subscription',
        timestamp: '2024-02-15T10:30:00Z',
        read: false,
        actionUrl: '/dashboard/payments',
        actionText: 'View Details',
        category: 'billing',
        priority: 'medium'
      },
      {
        id: '2',
        type: 'info',
        title: 'New Subscriber',
        message: 'Jane Doe subscribed to your Analytics Dashboard Pro',
        timestamp: '2024-02-15T09:15:00Z',
        read: false,
        category: 'user',
        priority: 'low'
      },
      {
        id: '3',
        type: 'warning',
        title: 'Product Pending Review',
        message: 'Your new product "Social Media Manager" is pending admin approval',
        timestamp: '2024-02-14T16:45:00Z',
        read: true,
        category: 'product',
        priority: 'medium'
      },
      {
        id: '4',
        type: 'success',
        title: 'Product Approved',
        message: 'Your product "Email Marketing Suite" has been approved and is now live',
        timestamp: '2024-02-14T14:20:00Z',
        read: true,
        category: 'product',
        priority: 'high'
      },
      {
        id: '5',
        type: 'info',
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur on Feb 20th from 2-4 AM UTC',
        timestamp: '2024-02-13T12:00:00Z',
        read: false,
        category: 'system',
        priority: 'medium'
      }
    ];

    // Add role-specific notifications
    if (user?.role === 'admin') {
      baseNotifications.unshift(
        {
          id: 'admin-1',
          type: 'warning',
          title: 'High Server Load',
          message: 'Server CPU usage is at 85%. Consider scaling resources.',
          timestamp: '2024-02-15T11:00:00Z',
          read: false,
          category: 'system',
          priority: 'high'
        },
        {
          id: 'admin-2',
          type: 'info',
          title: 'New User Registration',
          message: '15 new users registered in the last 24 hours',
          timestamp: '2024-02-15T08:00:00Z',
          read: false,
          category: 'user',
          priority: 'low'
        }
      );
    }

    if (user?.role === 'buyer') {
      baseNotifications.unshift(
        {
          id: 'buyer-1',
          type: 'info',
          title: 'Subscription Renewal',
          message: 'Your TaskFlow Pro subscription will renew in 3 days',
          timestamp: '2024-02-15T10:00:00Z',
          read: false,
          category: 'billing',
          priority: 'medium'
        },
        {
          id: 'buyer-2',
          type: 'success',
          title: 'Invoice Available',
          message: 'Your invoice for Analytics Dashboard Pro is ready for download',
          timestamp: '2024-02-14T18:30:00Z',
          read: false,
          category: 'billing',
          priority: 'low'
        }
      );
    }

    setNotifications(baseNotifications);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.category === filter;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      default:
        return 'border-l-blue-500';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[80vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Notifications
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'unread', label: 'Unread' },
                    { id: 'system', label: 'System' },
                    { id: 'billing', label: 'Billing' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setFilter(tab.id as any)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        filter === tab.id
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-700 mt-2"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${getPriorityColor(notification.priority)} ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {getIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    {notification.title}
                                  </p>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center justify-between">
                                  <p className="text-xs text-gray-400">
                                    {formatTime(notification.timestamp)}
                                  </p>
                                  <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      notification.category === 'system' ? 'bg-gray-100 text-gray-700' :
                                      notification.category === 'billing' ? 'bg-green-100 text-green-700' :
                                      notification.category === 'product' ? 'bg-blue-100 text-blue-700' :
                                      notification.category === 'user' ? 'bg-purple-100 text-purple-700' :
                                      'bg-red-100 text-red-700'
                                    }`}>
                                      {notification.category}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1 ml-2">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-1 text-gray-400 hover:text-gray-600"
                                    title="Mark as read"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => removeNotification(notification.id)}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                  title="Remove"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            {notification.actionUrl && notification.actionText && (
                              <button className="text-sm text-blue-600 hover:text-blue-700 mt-2 font-medium">
                                {notification.actionText}
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {filteredNotifications.length > 0 && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View all notifications
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}