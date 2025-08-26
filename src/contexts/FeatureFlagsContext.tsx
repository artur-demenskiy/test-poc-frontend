/**
 * Feature Flags Context
 * 
 * This context provides feature flag functionality throughout the React component tree.
 * It manages Unleash integration, user context, and provides convenient
 * methods for checking feature flags and getting variants.
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  FlagProvider, 
  featureFlagsService,
  UserContext,
  initializeFeatureFlags,
  setUserContext,
  getUserContext
} from '../services/featureFlags';
import { getFeatureFlagsConfig } from '../config/featureFlags';

interface FeatureFlagsContextType {
  /** Whether feature flags are ready */
  isReady: boolean;
  /** Set user context for feature flag evaluation */
  setUserContext: (context: UserContext) => void;
  /** Get current user context */
  getUserContext: () => UserContext;
  /** Get feature flags configuration */
  getConfig: () => ReturnType<typeof getFeatureFlagsConfig>;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(undefined);

interface FeatureFlagsProviderProps {
  /** React children */
  children: ReactNode;
  /** Initial user context */
  initialUserContext?: UserContext;
  /** Whether to auto-initialize feature flags */
  autoInitialize?: boolean;
}

/**
 * Feature flags provider component
 * 
 * This component initializes Unleash feature flags and provides the feature
 * flags context to all child components. It wraps the Unleash FlagProvider
 * and manages user context for feature flag evaluation.
 */
export const FeatureFlagsProvider: React.FC<FeatureFlagsProviderProps> = ({ 
  children, 
  initialUserContext,
  autoInitialize = true 
}) => {
  const [isReady, setIsReady] = useState(false);
  const config = getFeatureFlagsConfig();

  useEffect(() => {
    if (autoInitialize) {
      // Initialize feature flags service with optional user context
      initializeFeatureFlags(initialUserContext);
      
      // Check if feature flags are ready
      const checkReady = () => {
        const ready = featureFlagsService.isReady();
        setIsReady(ready);
      };
      
      checkReady();
    }
  }, [autoInitialize, initialUserContext]);

  const contextValue: FeatureFlagsContextType = {
    isReady,
    setUserContext,
    getUserContext,
    getConfig: () => config,
  };

  // Only render FlagProvider if feature flags are enabled
  if (!config.enabled) {
    return (
      <FeatureFlagsContext.Provider value={contextValue}>
        {children}
      </FeatureFlagsContext.Provider>
    );
  }

  return (
    <FeatureFlagsContext.Provider value={contextValue}>
      <FlagProvider
        config={{
          url: config.unleashUrl,
          clientKey: config.clientKey,
          appName: config.appName,
          environment: config.environment,
          refreshInterval: config.refreshInterval,
        }}
      >
        {children}
      </FlagProvider>
    </FeatureFlagsContext.Provider>
  );
};

/**
 * Hook for using feature flags context
 * 
 * @returns Feature flags context value
 * @throws Error if used outside of FeatureFlagsProvider
 */
export const useFeatureFlags = (): FeatureFlagsContextType => {
  const context = useContext(FeatureFlagsContext);
  
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
  }
  
  return context;
};

/**
 * Hook for setting user context
 * 
 * @returns Function to set user context
 */
export const useSetUserContext = () => {
  const { setUserContext } = useFeatureFlags();
  return setUserContext;
};

/**
 * Hook for getting user context
 * 
 * @returns Function to get user context
 */
export const useGetUserContext = () => {
  const { getUserContext } = useFeatureFlags();
  return getUserContext;
}; 