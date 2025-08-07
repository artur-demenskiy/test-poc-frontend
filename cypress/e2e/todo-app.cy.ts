describe('Todo Application E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Todo Management', () => {
    it('should create a new todo', () => {
      const todoTitle = 'Test Todo';
      const todoDescription = 'Test Description';

      cy.get('[data-testid=todo-form]').should('be.visible');
      cy.get('[data-testid=todo-title-input]').type(todoTitle);
      cy.get('[data-testid=todo-description-input]').type(todoDescription);
      cy.get('[data-testid=add-todo-button]').click();

      cy.get('[data-testid=todo-list]').should('contain', todoTitle);
      cy.get('[data-testid=todo-list]').should('contain', todoDescription);
    });

    it('should mark todo as completed', () => {
      // First create a todo
      cy.createTodo('Complete this todo');

      // Mark it as completed
      cy.get('[data-testid=todo-item]').first().within(() => {
        cy.get('[data-testid=todo-checkbox]').click();
      });

      // Verify it's marked as completed
      cy.get('[data-testid=todo-item]').first().should('have.class', 'completed');
    });

    it('should delete a todo', () => {
      // First create a todo
      cy.createTodo('Delete this todo');

      // Delete the todo
      cy.get('[data-testid=todo-item]').first().within(() => {
        cy.get('[data-testid=delete-todo-button]').click();
      });

      // Verify it's deleted
      cy.get('[data-testid=todo-list]').should('not.contain', 'Delete this todo');
    });

    it('should edit a todo', () => {
      // First create a todo
      cy.createTodo('Original title');

      // Edit the todo
      cy.get('[data-testid=todo-item]').first().within(() => {
        cy.get('[data-testid=edit-todo-button]').click();
        cy.get('[data-testid=todo-title-input]').clear().type('Updated title');
        cy.get('[data-testid=save-todo-button]').click();
      });

      // Verify it's updated
      cy.get('[data-testid=todo-list]').should('contain', 'Updated title');
      cy.get('[data-testid=todo-list]').should('not.contain', 'Original title');
    });
  });

  describe('Todo Filtering', () => {
    beforeEach(() => {
      // Create multiple todos with different states
      cy.createTodo('Active todo 1');
      cy.createTodo('Active todo 2');
      
      // Mark one as completed
      cy.get('[data-testid=todo-item]').first().within(() => {
        cy.get('[data-testid=todo-checkbox]').click();
      });
    });

    it('should filter by all todos', () => {
      cy.get('[data-testid=filter-all]').click();
      cy.get('[data-testid=todo-item]').should('have.length', 2);
    });

    it('should filter by active todos', () => {
      cy.get('[data-testid=filter-active]').click();
      cy.get('[data-testid=todo-item]').should('have.length', 1);
      cy.get('[data-testid=todo-list]').should('contain', 'Active todo 2');
    });

    it('should filter by completed todos', () => {
      cy.get('[data-testid=filter-completed]').click();
      cy.get('[data-testid=todo-item]').should('have.length', 1);
      cy.get('[data-testid=todo-list]').should('contain', 'Active todo 1');
    });
  });

  describe('Todo Search', () => {
    beforeEach(() => {
      cy.createTodo('React todo');
      cy.createTodo('Vue todo');
      cy.createTodo('Angular todo');
    });

    it('should search todos by title', () => {
      cy.get('[data-testid=search-input]').type('React');
      cy.get('[data-testid=todo-item]').should('have.length', 1);
      cy.get('[data-testid=todo-list]').should('contain', 'React todo');
    });

    it('should clear search results', () => {
      cy.get('[data-testid=search-input]').type('React');
      cy.get('[data-testid=todo-item]').should('have.length', 1);
      
      cy.get('[data-testid=search-input]').clear();
      cy.get('[data-testid=todo-item]').should('have.length', 3);
    });
  });

  describe('Performance Tests', () => {
    it('should load the page within acceptable time', () => {
      cy.measurePerformance();
      
      // Check if page loads within 3 seconds
      cy.get('[data-testid=todo-form]', { timeout: 3000 }).should('be.visible');
    });

    it('should handle large number of todos efficiently', () => {
      // Create multiple todos to test performance
      for (let i = 0; i < 10; i++) {
        cy.createTodo(`Todo ${i + 1}`);
      }

      cy.get('[data-testid=todo-item]').should('have.length', 10);
      
      // Verify that the page is still responsive
      cy.get('[data-testid=todo-form]').should('be.visible');
      cy.get('[data-testid=add-todo-button]').should('be.enabled');
    });
  });

  describe('Accessibility Tests', () => {
    it('should meet accessibility standards', () => {
      cy.shouldHaveAccessibility();
    });

    it('should be keyboard navigable', () => {
      // Test tab navigation
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'todo-title-input');
      
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'todo-description-input');
      
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'add-todo-button');
    });

    it('should have proper ARIA labels', () => {
      cy.get('[data-testid=todo-title-input]').should('have.attr', 'aria-label');
      cy.get('[data-testid=todo-description-input]').should('have.attr', 'aria-label');
      cy.get('[data-testid=add-todo-button]').should('have.attr', 'aria-label');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      // Intercept API calls and simulate network error
      cy.intercept('POST', '/api/todos', { forceNetworkError: true }).as('createTodoError');
      
      cy.createTodo('Should fail');
      
      // Verify error message is displayed
      cy.get('[data-testid=error-message]').should('be.visible');
      cy.get('[data-testid=error-message]').should('contain', 'Failed to create todo');
    });

    it('should validate form inputs', () => {
      // Try to submit empty form
      cy.get('[data-testid=add-todo-button]').click();
      
      // Verify validation message
      cy.get('[data-testid=validation-error]').should('be.visible');
      cy.get('[data-testid=validation-error]').should('contain', 'Title is required');
    });
  });
});