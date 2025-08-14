import React from 'react'

import ErrorBoundary from '@/components/ErrorBoundary'
import { logger } from '@/utils/logger'

function App(): React.JSX.Element {
  React.useEffect(() => {
    logger.info('App component mounted')
  }, [])

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        logger.error('App error boundary caught error', {
          error: error.message,
          errorInfo,
        })
      }}
    >
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              React TypeScript Boilerplate
            </h1>
            <p className="text-lg text-gray-600">
              A production-ready React application template
            </p>
          </header>

          <main className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Features
              </h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  React 19 + TypeScript with strict mode
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Vite with React SWC for fast builds
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Tailwind CSS for styling
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  ESLint + Prettier for code quality
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Vitest for testing
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Error boundary and logging
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Getting Started
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  This boilerplate is ready for development. Start building your application by:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Adding new components in the <code className="bg-gray-100 px-1 rounded">src/components</code> folder</li>
                  <li>Defining types in the <code className="bg-gray-100 px-1 rounded">src/types</code> folder</li>
                  <li>Adding utilities in the <code className="bg-gray-100 px-1 rounded">src/utils</code> folder</li>
                  <li>Setting up routing with React Router</li>
                  <li>Adding state management as needed</li>
                </ol>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default App
