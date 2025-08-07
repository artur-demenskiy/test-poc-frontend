# Testing Documentation

This document describes the comprehensive testing approach for the Todo React application, including Cypress best practices, test structure, and usage examples.

## 📋 Table of Contents

- [Testing Overview](#testing-overview)
- [Cypress Best Practices](#cypress-best-practices)
- [Test Structure](#test-structure)
- [Test Types](#test-types)
- [Running Tests](#running-tests)
- [Code Coverage](#code-coverage)
- [Advanced Patterns](#advanced-patterns)

## 🎯 Testing Overview

Our application uses a comprehensive testing approach with **Cypress** as the primary testing framework:

- **E2E Tests** - Full user workflows and critical paths
- **Component Tests** - Isolated component testing with real browser environment
- **API Tests** - Backend integration and error handling
- **Accessibility Tests** - WCAG 2.1 AA compliance
- **Performance Tests** - Load times and Core Web Vitals
- **Unit Tests** - Individual functions and components (Jest + RTL)

### Technologies Used

- **Cypress** - Primary testing framework for E2E and component testing
- **Cypress Testing Library** - Accessibility-first testing utilities
- **Jest** - Unit testing framework
- **React Testing Library** - For testing React components
- **@testing-library/user-event** - For simulating user actions

## 🏆 Cypress Best Practices

### 1. Test Isolation & Independence

**✅ Best Practice: Independent Tests**
```typescript
describe('Todo App', () => {
  beforeEach(() => {
    // Reset state before each test
    cy.task('db:seed')
    cy.visit('/')
  })

  it('can add a new todo', () => {
    // Complete workflow in single test
    cy.get('[data-testid="new-todo"]').type('Learn Cypress{enter}')
    cy.get('[data-testid="todo-list"] li').should('have.length', 1)
    cy.get('[data-testid="todo-list"] li').first().should('contain', 'Learn Cypress')
  })
})
```

**❌ Anti-Pattern: Coupled Tests**
```typescript
// DON'T DO THIS - Tests depend on each other
describe('Todo App', () => {
  it('visits the app', () => {
    cy.visit('/')
  })

  it('adds a todo', () => {
    cy.get('[data-testid="new-todo"]').type('Learn Cypress{enter}')
  })

  it('verifies the todo', () => {
    cy.get('[data-testid="todo-list"] li').should('contain', 'Learn Cypress')
  })
})
```

### 2. Element Selection Best Practices

**✅ Use Data Attributes for Stable Selectors**
```html
<button
  id="main"
  class="btn btn-large"
  name="submission"
  role="button"
  data-testid="submit-button"
>
  Submit
</button>
```

**✅ Custom Commands for Consistent Selectors**
```typescript
// cypress/support/commands.ts
Cypress.Commands.add('getByTestId', (selector, ...args) => {
  return cy.get(`[data-testid=${selector}]`, ...args)
})

Cypress.Commands.add('getByTestIdLike', (selector, ...args) => {
  return cy.get(`[data-testid*=${selector}]`, ...args)
})
```

**✅ Accessibility-First Testing with Cypress Testing Library**
```typescript
// Install: npm install --save-dev @testing-library/cypress
// Add to cypress/support/commands.ts: import '@testing-library/cypress/add-commands'

// Use semantic selectors
cy.findByRole('button', { name: 'Add Todo' }).click()
cy.findByLabelText('Todo title').type('New Todo')
cy.findByText('Submit').click()

// Instead of brittle selectors
cy.get('.btn-primary').click() // ❌ Avoid
cy.get('#todo-input').type('New Todo') // ❌ Avoid
```

### 3. Multiple Assertions in Single Test

**✅ Best Practice: Combine Related Assertions**
```typescript
it('validates and formats first name', () => {
  cy.get('[data-testid="first-name"]')
    .type('johnny')
    .should('have.attr', 'data-validation', 'required')
    .and('have.class', 'active')
    .and('have.value', 'Johnny')
})
```

**❌ Anti-Pattern: Tiny Tests with Single Assertions**
```typescript
// DON'T DO THIS - Inefficient for E2E testing
describe('my form', () => {
  beforeEach(() => {
    cy.visit('/users/new')
    cy.get('[data-testid="first-name"]').type('johnny')
  })

  it('has validation attr', () => {
    cy.get('[data-testid="first-name"]').should('have.attr', 'data-validation', 'required')
  })

  it('has active class', () => {
    cy.get('[data-testid="first-name"]').should('have.class', 'active')
  })

  it('has formatted first name', () => {
    cy.get('[data-testid="first-name"]').should('have.value', 'Johnny')
  })
})
```

### 4. State Management Best Practices

**✅ Use beforeEach for State Reset**
```typescript
// cypress/support/e2e.ts
beforeEach(() => {
  // Reset state before every test
  cy.task('db:seed')
})
```

**✅ Database Seeding with Cypress Tasks**
```typescript
// cypress.config.ts
export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        async 'db:seed'() {
          // Send request to backend API to re-seed database
          const { data } = await axios.post(`${testDataApiEndpoint}/seed`)
          return data
        },
      })
    },
  },
})
```

**❌ Anti-Pattern: Using afterEach for Cleanup**
```typescript
// DON'T DO THIS - Unreliable cleanup
describe('logged in user', () => {
  beforeEach(() => {
    cy.login()
  })

  afterEach(() => {
    cy.logout() // ❌ This may not run if browser refreshes
  })
})
```

### 5. Network Request Handling

**✅ Explicit Wait for Aliased Routes**
```typescript
cy.intercept('GET', '/users', [{ name: 'Maggy' }, { name: 'Joan' }]).as('getUsers')
cy.get('[data-testid="fetch-users"]').click()
cy.wait('@getUsers') // ✅ Wait explicitly for this route
cy.get('table tr').should('have.length', 2)
```

**❌ Anti-Pattern: Unnecessary Waits**
```typescript
// DON'T DO THIS - Unnecessary explicit waits
cy.intercept('GET', '/users', [{ name: 'Maggy' }, { name: 'Joan' }])
cy.get('#fetch').click()
cy.wait(4000) // ❌ Unnecessary wait
cy.get('table tr').should('have.length', 2)
```

### 6. Command Aliasing Best Practices

**✅ Use Aliases Instead of Variables**
```typescript
// ✅ CORRECT - Use aliases
cy.get('a').as('links')
cy.visit('https://example.cypress.io')
cy.get('@links').first().click()
```

**❌ Anti-Pattern: Direct Variable Assignment**
```typescript
// ❌ DON'T DO THIS - Cypress commands are async
const a = cy.get('a')
cy.visit('https://example.cypress.io')
a.first().click() // This will fail
```

### 7. Conditional Testing Patterns

**✅ Recursive Pattern for Retries**
```typescript
const checkAndReload = () => {
  cy.get('#result')
    .should('not.be.empty')
    .invoke('text')
    .then(parseInt)
    .then((number) => {
      if (number === 7) {
        cy.log('lucky **7**')
        return
      }
      
      cy.wait(500, { log: false })
      cy.reload()
      checkAndReload()
    })
}

cy.visit('public/index.html')
checkAndReload()
```

**✅ Synchronous DOM Testing**
```typescript
// Click button causing new elements to appear
cy.get('button').click()
cy.get('body')
  .then(($body) => {
    // Synchronously query from body
    if ($body.find('input').length) {
      return 'input'
    }
    return 'textarea'
  })
  .then((selector) => {
    cy.get(selector).type(`found the element by selector ${selector}`)
  })
```

## 📁 Test Structure

```
cypress/
├── e2e/                    # End-to-end tests
│   ├── todo-app.cy.ts     # Main app workflows
│   ├── smoke.cy.ts        # Critical functionality
│   ├── api.cy.ts          # API integration tests
│   ├── accessibility.cy.ts # Accessibility compliance
│   └── performance.cy.ts  # Performance benchmarks
├── component/             # Component tests
│   └── TodoForm.cy.tsx    # Isolated component testing
├── fixtures/              # Test data
│   ├── todos.json         # Sample todo data
│   ├── new-todo.json      # New todo payload
│   └── updated-todo.json  # Updated todo payload
└── support/               # Custom commands and utilities
    ├── commands.ts        # Custom Cypress commands
    ├── e2e.ts            # E2E support file
    └── component.ts      # Component testing support
```

## 🧪 Test Types

### E2E Tests

**Complete User Workflows**
```typescript
describe('Todo App E2E', () => {
  beforeEach(() => {
    cy.task('db:seed')
    cy.visit('/')
  })

  it('can complete full todo workflow', () => {
    // Add new todo
    cy.findByRole('textbox', { name: /todo title/i }).type('Learn Cypress{enter}')
    
    // Verify todo was added
    cy.findByText('Learn Cypress').should('be.visible')
    
    // Mark as complete
    cy.findByRole('checkbox', { name: /mark learn cypress as complete/i }).click()
    
    // Verify completion
    cy.findByText('Learn Cypress').should('have.class', 'completed')
    
    // Delete todo
    cy.findByRole('button', { name: /delete learn cypress/i }).click()
    
    // Verify deletion
    cy.findByText('Learn Cypress').should('not.exist')
  })
})
```

### Component Tests

**Isolated Component Testing**
```typescript
describe('TodoForm Component', () => {
  it('submits form with valid data', () => {
    const onSubmitSpy = cy.spy().as('onSubmitSpy')
    
    cy.mount(<TodoForm onSubmit={onSubmitSpy} />)
    
    cy.findByRole('textbox', { name: /todo title/i }).type('New Todo')
    cy.findByRole('button', { name: /add todo/i }).click()
    
    cy.get('@onSubmitSpy').should('have.been.calledWith', {
      title: 'New Todo',
      description: '',
      completed: false
    })
  })
})
```

### API Tests

**Backend Integration Testing**
```typescript
describe('Todo API', () => {
  it('can create, read, update, and delete todos', () => {
    // Create todo
    cy.request('POST', '/api/todos', {
      title: 'Test Todo',
      description: 'Test Description'
    }).then((response) => {
      expect(response.status).to.equal(201)
      const todoId = response.body.id
      
      // Read todo
      cy.request('GET', `/api/todos/${todoId}`).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.title).to.equal('Test Todo')
      })
      
      // Update todo
      cy.request('PUT', `/api/todos/${todoId}`, {
        title: 'Updated Todo',
        completed: true
      }).then((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.completed).to.be.true
      })
      
      // Delete todo
      cy.request('DELETE', `/api/todos/${todoId}`).then((response) => {
        expect(response.status).to.equal(204)
      })
    })
  })
})
```

### Accessibility Tests

**WCAG Compliance Testing**
```typescript
describe('Accessibility', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.injectAxe()
  })

  it('should not have any automatically detectable accessibility violations', () => {
    cy.checkA11y()
  })

  it('should have proper heading structure', () => {
    cy.get('h1').should('exist')
    cy.get('h1').should('contain', 'Todo App')
  })

  it('should support keyboard navigation', () => {
    cy.get('body').tab()
    cy.focused().should('have.attr', 'data-testid', 'new-todo')
    
    cy.focused().type('Test Todo{enter}')
    cy.tab()
    cy.focused().should('have.attr', 'role', 'checkbox')
  })
})
```

### Performance Tests

**Core Web Vitals Testing**
```typescript
describe('Performance', () => {
  it('should load within performance budget', () => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        cy.spy(win.console, 'log').as('consoleLog')
      }
    })

    // Measure page load time
    cy.window().then((win) => {
      const perfData = win.performance.getEntriesByType('navigation')[0]
      expect(perfData.loadEventEnd - perfData.loadEventStart).to.be.lessThan(3000)
    })

    // Check for console errors
    cy.get('@consoleLog').should('not.be.called')
  })

  it('should handle large datasets efficiently', () => {
    // Load large dataset
    cy.intercept('GET', '/api/todos', { fixture: 'large-todos.json' }).as('getLargeTodos')
    cy.visit('/')
    cy.wait('@getLargeTodos')

    // Measure rendering performance
    const startTime = performance.now()
    cy.get('[data-testid="todo-list"] li').should('have.length', 1000)
    const endTime = performance.now()

    expect(endTime - startTime).to.be.lessThan(1000)
  })
})
```

## 🚀 Running Tests

### Basic Commands

```bash
# Open Cypress Test Runner
npm run cypress:open

# Run all E2E tests headlessly
npm run cypress:run

# Run component tests
npm run cypress:component

# Run specific test file
npm run cypress:run -- --spec "cypress/e2e/todo-app.cy.ts"

# Run tests in specific browser
npm run cypress:run -- --browser chrome
```

### Advanced Commands

```bash
# Run tests with custom configuration
npm run cypress:run -- --config baseUrl=http://localhost:3000

# Run tests with environment variables
npm run cypress:run -- --env apiUrl=http://localhost:3001/api

# Run tests in parallel (CI/CD)
npm run cypress:run -- --parallel --record --key YOUR_RECORD_KEY

# Run tests with custom viewport
npm run cypress:run -- --config viewportWidth=375,viewportHeight=667
```

### Test Filtering

```bash
# Run only failing tests
npm run cypress:run -- --onlyFailures

# Run tests matching pattern
npm run cypress:run -- --spec "**/smoke*.cy.ts"

# Run tests in specific folder
npm run cypress:run -- --spec "cypress/e2e/api/**/*"
```

## 📊 Code Coverage

### Configuration

```typescript
// cypress.config.ts
export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)
      return config
    },
  },
  component: {
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)
      return config
    },
  },
})
```

### Coverage Requirements

- **Statements**: >80%
- **Branches**: >70%
- **Functions**: >80%
- **Lines**: >80%

## 🔧 Advanced Patterns

### Custom Commands

```typescript
// cypress/support/commands.ts

// Login command
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.session([username, password], () => {
    cy.visit('/login')
    cy.findByLabelText(/username/i).type(username)
    cy.findByLabelText(/password/i).type(password)
    cy.findByRole('button', { name: /sign in/i }).click()
    cy.url().should('include', '/dashboard')
  })
})

// Create todo command
Cypress.Commands.add('createTodo', (title: string, description?: string) => {
  cy.findByRole('textbox', { name: /todo title/i }).type(title)
  if (description) {
    cy.findByLabelText(/description/i).type(description)
  }
  cy.findByRole('button', { name: /add todo/i }).click()
})

// Assert todo exists
Cypress.Commands.add('assertTodoExists', (title: string) => {
  cy.findByText(title).should('be.visible')
})
```

### Page Object Pattern

```typescript
// cypress/support/page-objects/TodoPage.ts
class TodoPage {
  elements = {
    newTodoInput: () => cy.findByRole('textbox', { name: /todo title/i }),
    addButton: () => cy.findByRole('button', { name: /add todo/i }),
    todoList: () => cy.get('[data-testid="todo-list"]'),
    todoItem: (title: string) => cy.findByText(title),
    deleteButton: (title: string) => cy.findByRole('button', { name: new RegExp(`delete ${title}`, 'i') })
  }

  visit() {
    cy.visit('/')
    return this
  }

  addTodo(title: string, description?: string) {
    this.elements.newTodoInput().type(title)
    if (description) {
      cy.findByLabelText(/description/i).type(description)
    }
    this.elements.addButton().click()
    return this
  }

  assertTodoExists(title: string) {
    this.elements.todoItem(title).should('be.visible')
    return this
  }

  deleteTodo(title: string) {
    this.elements.deleteButton(title).click()
    return this
  }
}

export default new TodoPage()
```

### Test Data Factories

```typescript
// cypress/support/factories/todoFactory.ts
export const createTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: Math.random().toString(36).substr(2, 9),
  title: 'Test Todo',
  description: 'Test Description',
  completed: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
})

export const createTodoList = (count: number): Todo[] => {
  return Array.from({ length: count }, (_, index) => 
    createTodo({
      id: `todo-${index + 1}`,
      title: `Todo ${index + 1}`,
      description: `Description for todo ${index + 1}`
    })
  )
}
```

### Visual Testing

```typescript
// cypress/e2e/visual.cy.ts
describe('Visual Testing', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should match todo list snapshot', () => {
    // Ensure DOM is stable
    cy.get('[data-testid="todo-list"]').should('be.visible')
    
    // Take snapshot
    cy.matchImageSnapshot('todo-list-empty')
  })

  it('should match completed todo snapshot', () => {
    // Add and complete a todo
    cy.createTodo('Visual Test Todo')
    cy.findByRole('checkbox', { name: /mark visual test todo as complete/i }).click()
    
    // Wait for state change
    cy.findByText('Visual Test Todo').should('have.class', 'completed')
    
    // Take snapshot
    cy.matchImageSnapshot('todo-completed')
  })
})
```

## 🐛 Troubleshooting

### Common Issues

1. **Flaky Tests**
   - Use `cy.wait('@alias')` instead of arbitrary waits
   - Ensure proper state reset in `beforeEach`
   - Use stable selectors with `data-testid`

2. **Element Not Found**
   - Check if element is in viewport: `cy.get('element').scrollIntoView()`
   - Wait for element to be visible: `cy.get('element').should('be.visible')`
   - Use proper selectors: prefer `data-testid` over CSS classes

3. **Network Request Issues**
   - Intercept requests: `cy.intercept('GET', '/api/todos').as('getTodos')`
   - Wait for requests: `cy.wait('@getTodos')`
   - Mock responses: `cy.intercept('GET', '/api/todos', { fixture: 'todos.json' })`

### Debugging Commands

```bash
# Run tests with debug output
npm run cypress:run -- --headed --no-exit

# Run specific test with verbose output
npm run cypress:run -- --spec "cypress/e2e/todo-app.cy.ts" --headed

# Check Cypress configuration
npm run cypress:run -- --showConfig
```

## 📚 Additional Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress Testing Library](https://github.com/testing-library/cypress-testing-library)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Accessibility Testing with Cypress](https://docs.cypress.io/guides/end-to-end-testing/accessibility-testing)
- [Visual Testing with Cypress](https://docs.cypress.io/guides/tooling/visual-testing)
- [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app) - Example of best practices 