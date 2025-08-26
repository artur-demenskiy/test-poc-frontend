/**
 * Analytics Page
 * 
 * This page demonstrates the analytics and feature flags functionality
 * of the application. It provides a comprehensive interface for testing
 * PostHog analytics and Unleash feature flags.
 */

import React, { useState } from 'react';
import { AnalyticsDemo } from '../components/AnalyticsDemo';
import { FeatureFlagsManager } from '../components/FeatureFlagsManager';

type TabType = 'analytics' | 'feature-flags';

/**
 * Analytics page component
 * 
 * This page provides tabs to switch between analytics demo and feature flags
 * management, allowing users to test both systems in one place.
 */
export const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('analytics');

  const tabs = [
    { id: 'analytics' as TabType, name: 'Analytics Demo', component: <AnalyticsDemo /> },
    { id: 'feature-flags' as TabType, name: 'Feature Flags', component: <FeatureFlagsManager /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics & Feature Flags</h1>
                <p className="mt-2 text-gray-600">
                  Test and manage PostHog analytics and Unleash feature flags
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="py-8">
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
}; 