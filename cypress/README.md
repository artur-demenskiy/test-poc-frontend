# Cypress Testing

This directory contains Cypress E2E tests for the React TypeScript Boilerplate.

## Available Scripts

- `pnpm cypress:open` - Open Cypress Test Runner
- `pnpm cypress:run` - Run all Cypress tests in headless mode
- `pnpm cypress:run:e2e` - Run only E2E tests
- `pnpm test:e2e` - Start dev server and run E2E tests

## E2E Tests

- **navigation.cy.ts** - Tests routing and navigation
- **home.cy.ts** - Tests Home page content and layout
- **about.cy.ts** - Tests About page content and structure
- **features.cy.ts** - Tests Features page content and functionality

## Custom Commands

- `cy.waitForPageLoad()` - Wait for page to fully load
- `cy.clickElement(selector)` - Click element with visibility and enabled checks
- `cy.typeWithDelay(selector, text, delay)` - Type text with configurable delay
- `cy.checkNavigation(url)` - Verify URL navigation
- `cy.checkPageTitle(title)` - Verify page title

## Running Tests

```bash
# Run E2E tests with dev server
pnpm test:e2e

# Run tests in headless mode
pnpm cypress:run:e2e
``` 