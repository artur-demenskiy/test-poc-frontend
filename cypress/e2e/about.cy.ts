import React from 'react'

import { logger } from '@/utils/logger'

const About: React.FC = () => {
  React.useEffect(() => {
    logger.info('About page mounted')
  }, [])

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About This Boilerplate
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A comprehensive, production-ready React application template designed for modern web development.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Overview */}
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Project Overview
          </h2>
          <div className="space-y-4 text-gray-600">
            <p>
              This boilerplate is designed to provide developers with a solid foundation 
              for building React applications that are ready for production deployment.
            </p>
            <p>
              It includes modern tooling, comprehensive testing setup, and best practices 
              that ensure code quality and maintainability.
            </p>
            <p>
              The project structure follows industry standards and provides clear separation 
              of concerns for scalable development.
            </p>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="card">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Technology Stack
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Runtime</span>
              <span className="text-sm text-gray-500">Node.js 20+</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Package Manager</span>
              <span className="text-sm text-gray-500">pnpm</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Framework</span>
              <span className="text-sm text-gray-500">React 19.1.1</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Build Tool</span>
              <span className="text-sm text-gray-500">Vite + React SWC</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Language</span>
              <span className="text-sm text-gray-500">TypeScript 5.8.3</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Styling</span>
              <span className="text-sm text-gray-500">Tailwind CSS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Development Features */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Development Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Code Quality</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                ESLint with TypeScript rules
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Prettier for code formatting
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                EditorConfig for consistency
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Git hooks with Husky
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Testing & Build</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Vitest for unit testing
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                React Testing Library
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Optimized production builds
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Code splitting support
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Project Structure */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Project Structure
        </h2>
        <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
          <pre className="text-gray-700">
{`src/
├── components/          # Reusable UI components
├── pages/              # Route components
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── test/               # Test setup and utilities
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles`}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default About 