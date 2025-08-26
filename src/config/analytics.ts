/**
 * Analytics Configuration
 * 
 * This module provides configuration for PostHog analytics integration.
 * It handles environment-based configuration and provides a centralized
 * way to manage analytics settings across the application.
 */

export interface AnalyticsConfig {
  /** PostHog project API key */
  posthogApiKey: string;
  /** PostHog instance URL */
  posthogHost: string;
  /** Whether analytics is enabled */
  enabled: boolean;
  /** Environment name for analytics */
  environment: string;
  /** Whether to enable debug mode */
  debug: boolean;
}

/**
 * Get analytics configuration from environment variables
 * 
 * @returns AnalyticsConfig object with current settings
 */
export const getAnalyticsConfig = (): AnalyticsConfig => {
  const config: AnalyticsConfig = {
    posthogApiKey: import.meta.env['VITE_POSTHOG_API_KEY'] || '',
    posthogHost: import.meta.env['VITE_POSTHOG_HOST'] || 'https://app.posthog.com',
    enabled: import.meta.env['VITE_ANALYTICS_ENABLED'] === 'true',
    environment: import.meta.env['VITE_ANALYTICS_ENVIRONMENT'] || 'development',
    debug: import.meta.env['VITE_ANALYTICS_DEBUG'] === 'true',
  };

  // Validate required configuration
  if (config.enabled && !config.posthogApiKey) {
    console.warn('Analytics is enabled but PostHog API key is missing');
  }

  return config;
};

/**
 * Default analytics configuration for development
 */
export const defaultAnalyticsConfig: AnalyticsConfig = {
  posthogApiKey: '',
  posthogHost: 'https://app.posthog.com',
  enabled: false,
  environment: 'development',
  debug: true,
}; 