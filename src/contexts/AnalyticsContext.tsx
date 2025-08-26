/**
 * Analytics Context
 * 
 * This context provides analytics functionality throughout the React component tree.
 * It manages PostHog initialization, user identification, and provides
 * convenient methods for tracking events and setting user properties.
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  analyticsService, 
  AnalyticsEvent, 
  UserProperties,
  initializeAnalytics,
  identifyUser,
  setUserProperties,
  resetAnalytics,
  trackEvent
} from '../services/analytics';

interface AnalyticsContextType {
  /** Whether analytics is ready */
  isReady: boolean;
  /** Track an analytics event */
  trackEvent: (event: AnalyticsEvent) => void;
  /** Identify a user */
  identifyUser: (userId: string, properties?: UserProperties) => void;
  /** Set user properties */
  setUserProperties: (properties: UserProperties) => void;
  /** Reset user identification */
  resetAnalytics: () => void;
  /** Get analytics service instance */
  getService: () => typeof analyticsService;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface AnalyticsProviderProps {
  /** React children */
  children: ReactNode;
  /** Initial user properties */
  initialUserProperties?: UserProperties;
  /** Whether to auto-initialize analytics */
  autoInitialize?: boolean;
}

/**
 * Analytics provider component
 * 
 * This component initializes PostHog analytics and provides the analytics
 * context to all child components. It handles automatic initialization
 * and provides a clean API for analytics operations.
 */
export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ 
  children, 
  initialUserProperties,
  autoInitialize = true 
}) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (autoInitialize) {
      // Initialize analytics with optional user properties
      initializeAnalytics(initialUserProperties);
      
      // Check if analytics is ready
      const checkReady = () => {
        const ready = analyticsService.isReady();
        setIsReady(ready);
        
        if (!ready && analyticsService.getPostHog()) {
          // Wait a bit more for PostHog to fully initialize
          setTimeout(checkReady, 100);
        }
      };
      
      checkReady();
    }
  }, [autoInitialize, initialUserProperties]);

  const contextValue: AnalyticsContextType = {
    isReady,
    trackEvent,
    identifyUser,
    setUserProperties,
    resetAnalytics,
    getService: () => analyticsService,
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

/**
 * Hook for using analytics context
 * 
 * @returns Analytics context value
 * @throws Error if used outside of AnalyticsProvider
 */
export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  
  return context;
};

/**
 * Hook for tracking analytics events
 * 
 * @returns Function to track events
 */
export const useTrackEvent = () => {
  const { trackEvent } = useAnalytics();
  return trackEvent;
};

/**
 * Hook for user identification
 * 
 * @returns Function to identify users
 */
export const useIdentifyUser = () => {
  const { identifyUser } = useAnalytics();
  return identifyUser;
}; 