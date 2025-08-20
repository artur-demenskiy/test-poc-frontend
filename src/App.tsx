import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import ErrorBoundary from '@/components/ErrorBoundary'
import Layout from '@/components/Layout'
import { AuthProvider } from '@/contexts/AuthContext'
import About from '@/pages/About'
import Features from '@/pages/Features'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'
import { SupabaseDemo } from '@/pages/SupabaseDemo'
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
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/supabase" element={<SupabaseDemo />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
