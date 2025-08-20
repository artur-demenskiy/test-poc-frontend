import React from 'react';
import { MantineProvider as MantineCoreProvider } from '@mantine/core';
import { theme } from '@mantine/core';

interface MantineProviderProps {
  children: React.ReactNode;
}

export const MantineProvider: React.FC<MantineProviderProps> = ({ children }) => {
  return (
    <MantineCoreProvider
      theme={{
        ...theme,
        primaryColor: 'blue',
        fontFamily: 'Inter, sans-serif',
        components: {
          Button: {
            defaultProps: {
              size: 'md',
            },
          },
          Card: {
            defaultProps: {
              shadow: 'sm',
              radius: 'md',
            },
          },
        },
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      {children}
    </MantineCoreProvider>
  );
}; 