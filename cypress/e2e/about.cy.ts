describe('About Page', () => {
  beforeEach(() => {
    cy.visit('/about')
    cy.waitForPageLoad()
  })

  it('should display main content correctly', () => {
    // Main heading
    cy.get('h1').should('contain', 'About This Boilerplate')
    
    // Subtitle
    cy.get('p').should('contain', 'comprehensive, production-ready React application template')

    // Project overview section
    cy.get('h2').contains('Project Overview').should('be.visible')
    cy.get('.card').contains('This boilerplate is designed to provide developers').should('be.visible')
  })

  it('should display technology stack correctly', () => {
    // Technology stack section
    cy.get('h2').contains('Technology Stack').should('be.visible')
    
    // Check technology items - there are 8 items
    cy.get('.bg-gray-50').should('have.length', 8)
    
    // Verify specific technologies
    cy.get('.bg-gray-50').contains('Runtime').should('be.visible')
    cy.get('.bg-gray-50').contains('Node.js 20+').should('be.visible')
    
    cy.get('.bg-gray-50').contains('Framework').should('be.visible')
    cy.get('.bg-gray-50').contains('React 19.1.1').should('be.visible')
    
    cy.get('.bg-gray-50').contains('Build Tool').should('be.visible')
    cy.get('.bg-gray-50').contains('Vite + React SWC').should('be.visible')
  })

  it('should display development features', () => {
    // Development features section
    cy.get('h2').contains('Development Features').should('be.visible')
    
    // Check feature lists
    cy.get('ul li').should('have.length.at.least', 8)
    
    // Verify specific features
    cy.get('ul li').contains('ESLint with TypeScript rules').should('be.visible')
    cy.get('ul li').contains('Prettier for code formatting').should('be.visible')
    cy.get('ul li').contains('EditorConfig for consistency').should('be.visible')
    cy.get('ul li').contains('Git hooks with Husky').should('be.visible')
  })

  it('should display project structure', () => {
    // Project structure section
    cy.get('h2').contains('Project Structure').should('be.visible')
    
    // Check code block
    cy.get('pre').should('be.visible')
    cy.get('pre').should('contain', 'src/')
    cy.get('pre').should('contain', 'components/')
    cy.get('pre').should('contain', 'pages/')
    cy.get('pre').should('contain', 'types/')
    cy.get('pre').should('contain', 'utils/')
  })

  it('should have proper navigation', () => {
    // Navigation should work
    cy.get('a[href="/"]').click()
    cy.checkNavigation('/')
    cy.get('h1').should('contain', 'React TypeScript Boilerplate')
    
    // Go back to About
    cy.get('a[href="/about"]').click()
    cy.checkNavigation('/about')
    cy.get('h1').should('contain', 'About This Boilerplate')
  })
}) 