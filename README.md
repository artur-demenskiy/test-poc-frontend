# React TypeScript Boilerplate

A production-ready React application template with modern tooling, comprehensive testing, and optimized build configuration.

## 🚀 Features

- **React 19.1.1** + **TypeScript 5.8.3** with strict mode
- **Vite** with React SWC for lightning-fast builds
- **React Router v6** for client-side routing
- **Tailwind CSS** for utility-first styling
- **Vitest** + **React Testing Library** for unit testing
- **Cypress** for E2E and component testing
- **ESLint** + **Prettier** for code quality
- **Git hooks** with Husky + lint-staged
- **GitHub Actions** CI/CD pipeline
- **Docker** multi-stage build with Nginx
- **Error Boundary** with comprehensive logging
- **Zod** validation schemas
- **API utilities** with fetch wrapper

## 📋 Prerequisites

- **Node.js** 20+ 
- **pnpm** 10.12.3+

## 🚀 Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd react-ts-boilerplate

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open in browser
open http://localhost:3000
```

## 🧪 Testing

### Unit & Integration Tests (Vitest)
```bash
# Run tests in watch mode
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests once
pnpm test:run

# Run tests with coverage
pnpm test:coverage
```

### E2E Tests (Cypress)
```bash
# Open Cypress Test Runner
pnpm cypress:open

# Run E2E tests with dev server
pnpm test:e2e

# Run component tests with dev server
pnpm test:component

# Run tests in headless mode
pnpm cypress:run
```

### Component Tests (Cypress)
```bash
# Run component tests
pnpm cypress:run:component
```

## 🛠️ Development Commands

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Type checking
pnpm type-check

# Format code
pnpm format

# Check formatting
pnpm format:check
```

## 🏗️ Build & Deployment

```bash
# Build application
pnpm build

# Build creates optimized files in dist/ directory
```

## 🐳 Docker

### Development
```bash
# Start development environment
docker-compose --profile dev up

# Or build and run manually
docker build --target builder -t react-boilerplate:dev .
docker run -p 3000:3000 -v $(pwd):/app react-boilerplate:dev
```

### Production
```bash
# Build and run production container
docker-compose --profile prod up

# Or manually
docker build -t react-boilerplate:prod .
docker run -p 80:80 react-boilerplate:prod
```

## 🔧 Environment Variables

Create `.env` file based on `.env.example`:

```bash
VITE_APP_TITLE=React Boilerplate
VITE_APP_VERSION=0.1.0
VITE_APP_ENV=development
VITE_API_URL=http://localhost:3001/api
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with navigation
│   └── ErrorBoundary.tsx # Error boundary component
├── pages/              # Route components
│   ├── Home.tsx        # Home page
│   ├── About.tsx       # About page
│   ├── Features.tsx    # Features page
│   └── NotFound.tsx    # 404 page
├── types/              # TypeScript type definitions
│   ├── index.ts        # Common types
│   └── env.d.ts        # Environment variable types
├── utils/              # Utility functions
│   ├── logger.ts       # Logging utility
│   ├── api.ts          # API client
│   └── validation.ts   # Zod validation schemas
├── test/               # Test setup and utilities
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles

cypress/                # Cypress testing
├── e2e/                # End-to-end tests
├── component/          # Component tests
├── support/            # Support files
└── fixtures/           # Test data

.github/workflows/      # GitHub Actions CI/CD
├── ci.yml              # Main CI pipeline

Dockerfile              # Multi-stage Docker build
nginx.conf              # Nginx configuration
docker-compose.yml      # Docker services
```

## 🧪 Testing Stack

### Vitest (Unit & Integration)
- **Fast execution** with Vite integration
- **React Testing Library** for component testing
- **jsdom** for DOM environment
- **Coverage reporting** with v8 provider

### Cypress (E2E & Component)
- **E2E Testing** for complete user journeys
- **Component Testing** for isolated component testing
- **Custom Commands** for common operations
- **Vite Integration** for fast component tests

## 🔧 Configuration Files

- **`vite.config.ts`** - Vite build configuration
- **`tsconfig.json`** - TypeScript configuration
- **`tailwind.config.js`** - Tailwind CSS configuration
- **`eslint.config.js`** - ESLint rules and configuration
- **`prettier.config.js`** - Prettier formatting rules
- **`cypress.config.ts`** - Cypress testing configuration

## 🚀 CI/CD Pipeline

GitHub Actions workflow includes:

1. **Lint & Type Check** - ESLint and TypeScript validation
2. **Testing** - Unit tests with coverage upload
3. **Build** - Production build with artifact upload
4. **Security Audit** - Dependency vulnerability check
5. **Deploy** - Conditional deployment to staging/production

## 🐳 Docker Features

- **Multi-stage build** (builder → nginx)
- **Production nginx** with security headers
- **Non-root user** for security
- **Health checks** for container monitoring
- **Optimized caching** for static assets

## 🔒 Security Features

- **Security headers** (X-Frame-Options, CSP, etc.)
- **Non-root user** in Docker containers
- **Dependency auditing** in CI pipeline
- **Environment validation** with Zod schemas

## ⚡ Performance Features

- **Code splitting** for vendor libraries
- **Tree shaking** for dead code elimination
- **Gzip compression** for static assets
- **Optimized caching** strategies
- **Fast refresh** in development

## 🚨 Error Handling

- **Error Boundary** component for React errors
- **Comprehensive logging** with structured output
- **Error reporting** integration ready
- **Graceful fallbacks** for user experience

## 📚 Next Steps

1. **Add React Query** for data fetching
2. **Implement authentication** and protected routes
3. **Add state management** (Redux Toolkit, Zustand)
4. **Set up Storybook** for component documentation
5. **Add performance monitoring** (Lighthouse CI)
6. **Implement PWA** features

## 🔗 Documentation Links

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Vitest Documentation](https://vitest.dev/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
