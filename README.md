# React TypeScript Boilerplate

A production-ready React application template built with modern technologies and best practices.

## 🚀 Features

- **React 19** with TypeScript strict mode
- **Vite** with React SWC for lightning-fast builds
- **Tailwind CSS** for utility-first styling
- **ESLint + Prettier** for code quality
- **Vitest** for testing with React Testing Library
- **Error Boundary** with comprehensive logging
- **Zod** for runtime validation
- **Modern project structure** with path aliases
- **Production optimizations** with code splitting

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Testing**: Vitest, React Testing Library, jsdom
- **Code Quality**: ESLint, Prettier, EditorConfig
- **Validation**: Zod
- **Build Tool**: Vite with React SWC

## 📋 Prerequisites

- Node.js 20+ 
- pnpm 8+

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd react-ts-boilerplate
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ErrorBoundary.tsx
├── types/              # TypeScript type definitions
│   ├── env.d.ts        # Vite environment types
│   └── index.ts        # Common types
├── utils/              # Utility functions
│   ├── api.ts          # API client utilities
│   ├── logger.ts       # Logging utilities
│   └── validation.ts   # Zod validation schemas
├── test/               # Test configuration
│   └── setup.ts        # Test setup and mocks
├── App.tsx             # Main application component
├── index.css           # Global styles with Tailwind
└── main.tsx            # Application entry point
```

## 🧪 Testing

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run tests with coverage
pnpm test:coverage

# Run tests with UI
pnpm test:ui
```

## 🔧 Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Type check
pnpm type-check

# Format code
pnpm format

# Check formatting
pnpm format:check
```

## 📦 Build & Deployment

```bash
# Build for production
pnpm build

# The build output will be in the `dist/` folder
# Ready for deployment to any static hosting service
```

## 🌍 Environment Variables

Create a `.env` file based on `env.example`:

```env
# Application
VITE_APP_TITLE=React TypeScript Boilerplate
VITE_APP_VERSION=0.1.0
VITE_APP_ENV=development

# API Configuration
VITE_API_URL=http://localhost:3001/api

# Feature Flags
VITE_ENABLE_LOGGING=true
VITE_ENABLE_ANALYTICS=false
```

## 🎯 Key Features Explained

### Error Boundary
- Catches JavaScript errors anywhere in the component tree
- Logs errors with context for debugging
- Provides user-friendly error UI
- Configurable fallback components

### Logging System
- Lightweight logger with different log levels
- Development vs production behavior
- Structured logging with context
- Easy integration with external services

### Validation with Zod
- Runtime type validation
- Form validation schemas
- API response validation
- Environment variable validation

### API Utilities
- Fetch-based HTTP client
- Request/response interceptors
- Error handling and logging
- Timeout and retry logic

## 🔮 Next Steps

This boilerplate is ready for you to:

1. **Add routing** with React Router v6
2. **Implement state management** (Redux Toolkit, Zustand, etc.)
3. **Add authentication** and protected routes
4. **Set up CI/CD** with GitHub Actions
5. **Add Docker** configuration
6. **Implement testing** for your components
7. **Add Storybook** for component development

## 📚 Documentation

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vitest](https://vitest.dev/)
- [Zod](https://zod.dev/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy coding! 🚀**
