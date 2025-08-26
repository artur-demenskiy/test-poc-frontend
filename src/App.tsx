import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import ErrorBoundary from '@/components/ErrorBoundary'
import Layout from '@/components/Layout'
import About from '@/pages/About'
import Features from '@/pages/Features'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'
import { Analytics } from '@/pages/Analytics'
import { AnalyticsProvider } from '@/contexts/AnalyticsContext'
import { FeatureFlagsProvider } from '@/contexts/FeatureFlagsContext'
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
      <AnalyticsProvider autoInitialize={true}>
        <FeatureFlagsProvider autoInitialize={true}>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/features" element={<Features />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </Router>
        </FeatureFlagsProvider>
      </AnalyticsProvider>
    </ErrorBoundary>
  )
}

export default App
