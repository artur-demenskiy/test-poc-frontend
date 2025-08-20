import React from 'react'
import { ShadcnDemo } from '@/components/ShadcnDemo'
import { logger } from '@/utils/logger'

const Home: React.FC = () => {
  React.useEffect(() => {
    logger.info('Home page mounted with Shadcn/ui demo')
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Shadcn/ui Demo
            </h1>
            <p className="text-lg text-gray-600">
              Beautiful and accessible components built with Radix UI and Tailwind CSS
            </p>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <ShadcnDemo />
    </div>
  )
}

export default Home 