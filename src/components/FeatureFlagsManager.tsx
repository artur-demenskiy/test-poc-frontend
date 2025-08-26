/**
 * Feature Flags Manager Component
 * 
 * This component provides a user interface for managing feature flags.
 * It displays current feature flag states, allows toggling flags for
 * development/testing purposes, and shows user context information.
 * 
 * Note: This component is primarily intended for development and testing.
 * In production, feature flags should be managed through the Unleash dashboard.
 */

import React, { useState, useEffect } from 'react';
import { useFeatureFlags } from '../contexts/FeatureFlagsContext';
import { useFeatureFlag, useFeatureVariant } from '../services/featureFlags';

interface FeatureFlagToggleProps {
  /** Feature flag name */
  flagName: string;
  /** Feature flag description */
  description?: string;
}

/**
 * Individual feature flag toggle component
 */
const FeatureFlagToggle: React.FC<FeatureFlagToggleProps> = ({ flagName, description }) => {
  const isEnabled = useFeatureFlag(flagName);
  const variant = useFeatureVariant(flagName);

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-3">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{flagName}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
        <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
          <span>Status: {isEnabled ? 'Enabled' : 'Disabled'}</span>
          {variant.name !== 'disabled' && (
            <span>Variant: {variant.name}</span>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${isEnabled ? 'bg-green-500' : 'bg-gray-300'}`} />
        <span className="text-sm font-medium">
          {isEnabled ? 'ON' : 'OFF'}
        </span>
      </div>
    </div>
  );
};

/**
 * User context form component
 */
const UserContextForm: React.FC = () => {
  const { getUserContext, setUserContext } = useFeatureFlags();
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    name: '',
    role: '',
  });

  useEffect(() => {
    const context = getUserContext();
    setFormData({
      userId: context.userId || '',
      email: context.email || '',
      name: context.name || '',
      role: context.role || '',
    });
  }, [getUserContext]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const context: Record<string, any> = {};
    if (formData.userId) context['userId'] = formData.userId;
    if (formData.email) context['email'] = formData.email;
    if (formData.name) context['name'] = formData.name;
    if (formData.role) context['role'] = formData.role;
    
    setUserContext(context);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-gray-200 rounded-lg mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">User Context</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
            User ID
          </label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter user ID"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email"
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter name"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter role"
          />
        </div>
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Update Context
      </button>
    </form>
  );
};

/**
 * Main feature flags manager component
 */
export const FeatureFlagsManager: React.FC = () => {
  const { isReady, getConfig } = useFeatureFlags();
  const config = getConfig();

  // Example feature flags - these would typically come from your Unleash configuration
  const exampleFlags = [
    { name: 'new-ui-design', description: 'Enable new user interface design' },
    { name: 'advanced-search', description: 'Enable advanced search functionality' },
    { name: 'dark-mode', description: 'Enable dark mode theme' },
    { name: 'beta-features', description: 'Enable beta features for testing' },
  ];

  if (!config.enabled) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-lg font-medium text-yellow-800 mb-2">Feature Flags Disabled</h2>
        <p className="text-yellow-700">
          Feature flags are currently disabled. Enable them by setting{' '}
          <code className="bg-yellow-100 px-1 py-0.5 rounded">VITE_FEATURE_FLAGS_ENABLED=true</code>{' '}
          in your environment variables.
        </p>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <h2 className="text-lg font-medium text-gray-800 mb-2">Loading Feature Flags</h2>
        <p className="text-gray-600">Initializing feature flags service...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Feature Flags Manager</h1>
        <p className="text-gray-600">
          Manage and monitor feature flags for development and testing purposes.
        </p>
      </div>

      {/* Configuration Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">URL:</span> {config.unleashUrl}
          </div>
          <div>
            <span className="font-medium">Environment:</span> {config.environment}
          </div>
          <div>
            <span className="font-medium">App Name:</span> {config.appName}
          </div>
          <div>
            <span className="font-medium">Refresh Interval:</span> {config.refreshInterval}ms
          </div>
        </div>
      </div>

      {/* User Context Form */}
      <UserContextForm />

      {/* Feature Flags List */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Feature Flags</h2>
        <div className="space-y-3">
          {exampleFlags.map(flag => (
            <FeatureFlagToggle
              key={flag.name}
              flagName={flag.name}
              description={flag.description}
            />
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-2">How to Use</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Update user context to test feature flags for different users</li>
          <li>• Feature flags are evaluated based on user context and Unleash rules</li>
          <li>• Changes to user context will immediately affect feature flag evaluation</li>
          <li>• For production use, manage flags through the Unleash dashboard</li>
        </ul>
      </div>
    </div>
  );
}; 