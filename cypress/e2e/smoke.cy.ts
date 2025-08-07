describe('Smoke Tests - Critical Functionality', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Application Loading', () => {
    it('should load the application successfully', () => {
      // Check if main elements are present
      cy.get('[data-testid=todo-form]').should('be.visible');
      cy.get('[data-testid=todo-list]').should('be.visible');
      
      // Check if form inputs are functional
      cy.get('[data-testid=todo-title-input]').should('be.enabled');
      cy.get('[data-testid=todo-description-input]').should('be.enabled');
      cy.get('[data-testid=add-todo-button]').should('be.visible');
    });

    it('should have proper page title', () => {
      cy.title().should('contain', 'Todo');
    });

    it('should load within acceptable time', () => {
      cy.measurePerformance();
      cy.get('[data-testid=todo-form]', { timeout: 5000 }).should('be.visible');
    });
  });

  describe('Core Todo Operations', () => {
    it('should create a todo successfully', () => {
      const todoTitle = 'Smoke Test Todo';
      
      cy.get('[data-testid=todo-title-input]').type(todoTitle);
      cy.get('[data-testid=add-todo-button]').click();
      
      cy.get('[data-testid=todo-list]').should('contain', todoTitle);
    });

    it('should mark a todo as completed', () => {
      // Create a todo first
      cy.get('[data-testid=todo-title-input]').type('Complete this todo');
      cy.get('[data-testid=add-todo-button]').click();
      
      // Mark as completed
      cy.get('[data-testid=todo-item]').first().within(() => {
        cy.get('[data-testid=todo-checkbox]').click();
      });
      
      // Verify completion
      cy.get('[data-testid=todo-item]').first().should('have.class', 'completed');
    });

    it('should delete a todo', () => {
      // Create a todo first
      cy.get('[data-testid=todo-title-input]').type('Delete this todo');
      cy.get('[data-testid=add-todo-button]').click();
      
      // Delete the todo
      cy.get('[data-testid=todo-item]').first().within(() => {
        cy.get('[data-testid=delete-todo-button]').click();
      });
      
      // Verify deletion
      cy.get('[data-testid=todo-list]').should('not.contain', 'Delete this todo');
    });
  });

  describe('Form Validation', () => {
    it('should prevent submission with empty title', () => {
      cy.get('[data-testid=add-todo-button]').should('be.disabled');
    });

    it('should allow submission with valid title', () => {
      cy.get('[data-testid=todo-title-input]').type('Valid Todo');
      cy.get('[data-testid=add-todo-button]').should('be.enabled');
    });
  });

  describe('Basic Navigation', () => {
    it('should support keyboard navigation', () => {
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'todo-title-input');
      
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'todo-description-input');
    });

    it('should handle Enter key submission', () => {
      cy.get('[data-testid=todo-title-input]').type('Enter Key Todo{enter}');
      cy.get('[data-testid=todo-list]').should('contain', 'Enter Key Todo');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      // Simulate network error
      cy.intercept('POST', '/api/todos', { forceNetworkError: true }).as('networkError');
      
      cy.get('[data-testid=todo-title-input]').type('Should fail');
      cy.get('[data-testid=add-todo-button]').click();
      
      // Should not crash the application
      cy.get('[data-testid=todo-form]').should('be.visible');
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should work on mobile viewport', () => {
      cy.viewport('iphone-x');
      
      cy.get('[data-testid=todo-form]').should('be.visible');
      cy.get('[data-testid=todo-title-input]').should('be.visible');
      cy.get('[data-testid=add-todo-button]').should('be.visible');
      
      // Test basic functionality on mobile
      cy.get('[data-testid=todo-title-input]').type('Mobile Todo');
      cy.get('[data-testid=add-todo-button]').click();
      cy.get('[data-testid=todo-list]').should('contain', 'Mobile Todo');
    });
  });

  describe('Data Persistence', () => {
    it('should maintain data after page reload', () => {
      // Create a todo
      cy.get('[data-testid=todo-title-input]').type('Persistent Todo');
      cy.get('[data-testid=add-todo-button]').click();
      
      // Reload page
      cy.reload();
      
      // Verify todo still exists
      cy.get('[data-testid=todo-list]').should('contain', 'Persistent Todo');
    });
  });

  describe('Performance Baseline', () => {
    it('should handle multiple todos without performance degradation', () => {
      // Create several todos
      for (let i = 0; i < 5; i++) {
        cy.get('[data-testid=todo-title-input]').type(`Todo ${i + 1}`);
        cy.get('[data-testid=add-todo-button]').click();
      }
      
      // Verify all todos are displayed
      cy.get('[data-testid=todo-item]').should('have.length', 5);
      
      // Verify form is still responsive
      cy.get('[data-testid=todo-form]').should('be.visible');
      cy.get('[data-testid=add-todo-button]').should('be.enabled');
    });
  });
}); 