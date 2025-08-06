# Todo React App

Modern React application for task management with best testing practices using TDD principles.

## 🚀 Features

- **TDD approach**: All components and services are written using Test-Driven Development
- **Complete test coverage**: Unit tests, integration tests, and component tests
- **Modern UI**: Beautiful and responsive interface with Tailwind CSS
- **TypeScript**: Full typing for better development
- **Architecture**: Clean architecture with separation of concerns
- **API integration**: Ready for integration with NestJS backend

## 🛠 Technologies

- **React 18** with TypeScript
- **Testing Library** for component testing
- **Jest** for unit tests
- **Tailwind CSS** for styling
- **Axios** for HTTP requests

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── __tests__/      # Component tests
│   ├── TodoList.tsx    # Main list component
│   ├── TodoItem.tsx    # Individual todo component
│   └── TodoForm.tsx    # Add todo form
├── hooks/              # Custom hooks
│   ├── __tests__/      # Hook tests
│   └── useTodos.ts     # Hook for managing todos
├── services/           # Services for API work
│   ├── __tests__/      # Service tests
│   └── todoService.ts  # Service for working with todos
├── types/              # TypeScript types
│   └── todo.ts         # Todo interfaces
├── __tests__/          # Integration tests
│   ├── integration.test.tsx
│   └── utils.test.ts
└── App.tsx             # Main component
```

## 🧪 Testing

The project uses TDD approach with complete test coverage:

### Test Types:
- **Unit tests**: Testing individual functions and methods
- **Integration tests**: Testing interaction between components
- **Component tests**: Testing React components
- **Hook tests**: Testing custom hooks
- **Accessibility tests**: Testing accessibility (ARIA attributes)
- **Performance tests**: Basic performance tests

### Test Structure:
- **8 test suites** - complete test set
- **89 tests** - covering all functionality
- **100% successful tests** - all tests pass

### Running Tests:
```bash
# All tests
npm test

# Tests in watch mode
npm run test:watch

# Code coverage
npm run test:coverage

# Specific file
npm test -- TodoItem.test.tsx
```

## 🚀 Installation and Setup

1. **Clone repository:**
```bash
git clone <repository-url>
cd todo-react-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run in development mode:**
```bash
npm start
```

4. **Run tests:**
```bash
npm test
```

5. **Build for production:**
```bash
npm run build
```

## 🔧 Configuration

### API URL
By default, the application is configured to work with NestJS backend on `http://localhost:3000/api/todos`.

To change the API URL, edit the file `src/services/todoService.ts`:

```typescript
constructor(apiUrl: string = 'http://localhost:3000/api/todos') {
  this.apiUrl = apiUrl;
}
```

## 📊 Test Statistics

- **Total tests**: 89
- **Test suites**: 8
- **Successful tests**: 89
- **Code coverage**: High
- **Execution time**: ~5 seconds

## 🏆 Best Practices

The project demonstrates best testing practices:

- **Test Data Factories** - factories for creating test data
- **User-Centric Testing** - testing from user perspective
- **Proper Test Organization** - correct test organization
- **Accessibility Testing** - testing accessibility
- **Error Handling** - testing error handling
- **Integration Testing** - testing component interaction

## 📝 License

MIT License
# test-poc-frontend
