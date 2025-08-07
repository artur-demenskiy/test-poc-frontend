// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Import Cypress Testing Library for accessibility-first testing
import '@testing-library/cypress/add-commands'

// Add custom commands for better test organization
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.findByLabelText(/email/i).type(email);
  cy.findByLabelText(/password/i).type(password);
  cy.findByRole('button', { name: /sign in/i }).click();
});

Cypress.Commands.add('createTodo', (title: string, description?: string) => {
  cy.findByRole('textbox', { name: /todo title/i }).type(title);
  if (description) {
    cy.findByLabelText(/description/i).type(description);
  }
  cy.findByRole('button', { name: /add todo/i }).click();
});

Cypress.Commands.add('deleteTodo', (title: string) => {
  cy.findByRole('button', { name: new RegExp(`delete ${title}`, 'i') }).click();
});

// Add custom commands for data-testid selectors (fallback)
Cypress.Commands.add('getByTestId', (selector: string, ...args) => {
  return cy.get(`[data-testid=${selector}]`, ...args);
});

Cypress.Commands.add('getByTestIdLike', (selector: string, ...args) => {
  return cy.get(`[data-testid*=${selector}]`, ...args);
});

// Add custom assertions
Cypress.Commands.add('shouldHaveAccessibility', () => {
  cy.injectAxe();
  cy.checkA11y();
});

// Performance testing commands
Cypress.Commands.add('measurePerformance', () => {
  cy.window().then((win) => {
    const performance = win.performance;
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    cy.log(`Page Load Time: ${navigation.loadEventEnd - navigation.loadEventStart}ms`);
    cy.log(`DOM Content Loaded: ${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`);
  });
});

// API testing commands
Cypress.Commands.add('apiRequest', (method: string, endpoint: string, body?: any) => {
  return cy.request({
    method,
    url: `${Cypress.env('apiUrl')}${endpoint}`,
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      createTodo(title: string, description?: string): Chainable<void>;
      deleteTodo(title: string): Chainable<void>;
      getByTestId(selector: string, ...args: any[]): Chainable<JQuery<HTMLElement>>;
      getByTestIdLike(selector: string, ...args: any[]): Chainable<JQuery<HTMLElement>>;
      shouldHaveAccessibility(): Chainable<void>;
      measurePerformance(): Chainable<void>;
      apiRequest(method: string, endpoint: string, body?: any): Chainable<any>;
    }
  }
} 