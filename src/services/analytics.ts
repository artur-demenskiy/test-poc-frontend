/**
 * Analytics Service
 * 
 * This service provides a centralized interface for analytics operations
 * using PostHog. It handles event tracking, user identification, and
 * provides a consistent API for analytics across the application.
 */

import posthog from 'posthog-js';
import { getAnalyticsConfig, AnalyticsConfig } from '../config/analytics';

export interface AnalyticsEvent {
  /** Event name */
  name: string;
  /** Event properties */
  properties?: Record<string, any>;
  /** User properties to set */
  userProperties?: Record<string, any>;
}

export interface UserProperties {
  /** User ID */
  id?: string;
  /** User email */
  email?: string;
  /** User name */
  name?: string;
  /** Custom user properties */
  [key: string]: any;
}

/**
 * Analytics service class for managing PostHog integration
 */
class AnalyticsService {
  private config: AnalyticsConfig;
  private isInitialized = false;

  constructor() {
    this.config = getAnalyticsConfig();
  }

  /**
   * Initialize PostHog analytics
   * 
   * @param userProperties - Optional user properties to set on initialization
   */
  public initialize(userProperties?: UserProperties): void {
    if (this.isInitialized || !this.config.enabled) {
      return;
    }

    try {
      // Initialize PostHog
      posthog.init(this.config.posthogApiKey, {
        api_host: this.config.posthogHost,
        loaded: () => {
          if (this.config.debug) {
            console.log('PostHog analytics initialized successfully');
          }
          
          // Set user properties if provided
          if (userProperties) {
            this.setUserProperties(userProperties);
          }
        },
        capture_pageview: true,
        capture_pageleave: true,
        autocapture: true,
        disable_session_recording: !this.config.debug,
        enable_recording_console_log: this.config.debug,
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize PostHog analytics:', error);
    }
  }

  /**
   * Track an analytics event
   * 
   * @param event - Event to track
   */
  public trackEvent(event: AnalyticsEvent): void {
    if (!this.isInitialized || !this.config.enabled) {
      if (this.config.debug) {
        console.log('Analytics not initialized or disabled, event skipped:', event);
      }
      return;
    }

    try {
      // Set user properties if provided
      if (event.userProperties) {
        this.setUserProperties(event.userProperties);
      }

      // Track the event
      posthog.capture(event.name, event.properties);
      
      if (this.config.debug) {
        console.log('Event tracked:', event.name, event.properties);
      }
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  /**
   * Set user properties
   * 
   * @param properties - User properties to set
   */
  public setUserProperties(properties: UserProperties): void {
    if (!this.isInitialized || !this.config.enabled) {
      return;
    }

    try {
      Object.entries(properties).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          posthog.people.set(key, value);
        }
      });
    } catch (error) {
      console.error('Failed to set user properties:', error);
    }
  }

  /**
   * Identify a user
   * 
   * @param userId - User ID to identify
   * @param properties - Optional user properties
   */
  public identify(userId: string, properties?: UserProperties): void {
    if (!this.isInitialized || !this.config.enabled) {
      return;
    }

    try {
      posthog.identify(userId, properties);
      
      if (this.config.debug) {
        console.log('User identified:', userId, properties);
      }
    } catch (error) {
      console.error('Failed to identify user:', error);
    }
  }

  /**
   * Reset user identification
   */
  public reset(): void {
    if (!this.isInitialized || !this.config.enabled) {
      return;
    }

    try {
      posthog.reset();
      
      if (this.config.debug) {
        console.log('User identification reset');
      }
    } catch (error) {
      console.error('Failed to reset user identification:', error);
    }
  }

  /**
   * Get PostHog instance for advanced usage
   * 
   * @returns PostHog instance or null if not initialized
   */
  public getPostHog(): typeof posthog | null {
    return this.isInitialized ? posthog : null;
  }

  /**
   * Check if analytics is initialized
   * 
   * @returns True if analytics is initialized and enabled
   */
  public isReady(): boolean {
    return this.isInitialized && this.config.enabled;
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();

// Export convenience functions
export const trackEvent = (event: AnalyticsEvent) => analyticsService.trackEvent(event);
export const identifyUser = (userId: string, properties?: UserProperties) => analyticsService.identify(userId, properties);
export const setUserProperties = (properties: UserProperties) => analyticsService.setUserProperties(properties);
export const resetAnalytics = () => analyticsService.reset();
export const initializeAnalytics = (userProperties?: UserProperties) => analyticsService.initialize(userProperties); 