/**
 * Analytics Demo Component
 * 
 * This component demonstrates the analytics functionality by providing
 * a user interface for tracking events, identifying users, and setting
 * user properties. It's useful for testing and development purposes.
 */

import React, { useState } from 'react';
import { useAnalytics, useTrackEvent, useIdentifyUser } from '../contexts/AnalyticsContext';

interface EventFormData {
  eventName: string;
  eventProperties: string;
  userProperties: string;
}

interface UserFormData {
  userId: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Event tracking form component
 */
const EventTrackingForm: React.FC = () => {
  const trackEvent = useTrackEvent();
  const [formData, setFormData] = useState<EventFormData>({
    eventName: '',
    eventProperties: '',
    userProperties: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const event = {
        name: formData.eventName,
        properties: formData.eventProperties ? JSON.parse(formData.eventProperties) : undefined,
        userProperties: formData.userProperties ? JSON.parse(formData.userProperties) : undefined,
      };

      trackEvent(event);
      
      // Reset form
      setFormData({
        eventName: '',
        eventProperties: '',
        userProperties: '',
      });
      
      alert('Event tracked successfully!');
    } catch (error) {
      alert('Invalid JSON format in properties fields');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-gray-200 rounded-lg mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Track Analytics Event</h3>
      
      <div>
        <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
          Event Name *
        </label>
        <input
          type="text"
          id="eventName"
          name="eventName"
          value={formData.eventName}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., button_clicked, form_submitted"
        />
      </div>

      <div>
        <label htmlFor="eventProperties" className="block text-sm font-medium text-gray-700 mb-1">
          Event Properties (JSON)
        </label>
        <textarea
          id="eventProperties"
          name="eventProperties"
          value={formData.eventProperties}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder='{"button_name": "submit", "page": "home"}'
        />
        <p className="text-xs text-gray-500 mt-1">Optional: JSON object for event properties</p>
      </div>

      <div>
        <label htmlFor="userProperties" className="block text-sm font-medium text-gray-700 mb-1">
          User Properties (JSON)
        </label>
        <textarea
          id="userProperties"
          name="userProperties"
          value={formData.userProperties}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder='{"plan": "premium", "signup_date": "2024-01-01"}'
        />
        <p className="text-xs text-gray-500 mt-1">Optional: JSON object for user properties</p>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Track Event
      </button>
    </form>
  );
};

/**
 * User identification form component
 */
const UserIdentificationForm: React.FC = () => {
  const identifyUser = useIdentifyUser();
  const [formData, setFormData] = useState<UserFormData>({
    userId: '',
    email: '',
    name: '',
    role: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userProperties: Record<string, any> = {};
    if (formData.email) userProperties['email'] = formData.email;
    if (formData.name) userProperties['name'] = formData.name;
    if (formData.role) userProperties['role'] = formData.role;

    identifyUser(formData.userId, userProperties);
    
    alert('User identified successfully!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-gray-200 rounded-lg mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Identify User</h3>
      
      <div>
        <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
          User ID *
        </label>
        <input
          type="text"
          id="userId"
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter unique user identifier"
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
          placeholder="Enter user email"
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
          placeholder="Enter user name"
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
          placeholder="Enter user role"
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Identify User
      </button>
    </form>
  );
};

/**
 * Main analytics demo component
 */
export const AnalyticsDemo: React.FC = () => {
  const { isReady, resetAnalytics } = useAnalytics();
  const trackEvent = useTrackEvent();

  if (!isReady) {
    return (
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <h2 className="text-lg font-medium text-gray-800 mb-2">Loading Analytics</h2>
        <p className="text-gray-600">Initializing PostHog analytics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Demo</h1>
        <p className="text-gray-600">
          Test and demonstrate PostHog analytics functionality. Track events, identify users,
          and monitor analytics data in real-time.
        </p>
      </div>

      {/* Status */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
          <span className="text-green-800 font-medium">Analytics Ready</span>
        </div>
        <p className="text-green-700 mt-1">
          PostHog analytics is initialized and ready to track events.
        </p>
      </div>

      {/* User Identification */}
      <UserIdentificationForm />

      {/* Event Tracking */}
      <EventTrackingForm />

      {/* Actions */}
      <div className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => {
                trackEvent({
                  name: 'demo_button_clicked',
                  properties: { button: 'quick_action', timestamp: new Date().toISOString() }
                });
                alert('Demo event tracked!');
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Track Demo Event
            </button>
            
            <button
              onClick={() => {
                resetAnalytics();
                alert('Analytics reset successfully!');
              }}
              className="ml-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Reset Analytics
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">How to Use</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• First identify a user to set user context for analytics</li>
            <li>• Track custom events with optional properties</li>
            <li>• Monitor events in your PostHog dashboard</li>
            <li>• Use the reset button to clear user identification</li>
            <li>• Check browser console for debug information</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 