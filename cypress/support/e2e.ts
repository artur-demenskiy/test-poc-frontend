// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
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

// Hide fetch/XHR requests from command log
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML =
    '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

// Global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  return true;
});

// Custom commands for better test readability
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to add a new todo
       * @example cy.addTodo('Buy groceries', 'Need to buy milk and bread')
       */
      addTodo(title: string, description?: string): Chainable<void>
      
      /**
       * Custom command to complete a todo
       * @example cy.completeTodo('Buy groceries')
       */
      completeTodo(title: string): Chainable<void>
      
      /**
       * Custom command to delete a todo
       * @example cy.deleteTodo('Buy groceries')
       */
      deleteTodo(title: string): Chainable<void>
      
      /**
       * Custom command to filter todos by status
       * @example cy.filterTodos('active')
       */
      filterTodos(status: 'all' | 'active' | 'completed'): Chainable<void>
      
      /**
       * Custom command to search todos
       * @example cy.searchTodos('groceries')
       */
      searchTodos(query: string): Chainable<void>
    }
  }
} 