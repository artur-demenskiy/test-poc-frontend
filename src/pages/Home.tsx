import React from 'react'

import { AntDDemo } from '@/components/AntDDemo'
import { logger } from '@/utils/logger'

const Home: React.FC = () => {
  React.useEffect(() => {
    logger.info('Home page mounted with Ant Design demo')
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Ant Design Demo
            </h1>
            <p className="text-lg text-gray-600">
              Enterprise-level UI design language and React UI library
            </p>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <AntDDemo />
    </div>
  )
}

export default Home 