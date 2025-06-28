import React, { useState } from 'react';
import { CreditCard, User, Calendar, Star, ExternalLink } from 'lucide-react';
import { Product } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { showToast } from '../ui/Toast';
import { createCheckoutSession } from '../../lib/stripe';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedInterval, setSelectedInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { user } = useAuth();
  const { createSubscription } = useApp();

  const handleSubscribe = async () => {
    if (!user) {
      showToast.error('Please log in to subscribe');
      return;
    }
    
    setIsSubscribing(true);
    
    try {
      showToast.loading('Redirecting to checkout...');
      
      // In a real app, this would redirect to Stripe Checkout
      // For demo purposes, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const price = selectedInterval === 'monthly' ? product.monthlyPrice : product.yearlyPrice;
      const periodEnd = selectedInterval === 'monthly' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      
      createSubscription({
        userId: user.id,
        productId: product.id,
        stripeSubscriptionId: `sub_${Date.now()}`,
        status: 'active',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: periodEnd.toISOString(),
        interval: selectedInterval,
        amount: price
      });
      
      showToast.success('Subscription created successfully!');
    } catch (error) {
      showToast.error('Failed to create subscription');
      console.error('Subscription error:', error);
    } finally {
      setIsSubscribing(false);
    }
  };

  const yearlyDiscount = Math.round((1 - (product.yearlyPrice / 12) / product.monthlyPrice) * 100);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-medium text-gray-700 shadow-lg">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>4.8</span>
          </div>
        </div>
        {product.status === 'pending' && (
          <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Pending Approval
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm text-gray-600">{product.creatorName}</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h3>
        <p className="text-gray-600 text-sm mb-6 line-clamp-3">{product.description}</p>
        
        {/* Pricing Toggle */}
        <div className="bg-gray-50 rounded-lg p-1 mb-6">
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setSelectedInterval('monthly')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                selectedInterval === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedInterval('yearly')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all relative ${
                selectedInterval === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              {yearlyDiscount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 rounded-full">
                  -{yearlyDiscount}%
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Price Display */}
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-gray-900">
            ${selectedInterval === 'monthly' ? product.monthlyPrice : product.yearlyPrice}
          </div>
          <div className="text-gray-600 text-sm">
            per {selectedInterval === 'monthly' ? 'month' : 'year'}
          </div>
          {selectedInterval === 'yearly' && (
            <div className="text-xs text-green-600 mt-1">
              Save ${(product.monthlyPrice * 12) - product.yearlyPrice} per year
            </div>
          )}
        </div>
        
        {product.status === 'approved' ? (
          <button
            onClick={handleSubscribe}
            disabled={isSubscribing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 transform hover:scale-105"
          >
            {isSubscribing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Subscribe Now</span>
              </>
            )}
          </button>
        ) : (
          <div className="w-full bg-gray-100 text-gray-500 py-3 px-4 rounded-lg font-medium text-center">
            Awaiting Approval
          </div>
        )}
        
        <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center space-x-1">
            <ExternalLink className="w-3 h-3" />
            <span>Instant access</span>
          </div>
        </div>
      </div>
    </div>
  );
}