// Import commands.js using ES2015 syntax:
import './commands'

// Global configuration for component tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // on uncaught exceptions
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  return true
}) 