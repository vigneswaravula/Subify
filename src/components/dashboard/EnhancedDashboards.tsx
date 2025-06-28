import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AdvancedAnalytics } from '../ui/AdvancedAnalytics';
import { SmartRecommendations } from '../ui/SmartRecommendations';
import { PerformanceMonitor } from '../ui/PerformanceMonitor';
import { AIAssistant } from '../ui/AIAssistant';
import { useAuth } from '../../context/AuthContext';

export function EnhancedAdminDashboard() {
  const [activeView, setActiveView] = useState('overview');
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {activeView === 'analytics' && <AdvancedAnalytics userRole="admin" />}
        {activeView === 'recommendations' && <SmartRecommendations userRole="admin" />}
        {activeView === 'performance' && <PerformanceMonitor />}
      </motion.div>
      
      <AIAssistant userRole="admin" />
    </div>
  );
}

export function EnhancedCreatorDashboard() {
  const [activeView, setActiveView] = useState('overview');
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {activeView === 'analytics' && <AdvancedAnalytics userRole="creator" />}
        {activeView === 'recommendations' && <SmartRecommendations userRole="creator" />}
      </motion.div>
      
      <AIAssistant userRole="creator" />
    </div>
  );
}

export function EnhancedBuyerDashboard() {
  const [activeView, setActiveView] = useState('overview');
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {activeView === 'analytics' && <AdvancedAnalytics userRole="buyer" />}
        {activeView === 'recommendations' && <SmartRecommendations userRole="buyer" />}
      </motion.div>
      
      <AIAssistant userRole="buyer" />
    </div>
  );
}