describe('Features Page', () => {
  beforeEach(() => {
    cy.visit('/features')
    cy.waitForPageLoad()
  })

  it('should display main content correctly', () => {
    // Main heading
    cy.get('h1').should('contain', 'Features & Capabilities')
    
    // Subtitle
    cy.get('p').should('contain', 'Explore the comprehensive set of features')

    // Core features section
    cy.get('h2').contains('Core Features').should('be.visible')
  })

  it('should display core features correctly', () => {
    // Check core features grid - there are 4 items in the first section
    cy.get('.card').should('have.length.at.least', 4)
    
    // Verify specific features
    cy.get('.card').contains('Fast Development').should('be.visible')
    cy.get('.card').contains('Type Safety').should('be.visible')
    cy.get('.card').contains('Modern Styling').should('be.visible')
    cy.get('.card').contains('Testing').should('be.visible')
  })

  it('should display development tools section', () => {
    // Development tools section
    cy.get('h2').contains('Development Tools').should('be.visible')
    
    // Check tools grid
    cy.get('.text-center').should('have.length.at.least', 3)
    
    // Verify specific tools
    cy.get('.text-center').contains('ESLint').should('be.visible')
    cy.get('.text-center').contains('Prettier').should('be.visible')
    cy.get('.text-center').contains('EditorConfig').should('be.visible')
  })

  it('should display testing and build section', () => {
    // Testing & Build section
    cy.get('h2').contains('Testing & Build').should('be.visible')
    
    // Check testing stack
    cy.get('ul li').contains('Vitest: Fast unit testing framework').should('be.visible')
    cy.get('ul li').contains('React Testing Library: Component testing utilities').should('be.visible')
    cy.get('ul li').contains('jsdom: DOM environment for tests').should('be.visible')
    
    // Check build features
    cy.get('ul li').contains('Code Splitting: Automatic chunk optimization').should('be.visible')
    cy.get('ul li').contains('Tree Shaking: Dead code elimination').should('be.visible')
  })

  it('should display utilities section', () => {
    // Built-in utilities section
    cy.get('h2').contains('Built-in Utilities').should('be.visible')
    
    // Check utilities grid - there are 4 items
    cy.get('.bg-gray-50').should('have.length.at.least', 3)
    
    // Verify specific utilities
    cy.get('.bg-gray-50').contains('Logger').should('be.visible')
    cy.get('.bg-gray-50').contains('API Client').should('be.visible')
    cy.get('.bg-gray-50').contains('Validation').should('be.visible')
  })

  it('should have proper navigation', () => {
    // Navigation should work
    cy.get('a[href="/"]').click()
    cy.checkNavigation('/')
    cy.get('h1').should('contain', 'React TypeScript Boilerplate')
    
    // Go back to Features
    cy.get('a[href="/features"]').click()
    cy.checkNavigation('/features')
    cy.get('h1').should('contain', 'Features & Capabilities')
  })
}) 