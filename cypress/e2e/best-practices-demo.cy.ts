/**
 * Best Practices Demo for Cypress Testing
 * This file demonstrates the recommended patterns and anti-patterns
 */

describe('Cypress Best Practices Demo', () => {
  beforeEach(() => {
    // ✅ BEST PRACTICE: Reset state before each test
    // For demo purposes, we'll use a mock task
    cy.task('db:seed')
    cy.visit('/')
  })

  describe('✅ Best Practices', () => {
    it('should demonstrate independent test with complete workflow', () => {
      // ✅ Complete workflow in single test
      // This test demonstrates the concept of independent testing
      // In a real app, this would interact with actual UI elements
      
      // Verify page loads
      cy.get('body').should('be.visible')
      
      // Log the demonstration
      cy.log('✅ This demonstrates an independent test that can run alone')
      cy.log('✅ In a real app, this would add, edit, and delete todos')
    })

    it('should demonstrate multiple assertions in single test', () => {
      // ✅ Combine related assertions
      cy.get('body')
        .should('be.visible')
        .and('contain', 'Hello World!')
        .and('have.length', 1)
    })

    it('should demonstrate network request handling', () => {
      // ✅ Intercept and wait for network requests
      // This demonstrates the pattern, even if no actual request is made
      cy.intercept('GET', '/api/todos', { fixture: 'todos.json' }).as('getTodos')
      
      // In a real app, this would trigger the request
      cy.log('✅ This demonstrates proper network request handling')
      cy.log('✅ Use cy.intercept() and cy.wait() for reliable testing')
    })

    it('should demonstrate custom commands', () => {
      // ✅ Use custom commands for common actions
      cy.log('✅ Custom commands are defined in cypress/support/commands.ts')
      cy.log('✅ They make tests more readable and maintainable')
      
      // Example of what a custom command would do
      cy.get('body').should('be.visible')
    })

    it('should demonstrate accessibility testing', () => {
      // ✅ Test accessibility compliance
      cy.log('✅ Accessibility testing ensures your app is usable by everyone')
      cy.log('✅ Use cy.injectAxe() and cy.checkA11y() for automated testing')
      
      // Basic accessibility check
      cy.get('body').should('be.visible')
    })
  })

  describe('❌ Anti-Patterns (for demonstration)', () => {
    it('should show what NOT to do - coupled tests', () => {
      // ❌ DON'T DO THIS - This test depends on previous tests
      // In a real scenario, this would be split into multiple tests
      // that depend on each other
      cy.log('❌ This demonstrates the anti-pattern of coupled tests')
      cy.log('❌ Each test should be able to run independently')
    })

    it('should show what NOT to do - unnecessary waits', () => {
      // ❌ DON'T DO THIS - Arbitrary waits
      cy.visit('/')
      cy.wait(2000) // ❌ Unnecessary wait
      
      // Instead, use proper assertions or wait for specific events
      cy.get('body').should('be.visible')
      cy.log('✅ Instead, use proper assertions: cy.get().should()')
    })

    it('should show what NOT to do - brittle selectors', () => {
      // ❌ DON'T DO THIS - Brittle CSS selectors
      cy.log('❌ Avoid: cy.get(".btn-primary")')
      cy.log('❌ Avoid: cy.get("#todo-input")')
      
      // ✅ Instead, use semantic selectors
      cy.log('✅ Use: cy.findByRole("button", { name: "Add Todo" })')
      cy.log('✅ Use: cy.findByLabelText("Todo title")')
    })
  })

  describe('🔧 Advanced Patterns', () => {
    it('should demonstrate conditional testing', () => {
      // Click button that may or may not show different elements
      cy.log('✅ Conditional testing handles dynamic UI elements')
      cy.log('✅ Use .then() to check DOM state synchronously')
      
      cy.get('body').then(($body) => {
        // Synchronously check what was created
        if ($body.find('h1').length) {
          cy.log('Found h1 element')
        } else {
          cy.log('No h1 element found')
        }
      })
    })

    it('should demonstrate performance testing', () => {
      cy.visit('/', {
        onBeforeLoad: (win) => {
          cy.spy(win.console, 'log').as('consoleLog')
        }
      })

      // Measure page load time
      cy.window().then((win) => {
        const perfData = win.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        expect(perfData.loadEventEnd - perfData.loadEventStart).to.be.lessThan(5000)
      })

      // Check for console errors
      cy.get('@consoleLog').should('not.be.called')
    })

    it('should demonstrate data-driven testing', () => {
      const testData = [
        { name: 'First Item', value: 'value1' },
        { name: 'Second Item', value: 'value2' },
        { name: 'Third Item', value: 'value3' }
      ]

      testData.forEach((item) => {
        cy.log(`Processing: ${item.name}`)
        // In a real app, this would interact with the UI
      })
      
      cy.log('✅ Data-driven tests reduce code duplication')
    })
  })

  describe('🎯 Test Organization', () => {
    describe('when user is logged in', () => {
      beforeEach(() => {
        // Setup for logged-in user tests
        cy.log('✅ Setup for logged-in user tests')
        // In a real app: cy.login('test@example.com', 'password123')
      })

      it('should show user-specific content', () => {
        cy.log('✅ Test user-specific functionality')
        cy.get('body').should('be.visible')
      })
    })

    describe('when user is not logged in', () => {
      it('should show login prompt', () => {
        cy.log('✅ Test guest user functionality')
        cy.get('body').should('be.visible')
      })
    })
  })

  describe('📝 Documentation Examples', () => {
    it('should demonstrate proper test naming', () => {
      // ✅ Good test names describe the behavior
      cy.log('✅ Good: "should allow user to add a new todo"')
      cy.log('❌ Bad: "should work"')
      
      cy.get('body').should('be.visible')
    })

    it('should demonstrate AAA pattern', () => {
      // Arrange - preparation
      cy.log('Arrange: Set up test data and conditions')
      
      // Act - action
      cy.log('Act: Perform the action being tested')
      cy.get('body').should('be.visible')
      
      // Assert - verification
      cy.log('Assert: Verify the expected outcome')
    })

    it('should demonstrate error handling', () => {
      // Test error scenarios
      cy.log('✅ Test both success and failure scenarios')
      cy.log('✅ Handle edge cases and error conditions')
      
      cy.get('body').should('be.visible')
    })
  })
}) 