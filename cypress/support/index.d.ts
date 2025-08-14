/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to wait for page load
     * @example cy.waitForPageLoad()
     */
    waitForPageLoad(): Chainable<void>

    /**
     * Custom command to click element with visibility and enabled checks
     * @example cy.clickElement('[data-testid="button"]')
     */
    clickElement(selector: string): Chainable<void>

    /**
     * Custom command to type with delay
     * @example cy.typeWithDelay('[data-testid="input"]', 'text', 100)
     */
    typeWithDelay(selector: string, text: string, delay?: number): Chainable<void>

    /**
     * Custom command to check navigation
     * @example cy.checkNavigation('/about')
     */
    checkNavigation(url: string): Chainable<void>

    /**
     * Custom command to check page title
     * @example cy.checkPageTitle('About')
     */
    checkPageTitle(title: string): Chainable<void>
  }
} 