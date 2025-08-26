/**
 * Feature Flags Configuration
 * 
 * This module provides configuration for Unleash feature flags integration.
 * It handles environment-based configuration and provides a centralized
 * way to manage feature flag settings across the application.
 */

export interface FeatureFlagsConfig {
  /** Unleash proxy URL */
  unleashUrl: string;
  /** Unleash client key */
  clientKey: string;
  /** Application name for Unleash */
  appName: string;
  /** Environment name for feature flags */
  environment: string;
  /** Whether feature flags are enabled */
  enabled: boolean;
  /** Refresh interval in milliseconds */
  refreshInterval: number;
  /** Whether to enable debug mode */
  debug: boolean;
}

/**
 * Get feature flags configuration from environment variables
 * 
 * @returns FeatureFlagsConfig object with current settings
 */
export const getFeatureFlagsConfig = (): FeatureFlagsConfig => {
  const config: FeatureFlagsConfig = {
    unleashUrl: import.meta.env['VITE_UNLEASH_URL'] || 'http://localhost:3000/proxy',
    clientKey: import.meta.env['VITE_UNLEASH_CLIENT_KEY'] || '',
    appName: import.meta.env['VITE_UNLEASH_APP_NAME'] || 'todo-react-app',
    environment: import.meta.env['VITE_UNLEASH_ENVIRONMENT'] || 'development',
    enabled: import.meta.env['VITE_FEATURE_FLAGS_ENABLED'] === 'true',
    refreshInterval: parseInt(import.meta.env['VITE_UNLEASH_REFRESH_INTERVAL'] || '30000', 10),
    debug: import.meta.env['VITE_FEATURE_FLAGS_DEBUG'] === 'true',
  };

  // Validate required configuration
  if (config.enabled && !config.unleashUrl) {
    console.warn('Feature flags are enabled but Unleash URL is missing');
  }

  return config;
};

/**
 * Default feature flags configuration for development
 */
export const defaultFeatureFlagsConfig: FeatureFlagsConfig = {
  unleashUrl: 'http://localhost:3000/proxy',
  clientKey: '',
  appName: 'todo-react-app',
  environment: 'development',
  enabled: false,
  refreshInterval: 30000,
  debug: true,
}; 