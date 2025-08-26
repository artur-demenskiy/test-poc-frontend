/**
 * Feature Flags Service
 * 
 * This service provides a centralized interface for feature flag operations
 * using Unleash. It handles flag evaluation, user context, and provides
 * a consistent API for feature flags across the application.
 */

import { FlagProvider, useFlag, useVariant } from '@unleash/proxy-client-react';
import { getFeatureFlagsConfig, FeatureFlagsConfig } from '../config/featureFlags';

export interface UserContext {
  /** User ID */
  userId?: string;
  /** User email */
  email?: string;
  /** User name */
  name?: string;
  /** User role */
  role?: string;
  /** Custom properties */
  [key: string]: any;
}

export interface FeatureFlagVariant {
  /** Variant name */
  name: string;
  /** Variant payload */
  payload?: any;
  /** Whether this is the default variant */
  enabled: boolean;
}

/**
 * Feature flags service class for managing Unleash integration
 */
class FeatureFlagsService {
  private config: FeatureFlagsConfig;
  private isInitialized = false;
  private userContext: UserContext = {};

  constructor() {
    this.config = getFeatureFlagsConfig();
  }

  /**
   * Initialize feature flags service
   * 
   * @param userContext - Optional user context to set on initialization
   */
  public initialize(userContext?: UserContext): void {
    if (this.isInitialized || !this.config.enabled) {
      return;
    }

    try {
      if (userContext) {
        this.setUserContext(userContext);
      }

      this.isInitialized = true;
      
      if (this.config.debug) {
        console.log('Feature flags service initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize feature flags service:', error);
    }
  }

  /**
   * Set user context for feature flag evaluation
   * 
   * @param context - User context to set
   */
  public setUserContext(context: UserContext): void {
    if (!this.isInitialized || !this.config.enabled) {
      return;
    }

    try {
      this.userContext = { ...this.userContext, ...context };
      
      if (this.config.debug) {
        console.log('User context updated:', this.userContext);
      }
    } catch (error) {
      console.error('Failed to set user context:', error);
    }
  }

  /**
   * Get current user context
   * 
   * @returns Current user context
   */
  public getUserContext(): UserContext {
    return { ...this.userContext };
  }

  /**
   * Check if a feature flag is enabled
   * 
   * @param flagName - Name of the feature flag to check
   * @returns True if the flag is enabled
   */
  public isEnabled(flagName: string): boolean {
    if (!this.isInitialized || !this.config.enabled) {
      if (this.config.debug) {
        console.log(`Feature flag check skipped (not initialized): ${flagName}`);
      }
      return false;
    }

    // For now, return false as the actual evaluation happens in React components
    // This method is provided for non-React contexts
    if (this.config.debug) {
      console.log(`Feature flag check requested: ${flagName}`);
    }
    
    return false;
  }

  /**
   * Get feature flag configuration
   * 
   * @returns Feature flags configuration
   */
  public getConfig(): FeatureFlagsConfig {
    return { ...this.config };
  }

  /**
   * Check if feature flags service is ready
   * 
   * @returns True if service is initialized and enabled
   */
  public isReady(): boolean {
    return this.isInitialized && this.config.enabled;
  }
}

// Export singleton instance
export const featureFlagsService = new FeatureFlagsService();

// Export convenience functions
export const setUserContext = (context: UserContext) => featureFlagsService.setUserContext(context);
export const getUserContext = () => featureFlagsService.getUserContext();
export const isFeatureEnabled = (flagName: string) => featureFlagsService.isEnabled(flagName);
export const initializeFeatureFlags = (userContext?: UserContext) => featureFlagsService.initialize(userContext);

// Re-export React hooks for convenience
export { FlagProvider, useFlag, useVariant };

/**
 * Hook for checking if a feature flag is enabled
 * 
 * @param flagName - Name of the feature flag
 * @returns Boolean indicating if the flag is enabled
 */
export const useFeatureFlag = (flagName: string): boolean => {
  return useFlag(flagName);
};

/**
 * Hook for getting feature flag variant information
 * 
 * @param flagName - Name of the feature flag
 * @returns FeatureFlagVariant object with variant details
 */
export const useFeatureVariant = (flagName: string): FeatureFlagVariant => {
  const variant = useVariant(flagName);
  
  return {
    name: variant.name || 'disabled',
    payload: variant.payload,
    enabled: variant.enabled || false,
  };
}; 