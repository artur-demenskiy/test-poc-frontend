import React from 'react';
import { ConfigProvider, theme } from 'antd';
import type { ThemeConfig } from 'antd';

// Custom Ant Design theme configuration with best practices
const customTheme: ThemeConfig = {
  token: {
    // Color palette
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    
    // Typography
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    
    // Border radius
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,
    
    // Spacing
    margin: 16,
    padding: 16,
    
    // Shadows
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    boxShadowSecondary: '0 2px 4px rgba(0, 0, 0, 0.12)',
  },
  algorithm: theme.defaultAlgorithm,
  components: {
    Button: {
      borderRadius: 6,
      controlHeight: 36,
      controlHeightLG: 44,
      controlHeightSM: 28,
      paddingInline: 16,
      paddingBlock: 8,
    },
    Card: {
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    Input: {
      borderRadius: 6,
      controlHeight: 36,
      controlHeightLG: 44,
      controlHeightSM: 28,
    },
    Select: {
      borderRadius: 6,
      controlHeight: 36,
      controlHeightLG: 44,
      controlHeightSM: 28,
    },
    Table: {
      borderRadius: 8,
    },
    Modal: {
      borderRadius: 8,
    },
    Drawer: {
      borderRadius: 8,
    },
    Menu: {
      borderRadius: 6,
      itemBorderRadius: 4,
    },
    Pagination: {
      borderRadius: 6,
    },
    Tag: {
      borderRadius: 4,
    },
    Badge: {
      borderRadius: 10,
    },
  },
};

interface AntDProviderProps {
  children: React.ReactNode;
}

export const AntDProvider: React.FC<AntDProviderProps> = ({ children }) => {
  return (
    <ConfigProvider
      theme={customTheme}
      locale={{
        locale: 'en',
        // You can add more locale configurations here
      }}
    >
      {children}
    </ConfigProvider>
  );
}; 