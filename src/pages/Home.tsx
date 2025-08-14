import React from 'react'

import { logger } from '@/utils/logger'

const Home: React.FC = () => {
  React.useEffect(() => {
    logger.info('Home page mounted')
  }, [])

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          React TypeScript Boilerplate
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A production-ready React application template with modern tooling, 
          comprehensive testing, and optimized build configuration.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Fast Development</h3>
          </div>
          <p className="text-gray-600">
            Vite + React SWC for lightning-fast builds and hot module replacement.
          </p>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Type Safety</h3>
          </div>
          <p className="text-gray-600">
            TypeScript strict mode with comprehensive type checking and validation.
          </p>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Modern Styling</h3>
          </div>
          <p className="text-gray-600">
            Tailwind CSS with utility-first approach and responsive design.
          </p>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Testing</h3>
          </div>
          <p className="text-gray-600">
            Vitest + React Testing Library for comprehensive unit and integration tests.
          </p>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Code Quality</h3>
          </div>
          <p className="text-gray-600">
            ESLint + Prettier for consistent code formatting and quality.
          </p>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Error Handling</h3>
          </div>
          <p className="text-gray-600">
            ErrorBoundary component with comprehensive logging and error reporting.
          </p>
        </div>
      </div>

      {/* Getting Started */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Getting Started
        </h2>
        <div className="space-y-4 text-gray-600">
          <p>
            This boilerplate is ready for development. Start building your application by:
          </p>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>Adding new components in the <code className="bg-gray-100 px-1 rounded">src/components</code> folder</li>
            <li>Creating new pages in the <code className="bg-gray-100 px-1 rounded">src/pages</code> folder</li>
            <li>Defining types in the <code className="bg-gray-100 px-1 rounded">src/types</code> folder</li>
            <li>Adding utilities in the <code className="bg-gray-100 px-1 rounded">src/utils</code> folder</li>
            <li>Setting up additional routes in the router configuration</li>
            <li>Adding state management as needed</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default Home 