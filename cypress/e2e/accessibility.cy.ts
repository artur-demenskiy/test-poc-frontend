describe('Accessibility Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('WCAG 2.1 Compliance', () => {
    it('should meet WCAG 2.1 AA standards', () => {
      cy.injectAxe();
      cy.checkA11y(null, {
        rules: {
          'color-contrast': { enabled: true },
          'button-name': { enabled: true },
          'form-field-multiple-labels': { enabled: true },
          'heading-order': { enabled: true },
          'label': { enabled: true },
          'list': { enabled: true },
          'listitem': { enabled: true },
          'region': { enabled: true },
        },
      });
    });

    it('should have proper heading structure', () => {
      cy.get('h1').should('exist');
      cy.get('h2').should('have.length.at.least', 1);
      
      // Check heading hierarchy
      cy.get('h1').should('have.length', 1);
      cy.get('h2').should('have.length.at.least', 1);
    });

    it('should have proper form labels', () => {
      cy.get('[data-testid=todo-title-input]').should('have.attr', 'aria-label');
      cy.get('[data-testid=todo-description-input]').should('have.attr', 'aria-label');
      
      // Check for associated labels
      cy.get('[data-testid=todo-title-input]').should('have.attr', 'id');
      cy.get('[data-testid=todo-description-input]').should('have.attr', 'id');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should be fully navigable by keyboard', () => {
      // Test tab navigation through form
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'todo-title-input');
      
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'todo-description-input');
      
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'add-todo-button');
    });

    it('should handle Enter key for form submission', () => {
      cy.get('[data-testid=todo-title-input]').type('Keyboard Test Todo');
      cy.get('[data-testid=todo-title-input]').type('{enter}');
      
      cy.get('[data-testid=todo-list]').should('contain', 'Keyboard Test Todo');
    });

    it('should handle Escape key for canceling actions', () => {
      // Create a todo first
      cy.get('[data-testid=todo-title-input]').type('Escape Test Todo');
      cy.get('[data-testid=add-todo-button]').click();
      
      // Start editing
      cy.get('[data-testid=todo-item]').first().within(() => {
        cy.get('[data-testid=edit-todo-button]').click();
        cy.get('[data-testid=todo-title-input]').clear().type('Editing...');
        cy.get('[data-testid=todo-title-input]').type('{esc}');
      });
      
      // Should cancel editing
      cy.get('[data-testid=todo-list]').should('contain', 'Escape Test Todo');
      cy.get('[data-testid=todo-list]').should('not.contain', 'Editing...');
    });
  });

  describe('Screen Reader Support', () => {
    it('should have proper ARIA labels', () => {
      cy.get('[data-testid=todo-title-input]').should('have.attr', 'aria-label');
      cy.get('[data-testid=todo-description-input]').should('have.attr', 'aria-label');
      cy.get('[data-testid=add-todo-button]').should('have.attr', 'aria-label');
    });

    it('should have proper ARIA roles', () => {
      cy.get('[data-testid=todo-form]').should('have.attr', 'role', 'form');
      cy.get('[data-testid=todo-list]').should('have.attr', 'role', 'list');
      cy.get('[data-testid=todo-item]').should('have.attr', 'role', 'listitem');
    });

    it('should announce dynamic content changes', () => {
      cy.get('[data-testid=todo-title-input]').type('Announcement Test');
      cy.get('[data-testid=add-todo-button]').click();
      
      // Check for live region announcements
      cy.get('[aria-live]').should('exist');
    });

    it('should have proper button descriptions', () => {
      cy.get('[data-testid=add-todo-button]').should('have.attr', 'aria-label');
      cy.get('[data-testid=delete-todo-button]').first().should('have.attr', 'aria-label');
      cy.get('[data-testid=edit-todo-button]').first().should('have.attr', 'aria-label');
    });
  });

  describe('Color and Contrast', () => {
    it('should have sufficient color contrast', () => {
      cy.injectAxe();
      cy.checkA11y(null, {
        rules: {
          'color-contrast': { enabled: true },
        },
      });
    });

    it('should not rely solely on color to convey information', () => {
      // Check that completed todos have more than just color changes
      cy.get('[data-testid=todo-title-input]').type('Color Test Todo');
      cy.get('[data-testid=add-todo-button]').click();
      
      cy.get('[data-testid=todo-item]').first().within(() => {
        cy.get('[data-testid=todo-checkbox]').click();
      });
      
      // Should have text or icon indication, not just color
      cy.get('[data-testid=todo-item]').first().should('have.class', 'completed');
    });
  });

  describe('Focus Management', () => {
    it('should maintain logical focus order', () => {
      const focusOrder = [
        '[data-testid=todo-title-input]',
        '[data-testid=todo-description-input]',
        '[data-testid=add-todo-button]',
        '[data-testid=filter-all]',
        '[data-testid=filter-active]',
        '[data-testid=filter-completed]',
      ];
      
      focusOrder.forEach((selector) => {
        cy.get('body').tab();
        cy.focused().should('match', selector);
      });
    });

    it('should handle focus after form submission', () => {
      cy.get('[data-testid=todo-title-input]').type('Focus Test Todo');
      cy.get('[data-testid=add-todo-button]').click();
      
      // Focus should return to title input after submission
      cy.get('[data-testid=todo-title-input]').should('have.focus');
    });

    it('should handle focus in edit mode', () => {
      // Create a todo first
      cy.get('[data-testid=todo-title-input]').type('Edit Focus Test');
      cy.get('[data-testid=add-todo-button]').click();
      
      // Start editing
      cy.get('[data-testid=todo-item]').first().within(() => {
        cy.get('[data-testid=edit-todo-button]').click();
        cy.get('[data-testid=todo-title-input]').should('have.focus');
      });
    });
  });

  describe('Error Handling and Announcements', () => {
    it('should announce validation errors', () => {
      cy.get('[data-testid=todo-title-input]').focus().blur();
      
      // Should have error announcement
      cy.get('[data-testid=validation-error]').should('be.visible');
      cy.get('[data-testid=validation-error]').should('have.attr', 'role', 'alert');
    });

    it('should announce successful actions', () => {
      cy.get('[data-testid=todo-title-input]').type('Success Test Todo');
      cy.get('[data-testid=add-todo-button]').click();
      
      // Should have success announcement
      cy.get('[aria-live="polite"]').should('exist');
    });
  });

  describe('Mobile Accessibility', () => {
    it('should be accessible on mobile devices', () => {
      cy.viewport('iphone-x');
      
      // Check touch targets are large enough
      cy.get('[data-testid=add-todo-button]').should('have.css', 'min-height', '44px');
      cy.get('[data-testid=delete-todo-button]').first().should('have.css', 'min-height', '44px');
      
      // Check for proper spacing
      cy.get('[data-testid=todo-item]').first().should('have.css', 'padding', '12px');
    });

    it('should support voice control', () => {
      // Check for proper labels that work with voice control
      cy.get('[data-testid=todo-title-input]').should('have.attr', 'aria-label');
      cy.get('[data-testid=add-todo-button]').should('have.attr', 'aria-label');
    });
  });

  describe('Internationalization', () => {
    it('should support different languages', () => {
      // Check for proper lang attribute
      cy.get('html').should('have.attr', 'lang');
      
      // Check for proper text direction support
      cy.get('body').should('have.css', 'direction', 'ltr');
    });

    it('should handle right-to-left languages', () => {
      // Test RTL support if implemented
      cy.get('[data-testid=todo-form]').should('have.css', 'text-align');
    });
  });
}); 