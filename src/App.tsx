import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import About from '@/pages/About'
import ErrorBoundary from '@/components/ErrorBoundary'
import Features from '@/pages/Features'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'
import { AntDProvider } from '@/providers/AntDProvider'
import { logger } from '@/utils/logger'

function App(): React.JSX.Element {
  React.useEffect(() => {
    logger.info('App component mounted with Ant Design integration')
  }, [])

  return (
    <AntDProvider>
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
    </AntDProvider>
  )
}

export default App
