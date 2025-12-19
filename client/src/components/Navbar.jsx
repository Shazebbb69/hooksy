// client/src/components/Navbar.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [logoLoaded, setLogoLoaded] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        checkIfAdmin(session.user)
      }
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user || null)
    if (session?.user) {
      checkIfAdmin(session.user)
    }
  }

  const checkIfAdmin = async (user) => {
    if (user?.user_metadata?.role === 'admin') {
      setIsAdmin(true)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-lg border-b-2 border-purple-200">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo with Loading State */}
          <Link to="/dashboard" className="flex items-center">
            {!logoLoaded && (
              <div className="w-48 h-12 bg-purple-100 animate-pulse rounded"></div>
            )}
            <img 
              src="/hooksy-logo.png" 
              alt="Hooksy Logo" 
              className={`w-48 h-auto transition-opacity duration-300 ${logoLoaded ? 'opacity-100' : 'opacity-0 absolute'}`}
              onLoad={() => setLogoLoaded(true)}
              onError={() => setLogoLoaded(true)}
            />
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <Link
              to="/dashboard"
              className="text-lg font-semibold text-purple-700 hover:text-purple-900 transition-colors relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              to="/patterns"
              className="text-lg font-semibold text-purple-700 hover:text-purple-900 transition-colors relative group"
            >
              Patterns
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              to="/chatbot"
              className="text-lg font-semibold text-purple-700 hover:text-purple-900 transition-colors relative group"
            >
              Chatbot
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span>
            </Link>

            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-lg font-semibold text-purple-700 hover:text-purple-900 transition-colors relative group"
                  >
                    Admin
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold text-base rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-lg font-semibold text-purple-700 hover:text-purple-900 transition-colors relative group"
                >
                  Login
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span>
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold text-base rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
