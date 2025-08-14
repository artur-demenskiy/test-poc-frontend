import React from 'react'
import Layout from '../../src/components/Layout'

describe('Layout Component', () => {
  it('should render header with navigation', () => {
    cy.mount(<Layout />)
    
    // Check header
    cy.get('header').should('be.visible')
    cy.get('header h1').should('contain', 'React Boilerplate')
    
    // Check navigation
    cy.get('nav').should('be.visible')
    cy.get('nav a').should('have.length', 3)
    
    // Check navigation links
    cy.get('nav a[href="/"]').should('contain', 'Home')
    cy.get('nav a[href="/about"]').should('contain', 'About')
    cy.get('nav a[href="/features"]').should('contain', 'Features')
  })

  it('should render footer', () => {
    cy.mount(<Layout />)
    
    cy.get('footer').should('be.visible')
    cy.get('footer').should('contain', 'React TypeScript Boilerplate')
    cy.get('footer').should('contain', 'Built with Vite, Tailwind CSS, and modern tooling')
  })

  it('should render children content', () => {
    const testContent = <div data-testid="test-content">Test Content</div>
    
    cy.mount(<Layout>{testContent}</Layout>)
    
    cy.get('[data-testid="test-content"]').should('be.visible')
    cy.get('[data-testid="test-content"]').should('contain', 'Test Content')
  })

  it('should render Outlet when no children', () => {
    cy.mount(<Layout />)
    
    // Should render main content area
    cy.get('main').should('be.visible')
  })
}) 