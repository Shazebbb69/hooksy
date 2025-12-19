// client/src/pages/NotFound.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'

export default function NotFound() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] px-6">
          <div className="text-center">
            <div className="text-9xl font-bold text-purple-600 mb-4">404</div>
            <h1 className="text-3xl font-bold text-purple-900 mb-4">Page Not Found</h1>
            <p className="text-purple-600 mb-8 max-w-md mx-auto">
              Oops! The page you're looking for doesn't exist. Maybe it got tangled in yarn? 🧶
            </p>
            <Link
              to="/dashboard"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              🧶 Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
