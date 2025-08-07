// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Add custom commands for better test organization
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-testid=email-input]').type(email);
  cy.get('[data-testid=password-input]').type(password);
  cy.get('[data-testid=login-button]').click();
});

Cypress.Commands.add('createTodo', (title: string, description?: string) => {
  cy.get('[data-testid=todo-form]').within(() => {
    cy.get('[data-testid=todo-title-input]').type(title);
    if (description) {
      cy.get('[data-testid=todo-description-input]').type(description);
    }
    cy.get('[data-testid=add-todo-button]').click();
  });
});

Cypress.Commands.add('deleteTodo', (todoId: string) => {
  cy.get(`[data-testid=todo-item-${todoId}]`).within(() => {
    cy.get('[data-testid=delete-todo-button]').click();
  });
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
      deleteTodo(todoId: string): Chainable<void>;
      shouldHaveAccessibility(): Chainable<void>;
      measurePerformance(): Chainable<void>;
      apiRequest(method: string, endpoint: string, body?: any): Chainable<any>;
    }
  }
} 