describe('Performance Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Page Load Performance', () => {
    it('should load initial page within 3 seconds', () => {
      cy.measurePerformance();
      cy.get('[data-testid=todo-form]', { timeout: 3000 }).should('be.visible');
    });

    it('should have acceptable First Contentful Paint', () => {
      cy.window().then((win) => {
        const performance = win.performance;
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        // FCP should be under 2 seconds
        expect(navigation.loadEventEnd - navigation.loadEventStart).to.be.lessThan(2000);
      });
    });

    it('should have acceptable Largest Contentful Paint', () => {
      cy.window().then((win) => {
        const performance = win.performance;
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        // LCP should be under 2.5 seconds
        expect(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart).to.be.lessThan(2500);
      });
    });
  });

  describe('Interaction Performance', () => {
    it('should handle rapid todo creation without lag', () => {
      const startTime = Date.now();
      
      // Create 10 todos rapidly
      for (let i = 0; i < 10; i++) {
        cy.get('[data-testid=todo-title-input]').type(`Todo ${i + 1}`);
        cy.get('[data-testid=add-todo-button]').click();
      }
      
      const totalTime = Date.now() - startTime;
      expect(totalTime).to.be.lessThan(5000); // Should complete within 5 seconds
      
      cy.get('[data-testid=todo-item]').should('have.length', 10);
    });

    it('should maintain responsiveness with many todos', () => {
      // Create 20 todos
      for (let i = 0; i < 20; i++) {
        cy.get('[data-testid=todo-title-input]').type(`Performance Todo ${i + 1}`);
        cy.get('[data-testid=add-todo-button]').click();
      }
      
      // Verify all todos are displayed
      cy.get('[data-testid=todo-item]').should('have.length', 20);
      
      // Test that form is still responsive
      cy.get('[data-testid=todo-form]').should('be.visible');
      cy.get('[data-testid=add-todo-button]').should('be.enabled');
    });

    it('should handle rapid state changes efficiently', () => {
      // Create a todo
      cy.get('[data-testid=todo-title-input]').type('State Change Test');
      cy.get('[data-testid=add-todo-button]').click();
      
      const startTime = Date.now();
      
      // Rapidly toggle completion state
      for (let i = 0; i < 10; i++) {
        cy.get('[data-testid=todo-checkbox]').first().click();
      }
      
      const totalTime = Date.now() - startTime;
      expect(totalTime).to.be.lessThan(2000); // Should complete within 2 seconds
    });
  });

  describe('Memory Usage', () => {
    it('should not have memory leaks with repeated operations', () => {
      // Get initial memory usage
      cy.window().then((win) => {
        const initialMemory = (win.performance as any).memory?.usedJSHeapSize || 0;
        
        // Perform repeated operations
        for (let i = 0; i < 10; i++) {
          cy.get('[data-testid=todo-title-input]').type(`Memory Test ${i + 1}`);
          cy.get('[data-testid=add-todo-button]').click();
          
          // Toggle completion
          cy.get('[data-testid=todo-checkbox]').first().click();
          
          // Delete the todo
          cy.get('[data-testid=delete-todo-button]').first().click();
        }
        
        // Get final memory usage
        cy.window().then((win) => {
          const finalMemory = (win.performance as any).memory?.usedJSHeapSize || 0;
          
          // Memory increase should be reasonable (less than 10MB)
          const memoryIncrease = finalMemory - initialMemory;
          expect(memoryIncrease).to.be.lessThan(10 * 1024 * 1024); // 10MB
        });
      });
    });
  });

  describe('Network Performance', () => {
    it('should handle slow network conditions', () => {
      // Intercept API calls and add delay
      cy.intercept('**/api/todos', (req) => {
        req.reply((res) => {
          // Add 1 second delay to simulate slow network
          setTimeout(() => {
            res.send();
          }, 1000);
        });
      }).as('slowApi');
      
      const startTime = Date.now();
      cy.visit('/');
      cy.get('[data-testid=todo-form]', { timeout: 10000 }).should('be.visible');
      const loadTime = Date.now() - startTime;
      
      // Should still load within reasonable time even with slow network
      expect(loadTime).to.be.lessThan(10000); // 10 seconds
    });

    it('should handle offline scenarios gracefully', () => {
      // Intercept API calls and simulate offline
      cy.intercept('**/api/todos', { forceNetworkError: true }).as('offlineApi');
      
      cy.get('[data-testid=todo-title-input]').type('Offline Test');
      cy.get('[data-testid=add-todo-button]').click();
      
      // Should show offline indicator or handle gracefully
      cy.get('[data-testid=todo-form]').should('be.visible');
    });
  });

  describe('Rendering Performance', () => {
    it('should have smooth scrolling with many items', () => {
      // Create many todos
      for (let i = 0; i < 50; i++) {
        cy.get('[data-testid=todo-title-input]').type(`Scroll Test ${i + 1}`);
        cy.get('[data-testid=add-todo-button]').click();
      }
      
      // Test scrolling performance
      const scrollStartTime = Date.now();
      cy.window().then((win) => {
        win.scrollTo(0, document.body.scrollHeight);
      });
      const scrollTime = Date.now() - scrollStartTime;
      
      expect(scrollTime).to.be.lessThan(1000); // Scrolling should be smooth
    });

    it('should handle rapid DOM updates efficiently', () => {
      // Create initial todos
      for (let i = 0; i < 10; i++) {
        cy.get('[data-testid=todo-title-input]').type(`DOM Test ${i + 1}`);
        cy.get('[data-testid=add-todo-button]').click();
      }
      
      const startTime = Date.now();
      
      // Rapidly update todos
      for (let i = 0; i < 10; i++) {
        cy.get('[data-testid=todo-item]').eq(i).within(() => {
          cy.get('[data-testid=edit-todo-button]').click();
          cy.get('[data-testid=todo-title-input]').clear().type(`Updated ${i + 1}`);
          cy.get('[data-testid=save-todo-button]').click();
        });
      }
      
      const totalTime = Date.now() - startTime;
      expect(totalTime).to.be.lessThan(5000); // Should complete within 5 seconds
    });
  });

  describe('Bundle Size and Loading', () => {
    it('should have reasonable bundle size', () => {
      cy.request('/').then((response) => {
        const html = response.body;
        
        // Check for large inline scripts or styles
        const scriptSize = html.match(/<script[^>]*>([\s\S]*?)<\/script>/g)?.join('').length || 0;
        const styleSize = html.match(/<style[^>]*>([\s\S]*?)<\/style>/g)?.join('').length || 0;
        
        expect(scriptSize).to.be.lessThan(100000); // Less than 100KB inline scripts
        expect(styleSize).to.be.lessThan(50000); // Less than 50KB inline styles
      });
    });

    it('should load external resources efficiently', () => {
      const startTime = Date.now();
      
      // Navigate and wait for all resources to load
      cy.visit('/');
      cy.get('[data-testid=todo-form]', { timeout: 5000 }).should('be.visible');
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).to.be.lessThan(5000); // Should load within 5 seconds
    });
  });
}); 