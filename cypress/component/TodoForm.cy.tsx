import React from 'react';
import { mount } from 'cypress/react18';
import TodoForm from '../../src/components/TodoForm';

describe('TodoForm Component', () => {
  const mockOnAddTodo = cy.stub().as('onAddTodo');

  beforeEach(() => {
    mount(<TodoForm onAddTodo={mockOnAddTodo} />);
  });

  it('should render form elements', () => {
    cy.get('[data-testid=todo-form]').should('be.visible');
    cy.get('[data-testid=todo-title-input]').should('be.visible');
    cy.get('[data-testid=todo-description-input]').should('be.visible');
    cy.get('[data-testid=add-todo-button]').should('be.visible');
  });

  it('should have proper form labels', () => {
    cy.get('[data-testid=todo-title-input]').should('have.attr', 'placeholder', 'Enter todo title');
    cy.get('[data-testid=todo-description-input]').should('have.attr', 'placeholder', 'Enter todo description (optional)');
  });

  it('should submit form with valid data', () => {
    const todoTitle = 'Test Todo';
    const todoDescription = 'Test Description';

    cy.get('[data-testid=todo-title-input]').type(todoTitle);
    cy.get('[data-testid=todo-description-input]').type(todoDescription);
    cy.get('[data-testid=add-todo-button]').click();

    cy.get('@onAddTodo').should('have.been.calledWith', {
      title: todoTitle,
      description: todoDescription,
    });
  });

  it('should clear form after successful submission', () => {
    cy.get('[data-testid=todo-title-input]').type('Test Todo');
    cy.get('[data-testid=todo-description-input]').type('Test Description');
    cy.get('[data-testid=add-todo-button]').click();

    cy.get('[data-testid=todo-title-input]').should('have.value', '');
    cy.get('[data-testid=todo-description-input]').should('have.value', '');
  });

  it('should not submit form with empty title', () => {
    cy.get('[data-testid=add-todo-button]').should('be.disabled');
    
    cy.get('[data-testid=todo-title-input]').type('   '); // Only spaces
    cy.get('[data-testid=add-todo-button]').should('be.disabled');
  });

  it('should submit form with only title (no description)', () => {
    const todoTitle = 'Test Todo';

    cy.get('[data-testid=todo-title-input]').type(todoTitle);
    cy.get('[data-testid=add-todo-button]').click();

    cy.get('@onAddTodo').should('have.been.calledWith', {
      title: todoTitle,
      description: '',
    });
  });

  it('should handle Enter key submission', () => {
    const todoTitle = 'Test Todo';

    cy.get('[data-testid=todo-title-input]').type(todoTitle);
    cy.get('[data-testid=todo-title-input]').type('{enter}');

    cy.get('@onAddTodo').should('have.been.calledWith', {
      title: todoTitle,
      description: '',
    });
  });

  it('should show validation error for empty title', () => {
    cy.get('[data-testid=todo-title-input]').focus().blur();
    cy.get('[data-testid=validation-error]').should('be.visible');
    cy.get('[data-testid=validation-error]').should('contain', 'Title is required');
  });

  it('should remove validation error when title is entered', () => {
    cy.get('[data-testid=todo-title-input]').focus().blur();
    cy.get('[data-testid=validation-error]').should('be.visible');
    
    cy.get('[data-testid=todo-title-input]').type('Valid Title');
    cy.get('[data-testid=validation-error]').should('not.exist');
  });

  it('should be accessible', () => {
    cy.injectAxe();
    cy.checkA11y('[data-testid=todo-form]');
  });

  it('should support keyboard navigation', () => {
    cy.get('[data-testid=todo-title-input]').focus();
    cy.get('[data-testid=todo-title-input]').should('have.focus');
    
    cy.get('[data-testid=todo-title-input]').tab();
    cy.get('[data-testid=todo-description-input]').should('have.focus');
    
    cy.get('[data-testid=todo-description-input]').tab();
    cy.get('[data-testid=add-todo-button]').should('have.focus');
  });

  it('should handle long input values', () => {
    const longTitle = 'A'.repeat(100);
    const longDescription = 'B'.repeat(200);

    cy.get('[data-testid=todo-title-input]').type(longTitle);
    cy.get('[data-testid=todo-description-input]').type(longDescription);
    cy.get('[data-testid=add-todo-button]').click();

    cy.get('@onAddTodo').should('have.been.calledWith', {
      title: longTitle,
      description: longDescription,
    });
  });

  it('should handle special characters', () => {
    const specialTitle = 'Todo with émojis 🎉 and symbols & < > " \'';
    const specialDescription = 'Description with émojis 🚀 and symbols & < > " \'';

    cy.get('[data-testid=todo-title-input]').type(specialTitle);
    cy.get('[data-testid=todo-description-input]').type(specialDescription);
    cy.get('[data-testid=add-todo-button]').click();

    cy.get('@onAddTodo').should('have.been.calledWith', {
      title: specialTitle,
      description: specialDescription,
    });
  });
}); 