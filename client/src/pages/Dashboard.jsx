// client/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import { supabase } from '../utils/supabaseClient'

export default function Dashboard() {
  const navigate = useNavigate()
  const [mainCount, setMainCount] = useState(0)
  const [mainCounterId, setMainCounterId] = useState(null)
  const [counters, setCounters] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCounterName, setNewCounterName] = useState('')
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)
  const [error, setError] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Load counters on mount
  useEffect(() => {
    loadCounters()
  }, [])

  const loadCounters = async () => {
    try {
      // Check if user is logged in (but don't require it)
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session && session.user) {
        setIsLoggedIn(true)
        setUserId(session.user.id)

        // Fetch user's counters
        const { data, error } = await supabase
          .from('user_counters')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: true })

        if (error) throw error

        // Separate main counter from custom counters
        const mainCounter = data.find(c => c.is_main)
        const customCounters = data.filter(c => !c.is_main)

        if (mainCounter) {
          setMainCount(mainCounter.value)
          setMainCounterId(mainCounter.id)
        } else {
          // Create main counter if it doesn't exist
          const { data: newMain, error: createError } = await supabase
            .from('user_counters')
            .insert({
              user_id: session.user.id,
              name: 'Main Counter',
              value: 0,
              is_main: true
            })
            .select()
            .single()

          if (!createError && newMain) {
            setMainCounterId(newMain.id)
          }
        }

        setCounters(customCounters.map(c => ({
          id: c.id,
          name: c.name,
          value: c.value,
          isEditing: false,
          menuOpen: false
        })))
      } else {
        // Not logged in - that's okay, just show empty state
        setIsLoggedIn(false)
      }

    } catch (err) {
      console.error('Error loading counters:', err)
      // Don't show error for not being logged in
      if (!err.message.includes('Auth')) {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  // Update main counter in database (or just in memory if not logged in)
  const updateMainCount = async (newValue) => {
    setMainCount(newValue)
    
    if (!isLoggedIn || !userId || !mainCounterId) return

    try {
      await supabase
        .from('user_counters')
        .update({ value: newValue, updated_at: new Date().toISOString() })
        .eq('id', mainCounterId)
    } catch (err) {
      console.error('Error updating main counter:', err)
    }
  }

  const handleAddCounterClick = () => {
    if (!isLoggedIn) {
      // Show login prompt
      if (confirm('You need to login to save custom counters. Would you like to login now?')) {
        navigate('/login')
      }
      return
    }
    setShowAddModal(true)
  }

  const handleAddCounter = async () => {
    if (!newCounterName.trim()) {
      setError('Please enter a counter name')
      return
    }
    
    if (!isLoggedIn || !userId) {
      setError('Please log in to add counters')
      return
    }

    try {
      const { data, error } = await supabase
        .from('user_counters')
        .insert({
          user_id: userId,
          name: newCounterName.trim(),
          value: 0,
          is_main: false
        })
        .select()
        .single()

      if (error) throw error

      setCounters((prev) => [
        ...prev,
        { 
          id: data.id, 
          name: data.name, 
          value: data.value, 
          isEditing: false, 
          menuOpen: false 
        },
      ])
      setNewCounterName('')
      setShowAddModal(false)
      setError(null)
    } catch (err) {
      console.error('Error adding counter:', err)
      setError('Failed to add counter. Please try again.')
    }
  }

  const handleRemoveCounter = async (id) => {
    if (!confirm('Are you sure you want to delete this counter?')) return

    try {
      const { error } = await supabase
        .from('user_counters')
        .delete()
        .eq('id', id)

      if (error) throw error

      setCounters((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      console.error('Error removing counter:', err)
      setError('Failed to delete counter')
    }
  }

  const handleResetCounter = async (id) => {
    try {
      const { error } = await supabase
        .from('user_counters')
        .update({ value: 0, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      setCounters((prev) =>
        prev.map((c) => (c.id === id ? { ...c, value: 0, menuOpen: false } : c)),
      )
    } catch (err) {
      console.error('Error resetting counter:', err)
      setError('Failed to reset counter')
    }
  }

  const toggleMenu = (id) => {
    setCounters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, menuOpen: !c.menuOpen } : { ...c, menuOpen: false })),
    )
  }

  const toggleEdit = (id) => {
    setCounters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isEditing: !c.isEditing, menuOpen: false } : c)),
    )
  }

  const handleRenameCounter = async (id, name) => {
    setCounters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name } : c)),
    )

    try {
      await supabase
        .from('user_counters')
        .update({ name, updated_at: new Date().toISOString() })
        .eq('id', id)
    } catch (err) {
      console.error('Error renaming counter:', err)
    }
  }

  const handleChangeValue = async (id, delta) => {
    const counter = counters.find(c => c.id === id)
    if (!counter) return

    const newValue = Math.max(0, counter.value + delta)

    setCounters((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, value: newValue } : c,
      ),
    )

    try {
      await supabase
        .from('user_counters')
        .update({ value: newValue, updated_at: new Date().toISOString() })
        .eq('id', id)
    } catch (err) {
      console.error('Error updating counter:', err)
    }
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-[#F0E7F2] via-white to-[#E6E6FA]">
          <Navbar />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <div className="text-xl text-slate-600">Loading...</div>
            </div>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-[#F0E7F2] via-white to-[#E6E6FA]">
        <Navbar />

        <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8 sm:px-8 sm:py-10">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-300 text-red-700 px-6 py-4 rounded-xl flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-900 font-bold text-xl hover:scale-110 transition-transform">×</button>
            </div>
          )}

          {/* Login Prompt Banner (only if not logged in) */}
          {!isLoggedIn && (
            <div className="bg-purple-50 border-2 border-purple-300 text-purple-900 px-6 py-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold">💡 Tip:</span> Login to save your counters and sync across devices!
              </div>
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold text-sm rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all"
              >
                Login
              </button>
            </div>
          )}

          {/* Page heading */}
          <section className="relative">
            <div className="absolute -top-4 -left-4 h-20 w-20 rounded-full bg-[#E6E6FA]/30 blur-2xl"></div>
            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-[#D3D3FF]/30 blur-2xl"></div>
            <div className="relative">
              <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                Row Counter
              </h1>
              <p className="mt-2 text-base text-slate-600">
                Keep track of your crochet rows and patterns with ease
              </p>
            </div>
          </section>

          {/* Main counter */}
          <section className="relative overflow-hidden rounded-3xl border-2 border-[#E6E6FA] bg-gradient-to-br from-white to-[#F0E7F2]/30 p-6 shadow-xl sm:p-8">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-[#C9A8F1]/10 blur-3xl"></div>
            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#E6E6FA]/40 px-3 py-1">
                <span className="text-xs font-bold uppercase tracking-widest text-[#9d72b3]">
                  ★ Global Counter
                </span>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Quick Row Counter
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Track your current row progress
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => updateMainCount(Math.max(0, mainCount - 1))}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#E6E6FA] bg-white text-lg font-bold text-slate-700 shadow-sm hover:bg-[#F0E7F2] hover:scale-105 active:scale-95 transition-all"
                  >
                    −
                  </button>
                  <span className="min-w-[4rem] text-center text-4xl font-bold text-slate-900">
                    {mainCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateMainCount(mainCount + 1)}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#C9A8F1] bg-gradient-to-br from-[#E6E6FA] to-[#D3D3FF] text-lg font-bold text-slate-800 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => updateMainCount(0)}
                    className="ml-2 inline-flex h-12 items-center justify-center rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100 px-4 text-sm font-bold text-red-700 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Custom counters */}
          <section className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold uppercase tracking-wider text-slate-700">
                Your Counters
              </h2>
              <button
                type="button"
                onClick={handleAddCounterClick}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#E6E6FA] to-[#C9A8F1] px-4 py-2 text-sm font-bold text-slate-800 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <span className="text-lg">+</span>
                Add Counter
              </button>
            </div>

            {counters.length === 0 && (
              <div className="rounded-2xl border-2 border-dashed border-[#E6E6FA] bg-white/50 p-8 text-center">
                <p className="text-slate-500">
                  {isLoggedIn 
                    ? 'No extra counters yet. Click "Add Counter" to create one!' 
                    : 'Login to create and save custom counters!'}
                </p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {counters.map((counter) => (
                <div
                  key={counter.id}
                  className="relative flex flex-col justify-between rounded-2xl border-2 border-[#E6E6FA] bg-white p-5 shadow-md hover:shadow-lg transition-shadow"
                >
                  {/* Header with 3-dot menu */}
                  <div className="mb-3 flex items-center justify-between gap-2">
                    {counter.isEditing ? (
                      <input
                        type="text"
                        value={counter.name}
                        onChange={(e) =>
                          handleRenameCounter(counter.id, e.target.value)
                        }
                        onBlur={() => toggleEdit(counter.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') toggleEdit(counter.id)
                        }}
                        className="flex-1 rounded-lg border-2 border-[#C9A8F1] bg-[#F0E7F2]/30 px-3 py-1 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C9A8F1]"
                        autoFocus
                      />
                    ) : (
                      <h3 className="flex-1 text-base font-semibold text-slate-800">
                        {counter.name}
                      </h3>
                    )}
                    
                    {/* Three-dot menu button */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => toggleMenu(counter.id)}
                        className="rounded-lg p-2 text-slate-600 hover:bg-[#E6E6FA]/40 transition-colors"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                      </button>

                      {/* Dropdown menu */}
                      {counter.menuOpen && (
                        <div className="absolute right-0 top-10 z-10 w-32 rounded-lg border border-[#E6E6FA] bg-white shadow-lg">
                          <button
                            type="button"
                            onClick={() => handleResetCounter(counter.id)}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-[#F0E7F2] transition-colors rounded-t-lg"
                          >
                            <span>🔄</span>
                            Reset
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleEdit(counter.id)}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-[#F0E7F2] transition-colors"
                          >
                            <span>✏️</span>
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveCounter(counter.id)}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-lg"
                          >
                            <span>🗑️</span>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Counter controls */}
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleChangeValue(counter.id, -1)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-[#E6E6FA] bg-white text-base font-bold text-slate-700 hover:bg-[#F0E7F2] hover:scale-105 active:scale-95 transition-all"
                    >
                      −
                    </button>
                    <span className="min-w-[3rem] text-center text-2xl font-bold text-slate-900">
                      {counter.value}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleChangeValue(counter.id, 1)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-[#C9A8F1] bg-gradient-to-br from-[#E6E6FA] to-[#D3D3FF] text-base font-bold text-slate-800 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Add Counter Modal */}
        {showAddModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => {
              setShowAddModal(false)
              setNewCounterName('')
              setError(null)
            }}
          >
            <div
              className="w-full max-w-md rounded-2xl border-2 border-[#E6E6FA] bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                Add New Counter
              </h2>
              <p className="text-sm text-slate-600 mb-4">
                Enter a name for your new counter:
              </p>
              
              {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-3 py-2 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <input
                type="text"
                value={newCounterName}
                onChange={(e) => setNewCounterName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCounter()
                }}
                placeholder="e.g., Scarf Rows, Blanket Pattern"
                autoFocus
                className="w-full rounded-lg border-2 border-[#E6E6FA] bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C9A8F1] transition"
              />
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setNewCounterName('')
                    setError(null)
                  }}
                  className="rounded-lg border-2 border-[#E6E6FA] bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-[#F0E7F2] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCounter}
                  disabled={!newCounterName.trim()}
                  className="rounded-lg bg-gradient-to-r from-[#E6E6FA] to-[#C9A8F1] px-4 py-2 text-sm font-bold text-slate-800 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Add Counter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
