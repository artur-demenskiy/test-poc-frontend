import React from 'react'
import { Link } from 'react-router-dom'

import { logger } from '@/utils/logger'

const NotFound: React.FC = () => {
  React.useEffect(() => {
    logger.warn('404 page accessed')
  }, [])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 -mt-8">
            Page Not Found
          </h2>
        </div>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. 
          Please check the URL or navigate back to the home page.
        </p>
        
        <div className="space-x-4">
          <Link
            to="/"
            className="btn-primary"
          >
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-outline"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound 