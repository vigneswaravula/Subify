import React, { useState } from 'react';
import { 
  Lightbulb, 
  TrendingUp, 
  Target, 
  Users, 
  DollarSign, 
  Zap,
  CheckCircle,
  X,
  ArrowRight,
  Star,
  Clock,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Recommendation {
  id: string;
  type: 'growth' | 'optimization' | 'retention' | 'revenue';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  estimatedGain: string;
  actionItems: string[];
  dismissed?: boolean;
}

interface SmartRecommendationsProps {
  userRole: 'admin' | 'creator' | 'buyer';
}

export function SmartRecommendations({ userRole }: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: '1',
      type: 'revenue',
      priority: 'high',
      title: 'Implement Annual Billing Discount',
      description: 'Offer 20% discount for annual subscriptions to improve cash flow and reduce churn.',
      impact: 'High revenue impact with improved customer lifetime value',
      effort: 'low',
      estimatedGain: '+$45K ARR',
      actionItems: [
        'Create annual pricing tiers',
        'Update billing system',
        'Launch promotional campaign',
        'Monitor conversion rates'
      ]
    },
    {
      id: '2',
      type: 'growth',
      priority: 'high',
      title: 'Optimize Mobile Conversion',
      description: 'Mobile users have 35% lower conversion rate. Improve mobile checkout experience.',
      impact: 'Significant increase in mobile conversions',
      effort: 'medium',
      estimatedGain: '+15% conversions',
      actionItems: [
        'Audit mobile checkout flow',
        'Implement one-click payments',
        'Optimize form fields',
        'A/B test improvements'
      ]
    },
    {
      id: '3',
      type: 'retention',
      priority: 'medium',
      title: 'Launch Customer Success Program',
      description: 'Proactive outreach to at-risk customers can reduce churn by 25%.',
      impact: 'Reduced churn and improved satisfaction',
      effort: 'high',
      estimatedGain: '-1.2% churn rate',
      actionItems: [
        'Identify at-risk customer signals',
        'Create intervention workflows',
        'Train customer success team',
        'Implement health scoring'
      ]
    },
    {
      id: '4',
      type: 'optimization',
      priority: 'medium',
      title: 'Implement Smart Pricing',
      description: 'Dynamic pricing based on usage patterns could increase revenue per user.',
      impact: 'Optimized pricing for different user segments',
      effort: 'medium',
      estimatedGain: '+12% ARPU',
      actionItems: [
        'Analyze usage patterns',
        'Design pricing tiers',
        'Test with beta users',
        'Gradual rollout'
      ]
    },
    {
      id: '5',
      type: 'growth',
      priority: 'low',
      title: 'Referral Program Enhancement',
      description: 'Add gamification elements to increase referral program participation.',
      impact: 'Increased organic growth through referrals',
      effort: 'low',
      estimatedGain: '+8% new users',
      actionItems: [
        'Add progress tracking',
        'Implement reward tiers',
        'Create sharing tools',
        'Launch leaderboard'
      ]
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const dismissRecommendation = (id: string) => {
    setRecommendations(prev => 
      prev.map(rec => rec.id === id ? { ...rec, dismissed: true } : rec)
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'revenue':
        return <DollarSign className="w-5 h-5" />;
      case 'growth':
        return <TrendingUp className="w-5 h-5" />;
      case 'retention':
        return <Users className="w-5 h-5" />;
      case 'optimization':
        return <Target className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'revenue':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'growth':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'retention':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'optimization':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (rec.dismissed) return false;
    if (filter === 'all') return true;
    return rec.priority === filter;
  });

  const stats = {
    total: recommendations.filter(r => !r.dismissed).length,
    high: recommendations.filter(r => !r.dismissed && r.priority === 'high').length,
    implemented: recommendations.filter(r => r.dismissed).length,
    potentialGain: '$62K ARR'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Zap className="w-7 h-7 mr-3 text-yellow-500" />
            Smart Recommendations
          </h2>
          <p className="text-gray-600 mt-1">AI-powered insights to grow your business</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Recommendations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Lightbulb className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-red-600">{stats.high}</p>
            </div>
            <Star className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Implemented</p>
              <p className="text-2xl font-bold text-green-600">{stats.implemented}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Potential Gain</p>
              <p className="text-2xl font-bold text-blue-600">{stats.potentialGain}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredRecommendations.map((recommendation, index) => (
            <motion.div
              key={recommendation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg border ${getTypeColor(recommendation.type)}`}>
                    {getTypeIcon(recommendation.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{recommendation.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(recommendation.priority)}`}>
                        {recommendation.priority} priority
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(recommendation.type)}`}>
                        {recommendation.type}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{recommendation.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Impact: {recommendation.impact}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className={`w-4 h-4 ${getEffortColor(recommendation.effort)}`} />
                        <span className={getEffortColor(recommendation.effort)}>
                          {recommendation.effort} effort
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 font-medium">{recommendation.estimatedGain}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => dismissRecommendation(recommendation.id)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Action Items */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Action Items:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {recommendation.actionItems.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                    <span>View detailed plan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Dismiss
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Implement
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredRecommendations.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
          <p className="text-gray-600">No recommendations match your current filter. Check back later for new insights.</p>
        </div>
      )}
    </div>
  );
}