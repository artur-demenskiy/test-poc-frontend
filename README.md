# React TypeScript Boilerplate

A production-ready React application template with modern tooling, comprehensive testing, and optimized build configuration.

## 🚀 Features

### Core Features
- **React 19.1.1** + **TypeScript 5.8.3** with strict mode
- **Vite** with React SWC for lightning-fast builds
- **Tailwind CSS** with utility-first approach
- **React Router v6** for client-side routing
- **Error Boundary** with comprehensive logging
- **Zod** for runtime type validation

### Development Tools
- **ESLint** + **Prettier** + **EditorConfig** for code quality
- **Vitest** + **React Testing Library** for comprehensive testing
- **Husky** + **lint-staged** for Git hooks
- **TypeScript** strict mode with comprehensive type checking

### Production Ready
- **Multi-stage Docker** build (builder → nginx)
- **GitHub Actions** CI/CD pipeline
- **Code splitting** and **tree shaking**
- **Security headers** and **optimized nginx**
- **Health checks** and **monitoring ready**

## 📋 Prerequisites

- **Node.js** 20.0.0 or higher
- **pnpm** 8.0.0 or higher

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd react-ts-boilerplate
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Set up environment variables
```bash
cp env.example .env
# Edit .env with your configuration
```

### 4. Start development server
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with navigation
│   └── ErrorBoundary.tsx # Error handling component
├── pages/              # Route components
│   ├── Home.tsx        # Home page
│   ├── About.tsx       # About page
│   ├── Features.tsx    # Features page
│   └── NotFound.tsx    # 404 page
├── types/              # TypeScript type definitions
│   ├── env.d.ts        # Environment variables types
│   └── index.ts        # Common types
├── utils/              # Utility functions
│   ├── api.ts          # API client with fetch wrapper
│   ├── logger.ts       # Structured logging
│   └── validation.ts   # Zod validation schemas
├── test/               # Test setup and utilities
│   └── setup.ts        # Vitest configuration
├── App.tsx             # Main app component with routing
├── main.tsx            # App entry point
└── index.css           # Global styles with Tailwind
```

## 🛠️ Available Scripts

### Development
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
```

### Code Quality
```bash
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues
pnpm type-check   # Run TypeScript type check
pnpm format       # Format code with Prettier
pnpm format:check # Check code formatting
```

### Testing
```bash
pnpm test         # Run tests in watch mode
pnpm test:ui      # Run tests with UI
pnpm test:run     # Run tests once
pnpm test:coverage # Run tests with coverage
```

## 🐳 Docker

### Development
```bash
# Start development environment
docker-compose --profile dev up

# Build and start development container
docker-compose --profile dev up --build
```

### Production
```bash
# Build and start production environment
docker-compose --profile prod up --build

# Build production image only
docker build -t react-boilerplate:latest .
```

### Docker Commands
```bash
# Build image
docker build -t react-boilerplate .

# Run container
docker run -p 80:80 react-boilerplate

# Run with custom nginx config
docker run -p 80:80 -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf react-boilerplate
```

## 🔄 CI/CD Pipeline

The project includes a comprehensive GitHub Actions workflow:

### Pipeline Stages
1. **Lint & Type Check** - ESLint and TypeScript validation
2. **Test** - Unit tests with coverage reporting
3. **Build** - Production build with artifacts
4. **Security** - Dependency vulnerability audit
5. **Deploy** - Automatic deployment to staging/production

### Workflow Triggers
- **Push** to `main` or `develop` branches
- **Pull Request** to `main` or `develop` branches

### Environment Deployments
- **Staging** - Automatic deployment on `develop` branch
- **Production** - Automatic deployment on `main` branch

## 🌐 Routing

The application uses React Router v6 with the following routes:

- `/` - Home page with feature overview
- `/about` - About page with project information
- `/features` - Detailed features and capabilities
- `/*` - 404 page for unmatched routes

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **PostCSS** with **Autoprefixer** for cross-browser compatibility
- **Custom CSS classes** defined in `src/index.css`
- **Responsive design** with mobile-first approach

## 🧪 Testing

### Testing Stack
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing utilities
- **jsdom** - DOM environment for tests
- **Coverage reporting** with built-in support

### Test Structure
```
src/
├── test/
│   └── setup.ts        # Global test configuration
├── components/
│   └── __tests__/      # Component tests (to be added)
└── utils/
    └── __tests__/      # Utility tests (to be added)
```

## 🔧 Configuration Files

- **`vite.config.ts`** - Vite build configuration
- **`tsconfig.json`** - TypeScript configuration
- **`tailwind.config.js`** - Tailwind CSS configuration
- **`eslint.config.js`** - ESLint configuration
- **`vitest.config.ts`** - Vitest configuration
- **`Dockerfile`** - Multi-stage Docker build
- **`docker-compose.yml`** - Local development environment
- **`nginx.conf`** - Production nginx configuration

## 🚀 Deployment

### Manual Deployment
```bash
# Build the application
pnpm build

# Deploy dist/ folder to your hosting service
# (Netlify, Vercel, AWS S3, etc.)
```

### Docker Deployment
```bash
# Build production image
docker build -t react-boilerplate:latest .

# Run in production
docker run -d -p 80:80 --name react-app react-boilerplate:latest
```

### CI/CD Deployment
The GitHub Actions workflow automatically deploys:
- **Staging** environment on `develop` branch
- **Production** environment on `main` branch

## 🔒 Security Features

- **Security headers** in nginx configuration
- **Content Security Policy** (CSP)
- **XSS protection** and **frame options**
- **Non-root user** in Docker containers
- **Dependency vulnerability** scanning in CI/CD

## 📊 Performance Features

- **Code splitting** for optimal bundle sizes
- **Tree shaking** for dead code elimination
- **Gzip compression** for faster loading
- **Static asset caching** with long-term headers
- **Source maps** for debugging (development only)

## 🐛 Error Handling

- **Error Boundary** component for React error catching
- **Structured logging** with different levels
- **Error reporting** ready for production monitoring
- **Graceful fallbacks** for failed components

## 📝 Environment Variables

Create a `.env` file based on `env.example`:

```bash
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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Write tests for new features
- Use ESLint and Prettier for code formatting
- Follow the established project structure
- Update documentation as needed

## 📚 Documentation

- **This README** - Project overview and setup
- **Code comments** - Inline documentation
- **TypeScript types** - Self-documenting code
- **Test files** - Usage examples

## 🔗 Useful Links

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the fast build tool
- Tailwind CSS team for the utility-first CSS framework
- All contributors and maintainers

---

**Happy coding! 🎉**
