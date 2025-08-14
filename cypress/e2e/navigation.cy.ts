describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.waitForPageLoad()
  })

  it('should navigate to all pages correctly', () => {
    // Check Home page
    cy.get('h1').should('contain', 'React TypeScript Boilerplate')
    cy.checkPageTitle('Vite + React + TS')

    // Navigate to About page
    cy.get('a[href="/about"]').click()
    cy.checkNavigation('/about')
    cy.get('h1').should('contain', 'About This Boilerplate')

    // Navigate to Features page
    cy.get('a[href="/features"]').click()
    cy.checkNavigation('/features')
    cy.get('h1').should('contain', 'Features & Capabilities')

    // Navigate back to Home
    cy.get('a[href="/"]').click()
    cy.checkNavigation('/')
    cy.get('h1').should('contain', 'React TypeScript Boilerplate')
  })

  it('should highlight active navigation link', () => {
    // Home should be active initially
    cy.get('a[href="/"]').should('have.class', 'text-primary-600')

    // Navigate to About
    cy.get('a[href="/about"]').click()
    cy.get('a[href="/about"]').should('have.class', 'text-primary-600')
    cy.get('a[href="/"]').should('not.have.class', 'text-primary-600')

    // Navigate to Features
    cy.get('a[href="/features"]').click()
    cy.get('a[href="/features"]').should('have.class', 'text-primary-600')
    cy.get('a[href="/about"]').should('not.have.class', 'text-primary-600')
  })

  it('should handle 404 page correctly', () => {
    cy.visit('/non-existent-page')
    cy.get('h1').should('contain', '404')
    cy.get('h2').should('contain', 'Page Not Found')
    
    // Should be able to navigate back - use first() to handle multiple elements
    cy.get('a[href="/"]').first().click()
    cy.checkNavigation('/')
  })
}) 