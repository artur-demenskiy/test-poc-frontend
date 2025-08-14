// Add custom commands here
declare global {
  namespace Cypress {
    interface Chainable {
      waitForPageLoad(): Chainable<void>
      clickElement(selector: string): Chainable<void>
      typeWithDelay(selector: string, text: string, delay?: number): Chainable<void>
      checkNavigation(url: string): Chainable<void>
      checkPageTitle(title: string): Chainable<void>
    }
  }
}

export {} 