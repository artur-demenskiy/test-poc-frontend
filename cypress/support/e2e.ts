// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
const app = window.top
if (app) {
  app.document.addEventListener('DOMContentLoaded', () => {
    const style = app.document.createElement('style')
    style.innerHTML = `
      .command-name-request { display: none; }
      .command-name-xhr { display: none; }
    `
    app.document.head.appendChild(style)
  })
}

// Global configuration
Cypress.on('uncaught:exception', (err, _runnable) => {
  // Returning false here prevents Cypress from failing the test
  // on uncaught exceptions
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  return true
})

// Custom command to wait for page load
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible')
  cy.window().its('document').its('readyState').should('eq', 'complete')
})

// Custom command to check if element is visible and clickable
Cypress.Commands.add('clickElement', (selector: string) => {
  cy.get(selector).should('be.visible').should('not.be.disabled').click()
})

// Custom command to type with delay (useful for forms)
Cypress.Commands.add('typeWithDelay', (selector: string, text: string, delay = 100) => {
  cy.get(selector).should('be.visible').clear().type(text, { delay })
})

// Custom command to check navigation
Cypress.Commands.add('checkNavigation', (url: string) => {
  cy.url().should('include', url)
})

// Custom command to check page title
Cypress.Commands.add('checkPageTitle', (title: string) => {
  cy.title().should('include', title)
}) 