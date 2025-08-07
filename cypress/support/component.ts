// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your component test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add component-specific commands
Cypress.Commands.add('mount', (component: React.ReactElement) => {
  cy.mount(component);
});

Cypress.Commands.add('mountWithProviders', (component: React.ReactElement) => {
  cy.mount(component, {
    providers: {
      // Add any providers your components need
    },
  });
});

// Import global styles for component testing
import '../../src/index.css'

// Mock IntersectionObserver for component tests
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock ResizeObserver for component tests
const mockResizeObserver = jest.fn();
mockResizeObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.ResizeObserver = mockResizeObserver;

// Global error handling for component tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  if (err.message.includes('IntersectionObserver')) {
    return false;
  }
  return true;
});

// Custom commands for component testing
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to mount a React component
       * @example cy.mount(<TodoItem todo={mockTodo} />)
       */
      mount(component: React.ReactElement): Chainable<void>
      
      /**
       * Custom command to mount with providers
       * @example cy.mountWithProviders(<TodoList />)
       */
      mountWithProviders(component: React.ReactElement): Chainable<void>
      
      /**
       * Custom command to check component accessibility
       * @example cy.checkAccessibility()
       */
      checkAccessibility(): Chainable<void>
    }
  }
} 