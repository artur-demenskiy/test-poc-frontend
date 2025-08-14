describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.waitForPageLoad()
  })

  it('should display main content correctly', () => {
    // Main heading
    cy.get('h1').should('contain', 'React TypeScript Boilerplate')
    
    // Subtitle
    cy.get('p').should('contain', 'production-ready React application template')

    // Features grid should have at least 6 items
    cy.get('.card').should('have.length.at.least', 6)

    // Check specific features
    cy.get('.card').contains('Fast Development').should('be.visible')
    cy.get('.card').contains('Type Safety').should('be.visible')
    cy.get('.card').contains('Modern Styling').should('be.visible')
    cy.get('.card').contains('Testing').should('be.visible')
    cy.get('.card').contains('Code Quality').should('be.visible')
    cy.get('.card').contains('Error Handling').should('be.visible')
  })

  it('should display getting started section', () => {
    cy.get('h2').contains('Getting Started').should('be.visible')
    
    // Should have numbered list
    cy.get('ol li').should('have.length.at.least', 4)
    
    // Check specific items
    cy.get('ol li').contains('components').should('be.visible')
    cy.get('ol li').contains('pages').should('be.visible')
    cy.get('ol li').contains('types').should('be.visible')
    cy.get('ol li').contains('utils').should('be.visible')
  })

  it('should have proper layout structure', () => {
    // Header should be visible
    cy.get('header').should('be.visible')
    cy.get('header h1').should('contain', 'React Boilerplate')
    
    // Navigation should be visible
    cy.get('nav').should('be.visible')
    cy.get('nav a').should('have.length', 3)
    
    // Footer should be visible
    cy.get('footer').should('be.visible')
    cy.get('footer').should('contain', 'React TypeScript Boilerplate')
  })

  it('should be responsive', () => {
    // Test mobile viewport
    cy.viewport(375, 667)
    cy.get('header').should('be.visible')
    cy.get('nav').should('be.visible')
    
    // Test tablet viewport
    cy.viewport(768, 1024)
    cy.get('header').should('be.visible')
    cy.get('nav').should('be.visible')
    
    // Test desktop viewport
    cy.viewport(1280, 720)
    cy.get('header').should('be.visible')
    cy.get('nav').should('be.visible')
  })
}) 