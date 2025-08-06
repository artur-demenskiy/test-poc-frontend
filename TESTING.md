# Testing Documentation

This document describes the testing approach for the Todo React application, including best practices, test structure, and usage examples.

## 📋 Table of Contents

- [Testing Overview](#testing-overview)
- [Test Structure](#test-structure)
- [Best Practices](#best-practices)
- [Test Types](#test-types)
- [Test Examples](#test-examples)
- [Running Tests](#running-tests)
- [Code Coverage](#code-coverage)

## 🎯 Testing Overview

Our application uses a comprehensive testing approach including:

- **Unit tests** - for individual functions and components
- **Integration tests** - for interaction between components
- **Accessibility tests** - for accessibility (ARIA attributes)
- **Performance tests** - basic performance tests

### Technologies Used

- **Jest** - testing framework
- **React Testing Library** - for testing React components
- **@testing-library/user-event** - for simulating user actions
- **Axios Mock** - for mocking HTTP requests

## 📁 Test Structure

```
src/
├── __tests__/                    # Integration tests
│   ├── integration.test.tsx     # Component interaction tests
│   └── utils.test.ts            # Utility and helper tests
├── components/
│   └── __tests__/               # Component tests
│       ├── TodoForm.test.tsx
│       ├── TodoItem.test.tsx
│       └── TodoList.test.tsx
├── hooks/
│   └── __tests__/               # Hook tests
│       └── useTodos.test.ts
└── services/
    └── __tests__/               # Service tests
        └── todoService.test.ts
```

## 🏆 Best Practices

### 1. Test Organization

```typescript
describe('ComponentName', () => {
  // Setup
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Group tests by functionality
  describe('rendering', () => {
    // Rendering tests
  });

  describe('interactions', () => {
    // User interaction tests
  });

  describe('edge cases', () => {
    // Edge case tests
  });
});
```

### 2. Test Data Factories

Use factories for creating test data:

```typescript
const createMockTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: 1,
  title: 'Test Todo',
  description: 'Test Description',
  completed: false,
  createdAt: new Date('2024-01-15T10:30:00.000Z'),
  updatedAt: new Date('2024-01-15T10:30:00.000Z'),
  ...overrides,
});
```

### 3. User-Centric Testing

Test from the user's perspective:

```typescript
it('should allow user to add a new todo', async () => {
  const user = userEvent.setup();
  render(<TodoForm onSubmit={mockOnSubmit} />);

  const titleInput = screen.getByLabelText(/title/i);
  const submitButton = screen.getByRole('button', { name: /add todo/i });

  await user.type(titleInput, 'New Todo');
  await user.click(submitButton);

  expect(mockOnSubmit).toHaveBeenCalledWith({
    title: 'New Todo',
    description: undefined,
    completed: false
  });
});
```

### 4. Accessibility Testing

Test component accessibility:

```typescript
it('should have proper ARIA labels', () => {
  render(<TodoItem {...defaultProps} />);
  
  const checkbox = screen.getByRole('checkbox');
  expect(checkbox).toHaveAttribute('aria-label', 'Mark "Test Todo" as complete');
  
  const editButton = screen.getByLabelText('Edit todo');
  const deleteButton = screen.getByLabelText('Delete todo');
  
  expect(editButton).toBeInTheDocument();
  expect(deleteButton).toBeInTheDocument();
});
```

## 🧪 Test Types

### Unit Tests

Test individual functions and methods:

```typescript
describe('TodoService', () => {
  it('should create todo successfully', async () => {
    const newTodo = createMockTodo();
    mockedAxios.post.mockResolvedValue({ data: newTodo });

    const result = await todoService.createTodo(createData);

    expect(mockedAxios.post).toHaveBeenCalledWith(baseURL, createData);
    expect(result).toEqual(newTodo);
  });
});
```

### Component Tests

Test React components:

```typescript
describe('TodoForm', () => {
  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /add todo/i });

    await user.type(titleInput, 'New Todo');
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'New Todo',
      description: undefined,
      completed: false
    });
  });
});
```

### Hook Tests

Test custom hooks:

```typescript
describe('useTodos', () => {
  it('should load todos successfully', async () => {
    mockTodoService.getAllTodos.mockResolvedValue(mockTodos);
    
    const { result } = renderHook(() => useTodos());
    
    await act(async () => {
      await result.current.loadTodos();
    });
    
    expect(result.current.todos).toEqual(mockTodos);
  });
});
```

### Integration Tests

Test interaction between components:

```typescript
describe('Todo App Integration', () => {
  it('should handle complete user workflow', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    // Add new todo
    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /add todo/i });

    await user.type(titleInput, 'New Todo');
    await user.click(submitButton);

    // Verify todo was added
    expect(screen.getByText('New Todo')).toBeInTheDocument();
  });
});
```

### Performance Tests

Basic performance tests:

```typescript
describe('performance', () => {
  it('should handle large number of todos efficiently', () => {
    const largeTodos = Array.from({ length: 1000 }, (_, i) => 
      createMockTodo({ 
        id: i + 1, 
        title: `Todo ${i + 1}`,
        description: `Description ${i + 1}`
      })
    );

    mockUseTodos.mockReturnValue({
      ...defaultMockReturn,
      todos: largeTodos
    });

    const startTime = performance.now();
    render(<TodoList />);
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(1000); // Should render in less than 1 second
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 1000')).toBeInTheDocument();
  });
});
```

## 🚀 Running Tests

### Basic Commands

```bash
# All tests
npm test

# Tests in watch mode
npm run test:watch

# Code coverage
npm run test:coverage

# Specific file
npm test -- TodoItem.test.tsx

# Specific test
npm test -- --testNamePattern="should submit form"
```

### Test Filtering

```bash
# Only failing tests
npm test -- --onlyFailures

# Tests with coverage
npm test -- --coverage --watchAll=false

# Tests from specific folder
npm test -- src/components/__tests__/
```

## 📊 Code Coverage

### Checking Coverage

```bash
npm run test:coverage
```

This will create a coverage report in the `coverage/` folder with detailed information about code coverage by tests.

### Minimum Coverage Requirements

- **Statements**: >80%
- **Branches**: >70%
- **Functions**: >80%
- **Lines**: >80%

## 🔧 Jest Configuration

### jest.config.js

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
  ],
};
```

### setupTests.ts

```typescript
import '@testing-library/jest-dom';
```

## 📝 Writing Quality Tests

### 1. Test Names

Use descriptive names:

```typescript
// ✅ Good
it('should display error message when API call fails', () => {});

// ❌ Bad
it('should work', () => {});
```

### 2. Test Structure (AAA Pattern)

```typescript
it('should add new todo', async () => {
  // Arrange - preparation
  const user = userEvent.setup();
  const mockOnSubmit = jest.fn();
  render(<TodoForm onSubmit={mockOnSubmit} />);

  // Act - action
  const titleInput = screen.getByLabelText(/title/i);
  await user.type(titleInput, 'New Todo');
  await user.click(screen.getByRole('button', { name: /add todo/i }));

  // Assert - verification
  expect(mockOnSubmit).toHaveBeenCalledWith({
    title: 'New Todo',
    description: undefined,
    completed: false
  });
});
```

### 3. Mocking

```typescript
// Mocking modules
jest.mock('../../hooks/useTodos');
const mockUseTodos = useTodos as jest.MockedFunction<typeof useTodos>;

// Mocking HTTP requests
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
```

## 🐛 Troubleshooting

### Common Issues

1. **Tests failing due to DOM changes**
   - Use semantic selectors
   - Test behavior, not structure

2. **Async tests**
   - Use `waitFor` for async operations
   - Handle `act` warnings properly

3. **Mocking**
   - Clear mocks between tests
   - Use `jest.clearAllMocks()`

### Useful Commands

```bash
# Detailed test output
npm test -- --verbose

# Run specific test in interactive mode
npm test -- --runInBand --verbose

# Check Jest configuration
npm test -- --showConfig
```

## 📚 Additional Resources

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Accessibility Testing](https://testing-library.com/docs/dom-testing-library/api-accessibility) 