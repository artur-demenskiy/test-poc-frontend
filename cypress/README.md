# Cypress Testing

This directory contains Cypress E2E and component tests for the React TypeScript Boilerplate.

## Structure

```
cypress/
├── e2e/           # End-to-end tests
├── component/     # Component tests
├── support/       # Support files and custom commands
├── fixtures/      # Test data fixtures
└── README.md      # This file
```

## Available Scripts

- `pnpm cypress:open` - Open Cypress Test Runner
- `pnpm cypress:run` - Run all Cypress tests in headless mode
- `pnpm cypress:run:e2e` - Run only E2E tests
- `pnpm cypress:run:component` - Run only component tests
- `pnpm test:e2e` - Start dev server and run E2E tests
- `pnpm test:component` - Start dev server and run component tests

## E2E Tests

E2E tests verify the complete user journey through the application:

- **navigation.cy.ts** - Tests routing and navigation
- **home.cy.ts** - Tests Home page content and layout
- **about.cy.ts** - Tests About page content and structure
- **features.cy.ts** - Tests Features page content and functionality

## Component Tests

Component tests verify individual React components in isolation:

- **Layout.cy.tsx** - Tests Layout component rendering and props

## Custom Commands

The following custom commands are available:

- `cy.waitForPageLoad()` - Wait for page to fully load
- `cy.clickElement(selector)` - Click element with visibility and enabled checks
- `cy.typeWithDelay(selector, text, delay)` - Type text with configurable delay
- `cy.checkNavigation(url)` - Verify URL navigation
- `cy.checkPageTitle(title)` - Verify page title

## Configuration

Cypress configuration is in `cypress.config.ts`:

- **E2E**: Base URL `http://localhost:3000`, viewport 1280x720
- **Component**: Vite dev server with React framework
- **Screenshots**: Enabled on test failure
- **Videos**: Disabled for faster runs

## Running Tests

### Development Mode
```bash
# Open Cypress Test Runner
pnpm cypress:open

# Run E2E tests with dev server
pnpm test:e2e

# Run component tests with dev server
pnpm test:component
```

### Headless Mode
```bash
# Run all tests
pnpm cypress:run

# Run only E2E tests
pnpm cypress:run:e2e

# Run only component tests
pnpm cypress:run:component
```

## Best Practices

1. **Use data-testid attributes** for reliable element selection
2. **Write descriptive test names** that explain the expected behavior
3. **Keep tests independent** - each test should be able to run alone
4. **Use custom commands** for common operations
5. **Test user behavior** not implementation details
6. **Handle async operations** with proper waiting strategies

## Troubleshooting

### Common Issues

1. **Element not found**: Ensure the element is visible and not hidden by CSS
2. **Timing issues**: Use `cy.waitForPageLoad()` or proper waiting strategies
3. **Navigation problems**: Check that React Router is properly configured
4. **Component mounting**: Ensure component tests have proper imports and setup

### Debug Mode

Use `cy.debug()` or `cy.pause()` in tests to debug issues:

```typescript
it('should work correctly', () => {
  cy.visit('/')
  cy.pause() // Pause execution here
  cy.get('[data-testid="button"]').click()
})
``` 