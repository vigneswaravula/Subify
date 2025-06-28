import React, { useState, useEffect } from 'react';
import { Search, X, User, Package, FileText, CreditCard, Clock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useAuth, getAllUsers } from '../../context/AuthContext';

interface GlobalSearchProps {
  onClose: () => void;
}

interface SearchResult {
  id: string;
  type: 'user' | 'product' | 'purchase' | 'subscription';
  title: string;
  subtitle: string;
  description?: string;
  icon: React.ComponentType<any>;
  onClick: () => void;
}

export function GlobalSearch({ onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { products, subscriptions, purchases } = useApp();
  const { user } = useAuth();

  const users = getAllUsers();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        results[selectedIndex].onClick();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [results, selectedIndex, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const searchTimeout = setTimeout(() => {
      const searchResults: SearchResult[] = [];

      // Search users (admin only)
      if (user?.role === 'admin') {
        users
          .filter(u => 
            u.name.toLowerCase().includes(query.toLowerCase()) ||
            u.email.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 3)
          .forEach(u => {
            searchResults.push({
              id: u.id,
              type: 'user',
              title: u.name,
              subtitle: u.email,
              description: `${u.role} • ${u.status}`,
              icon: User,
              onClick: () => console.log('Navigate to user:', u.id)
            });
          });
      }

      // Search products
      products
        .filter(p => 
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.creatorName.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
        .forEach(p => {
          searchResults.push({
            id: p.id,
            type: 'product',
            title: p.title,
            subtitle: `by ${p.creatorName}`,
            description: `$${p.monthlyPrice}/month • ${p.status}`,
            icon: Package,
            onClick: () => console.log('Navigate to product:', p.id)
          });
        });

      // Search subscriptions (user's own or all for admin)
      const userSubscriptions = user?.role === 'admin' 
        ? subscriptions 
        : subscriptions.filter(s => s.userId === user?.id);

      userSubscriptions
        .slice(0, 3)
        .forEach(s => {
          const product = products.find(p => p.id === s.productId);
          if (product && product.title.toLowerCase().includes(query.toLowerCase())) {
            searchResults.push({
              id: s.id,
              type: 'subscription',
              title: product.title,
              subtitle: `Subscription • ${s.status}`,
              description: `$${s.amount} • ${s.interval}`,
              icon: CreditCard,
              onClick: () => console.log('Navigate to subscription:', s.id)
            });
          }
        });

      // Search purchases
      const userPurchases = user?.role === 'admin' 
        ? purchases 
        : purchases.filter(p => p.userId === user?.id);

      userPurchases
        .slice(0, 3)
        .forEach(p => {
          const product = products.find(prod => prod.id === p.productId);
          if (product && product.title.toLowerCase().includes(query.toLowerCase())) {
            searchResults.push({
              id: p.id,
              type: 'purchase',
              title: product.title,
              subtitle: `Purchase • ${p.status}`,
              description: `$${p.amount} • ${new Date(p.createdAt).toLocaleDateString()}`,
              icon: FileText,
              onClick: () => console.log('Navigate to purchase:', p.id)
            });
          }
        });

      setResults(searchResults);
      setSelectedIndex(0);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, products, subscriptions, purchases, users, user]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'user':
        return 'bg-blue-100 text-blue-800';
      case 'product':
        return 'bg-green-100 text-green-800';
      case 'subscription':
        return 'bg-purple-100 text-purple-800';
      case 'purchase':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const recentSearches = [
    { query: 'TaskFlow Pro', type: 'product' },
    { query: 'Analytics Dashboard', type: 'product' },
    { query: 'subscriptions', type: 'general' },
    { query: 'invoices', type: 'general' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-start justify-center p-4 pt-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl"
        >
          {/* Search Input */}
          <div className="flex items-center p-4 border-b border-gray-200">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, users, subscriptions..."
              className="flex-1 text-lg placeholder-gray-400 border-none outline-none"
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((result, index) => (
                  <motion.button
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      result.onClick();
                      onClose();
                    }}
                    className={`w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors ${
                      index === selectedIndex ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <result.icon className="w-5 h-5 text-gray-600" />
                      </div>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900">{result.title}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(result.type)}`}>
                          {result.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{result.subtitle}</p>
                      {result.description && (
                        <p className="text-xs text-gray-500 mt-1">{result.description}</p>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </motion.button>
                ))}
              </div>
            ) : query.trim() ? (
              <div className="p-8 text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No results found for "{query}"</p>
                <p className="text-sm text-gray-400">Try searching for products, users, or subscriptions</p>
              </div>
            ) : (
              <div className="py-4">
                <div className="px-4 py-2">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Recent searches</h3>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(search.query)}
                        className="flex items-center space-x-3 w-full p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{search.query}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(search.type)}`}>
                          {search.type}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="px-4 py-2 border-t border-gray-100 mt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Quick actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                      <Package className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">Browse Products</span>
                    </button>
                    <button className="flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                      <CreditCard className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">My Subscriptions</span>
                    </button>
                    <button className="flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                      <FileText className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-700">Invoices</span>
                    </button>
                    <button className="flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                      <User className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-gray-700">Profile</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 bg-white border border-gray-200 rounded">↑↓</kbd>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 bg-white border border-gray-200 rounded">↵</kbd>
                  <span>Select</span>
                </span>
                <span className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 bg-white border border-gray-200 rounded">esc</kbd>
                  <span>Close</span>
                </span>
              </div>
              <span>{results.length} results</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}