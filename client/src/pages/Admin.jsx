// client/src/pages/Admin.jsx
import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import { supabase } from '../utils/supabaseClient'

export default function Admin() {
  const [patternData, setPatternData] = useState({
    pattern_id: '',
    name: '',
    difficulty: 'Beginner',
    description: '',
    image: '🧶',
    color: 'from-purple-100 to-purple-50',
    border_color: 'border-purple-300',
    instructions: ''
  })

  const [patterns, setPatterns] = useState([])
  const [message, setMessage] = useState('')
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    fetchPatterns()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    console.log('User metadata:', user?.user_metadata)
    
    if (user && user.user_metadata?.role === 'admin') {
      setIsAuthorized(true)
    } else {
      setIsAuthorized(false)
    }
    
    setLoading(false)
  }

  const fetchPatterns = async () => {
    const { data, error } = await supabase
      .from('featured_patterns')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setPatterns(data)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setMessage('❌ Please log in to add patterns')
        return
      }

      const { error } = await supabase
        .from('featured_patterns')
        .insert({
          pattern_id: patternData.pattern_id,
          name: patternData.name,
          difficulty: patternData.difficulty,
          description: patternData.description,
          image: patternData.image,
          color: patternData.color,
          border_color: patternData.border_color,
          instructions: patternData.instructions,
          is_active: true
        })

      if (error) throw error

      setMessage('✅ Pattern added successfully!')
      setPatternData({
        pattern_id: '',
        name: '',
        difficulty: 'Beginner',
        description: '',
        image: '🧶',
        color: 'from-purple-100 to-purple-50',
        border_color: 'border-purple-300',
        instructions: ''
      })
      
      fetchPatterns()
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this pattern?')) return

    try {
      const { error } = await supabase
        .from('featured_patterns')
        .delete()
        .eq('id', id)

      if (error) throw error

      setMessage('✅ Pattern deleted successfully!')
      fetchPatterns()
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`)
    }
  }

  const toggleActive = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('featured_patterns')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error

      setMessage('✅ Pattern status updated!')
      fetchPatterns()
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-2xl text-purple-600">Loading...</div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
          <Navbar />
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="text-center">
              <div className="text-6xl mb-6">🔒</div>
              <h1 className="text-4xl font-bold text-purple-900 mb-4">Access Denied</h1>
              <p className="text-purple-600 mb-6">You don't have permission to access this page.</p>
              <p className="text-sm text-purple-500">Only administrators can view this page.</p>
            </div>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <Navbar />
        
        <main className="mx-auto max-w-7xl px-6 py-8">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-purple-600 font-medium mb-8">
            Manage featured crochet patterns
          </p>

          {message && (
            <div className="bg-purple-50 border-2 border-purple-300 text-purple-800 px-6 py-4 rounded-xl mb-6">
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add Pattern Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-purple-200">
              <h2 className="text-2xl font-bold text-purple-900 mb-6">Add New Pattern</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-purple-900 font-semibold mb-2 text-sm">Pattern ID *</label>
                  <input
                    type="text"
                    value={patternData.pattern_id}
                    onChange={(e) => setPatternData(prev => ({ ...prev, pattern_id: e.target.value }))}
                    placeholder="e.g., summer-hat"
                    className="w-full rounded-xl border-2 border-purple-200/50 bg-purple-50/30 px-4 py-2.5 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                  <p className="text-xs text-purple-600 mt-1">Use lowercase with hyphens (e.g., "my-pattern")</p>
                </div>

                <div>
                  <label className="block text-purple-900 font-semibold mb-2 text-sm">Pattern Name *</label>
                  <input
                    type="text"
                    value={patternData.name}
                    onChange={(e) => setPatternData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Summer Hat"
                    className="w-full rounded-xl border-2 border-purple-200/50 bg-purple-50/30 px-4 py-2.5 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-purple-900 font-semibold mb-2 text-sm">Difficulty</label>
                  <select
                    value={patternData.difficulty}
                    onChange={(e) => setPatternData(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full rounded-xl border-2 border-purple-200/50 bg-purple-50/30 px-4 py-2.5 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-purple-900 font-semibold mb-2 text-sm">Description *</label>
                  <textarea
                    value={patternData.description}
                    onChange={(e) => setPatternData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the pattern"
                    rows="3"
                    className="w-full rounded-xl border-2 border-purple-200/50 bg-purple-50/30 px-4 py-2.5 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-purple-900 font-semibold mb-2 text-sm">Emoji</label>
                  <input
                    type="text"
                    value={patternData.image}
                    onChange={(e) => setPatternData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="🧶"
                    className="w-full rounded-xl border-2 border-purple-200/50 bg-purple-50/30 px-4 py-2.5 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-purple-900 font-semibold mb-2 text-sm">Color</label>
                    <select
                      value={patternData.color}
                      onChange={(e) => setPatternData(prev => ({ ...prev, color: e.target.value }))}
                      className="w-full rounded-xl border-2 border-purple-200/50 bg-purple-50/30 px-4 py-2.5 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="from-purple-100 to-purple-50">Purple</option>
                      <option value="from-blue-100 to-blue-50">Blue</option>
                      <option value="from-pink-100 to-pink-50">Pink</option>
                      <option value="from-orange-100 to-orange-50">Orange</option>
                      <option value="from-green-100 to-green-50">Green</option>
                      <option value="from-yellow-100 to-yellow-50">Yellow</option>
                      <option value="from-red-100 to-red-50">Red</option>
                      <option value="from-teal-100 to-teal-50">Teal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-purple-900 font-semibold mb-2 text-sm">Border</label>
                    <select
                      value={patternData.border_color}
                      onChange={(e) => setPatternData(prev => ({ ...prev, border_color: e.target.value }))}
                      className="w-full rounded-xl border-2 border-purple-200/50 bg-purple-50/30 px-4 py-2.5 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="border-purple-300">Purple</option>
                      <option value="border-blue-300">Blue</option>
                      <option value="border-pink-300">Pink</option>
                      <option value="border-orange-300">Orange</option>
                      <option value="border-green-300">Green</option>
                      <option value="border-yellow-300">Yellow</option>
                      <option value="border-red-300">Red</option>
                      <option value="border-teal-300">Teal</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-purple-900 font-semibold mb-2 text-sm">Instructions * (Markdown format)</label>
                  <textarea
                    value={patternData.instructions}
                    onChange={(e) => setPatternData(prev => ({ ...prev, instructions: e.target.value }))}
                    placeholder="# Pattern Name

## Materials
- Item 1
- Item 2

## Instructions
Step by step instructions here..."
                    rows="12"
                    className="w-full rounded-xl border-2 border-purple-200/50 bg-purple-50/30 px-4 py-2.5 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono text-sm resize-none"
                    required
                  />
                  <p className="text-xs text-purple-600 mt-1">Use # for titles, ## for sections, - for lists</p>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:from-purple-600 hover:to-purple-700"
                >
                  Add Pattern
                </button>
              </form>
            </div>

            {/* Existing Patterns */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-purple-200">
              <h2 className="text-2xl font-bold text-purple-900 mb-6">Existing Patterns ({patterns.length})</h2>
              
              <div className="space-y-4 max-h-[800px] overflow-y-auto">
                {patterns.length === 0 ? (
                  <p className="text-purple-600 text-center py-8">No patterns yet. Add your first one!</p>
                ) : (
                  patterns.map((pattern) => (
                    <div
                      key={pattern.id}
                      className={`border-2 ${pattern.is_active ? 'border-purple-200 bg-purple-50/30' : 'border-gray-200 bg-gray-50'} rounded-xl p-5`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{pattern.image}</span>
                          <div>
                            <h3 className="font-bold text-purple-900">{pattern.name}</h3>
                            <p className="text-xs text-purple-600 uppercase">{pattern.difficulty}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleActive(pattern.id, pattern.is_active)}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                              pattern.is_active 
                                ? 'bg-green-100 text-green-700 border border-green-300' 
                                : 'bg-gray-100 text-gray-600 border border-gray-300'
                            }`}
                          >
                            {pattern.is_active ? '✓ Active' : '○ Hidden'}
                          </button>
                          <button
                            onClick={() => handleDelete(pattern.id)}
                            className="px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 border border-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-purple-800 line-clamp-2">{pattern.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}
