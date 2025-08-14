import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import ErrorBoundary from '@/components/ErrorBoundary'
import Layout from '@/components/Layout'
import About from '@/pages/About'
import Features from '@/pages/Features'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'
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
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  )
}

export default App
