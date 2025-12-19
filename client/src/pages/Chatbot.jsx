// client/src/pages/Chatbot.jsx
import React, { useState, useRef, useEffect } from 'react'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'


export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m your crochet assistant! I can help you with:\n\n🧶 Generate custom crochet patterns\n📚 Explain stitches and techniques\n🎥 Find YouTube tutorials\n💡 Answer crochet questions\n\nWhat would you like to create today?'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [requestsToday, setRequestsToday] = useState(0)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const messagesEndRef = useRef(null)

  const MAX_DAILY_REQUESTS = 200 // Buffer from 250 free tier limit

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize request counter on mount
  useEffect(() => {
    checkAndResetDailyLimit()
  }, [])

  // Admin panel toggle: Press Ctrl + Shift + A
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        setShowAdminPanel(!showAdminPanel)
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showAdminPanel])

  const checkAndResetDailyLimit = () => {
    const lastResetDate = localStorage.getItem('chatbot_last_reset')
    const today = new Date().toDateString()
    
    if (lastResetDate !== today) {
      // Reset counter for new day
      localStorage.setItem('chatbot_requests_today', '0')
      localStorage.setItem('chatbot_last_reset', today)
      setRequestsToday(0)
    } else {
      // Load existing count
      const count = parseInt(localStorage.getItem('chatbot_requests_today') || '0')
      setRequestsToday(count)
    }
  }

  const incrementRequestCount = () => {
    const newCount = requestsToday + 1
    setRequestsToday(newCount)
    localStorage.setItem('chatbot_requests_today', newCount.toString())
  }

  // YouTube API Search Function
  const searchYouTube = async (query) => {
    if (!import.meta.env.VITE_YOUTUBE_API_KEY) {
      console.log('YouTube API key not configured')
      return []
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query + ' crochet tutorial')}&type=video&maxResults=3&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
      )
      
      if (!response.ok) {
        console.error('YouTube API error:', response.status)
        return []
      }

      const data = await response.json()
      return data.items || []
    } catch (error) {
      console.error('YouTube search error:', error)
      return []
    }
  }

  // Clean up markdown formatting from Gemini responses
  const cleanMarkdown = (text) => {
    return text
      .replace(/\*\*\*/g, '')  // Remove *** (bold+italic)
      .replace(/\*\*/g, '')    // Remove ** (bold)
      .replace(/\*/g, '')      // Remove * (italic/bullets)
      .replace(/###\s+/g, '')  // Remove ### headers
      .replace(/##\s+/g, '')   // Remove ## headers
      .replace(/#\s+/g, '')    // Remove # headers
      .trim()
  }

  // Format the message for better display
  const formatMessage = (text) => {
    const lines = text.split('\n')
    let formattedLines = []

    lines.forEach((line) => {
      const cleanLine = cleanMarkdown(line)
      
      // Skip empty lines
      if (!cleanLine.trim()) {
        formattedLines.push('')
        return
      }

      // Check for numbered lists
      if (line.match(/^\d+[\.)]\s+/)) {
        const number = line.match(/^\d+[\.)]/)[0]
        const content = cleanLine.substring(cleanLine.indexOf(number) + number.length).trim()
        formattedLines.push(`${number} ${content}`)
      }
      // Check for bullet points
      else if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
        const content = cleanLine.replace(/^[-•]\s*/, '').trim()
        formattedLines.push(`• ${content}`)
      }
      // Regular text
      else {
        formattedLines.push(cleanLine)
      }
    })

    return formattedLines.join('\n')
  }

  const handleSend = async () => {
    if (!input.trim()) return

    // Check daily limit before making request
    if (requestsToday >= MAX_DAILY_REQUESTS) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `⏰ Daily limit reached!\n\nPlease try again tomorrow!\n\n💡 The limit resets at midnight. This helps keep the service free for everyone.` 
      }])
      return
    }

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      // Check if user wants YouTube videos FIRST (before calling Gemini)
      const wantsVideos = userMessage.toLowerCase().match(/how (to|do i) (make|crochet|create)/i) || 
                         userMessage.toLowerCase().includes('tutorial') ||
                         userMessage.toLowerCase().includes('video') ||
                         userMessage.toLowerCase().includes('show me') ||
                         userMessage.toLowerCase().includes('pattern for') ||
                         userMessage.toLowerCase().includes('youtube') ||
                         userMessage.toLowerCase().includes('link') ||
                         userMessage.toLowerCase().includes('watch')

      let botResponse = ''

      // If user explicitly wants videos/links, search YouTube ONLY
      if (userMessage.toLowerCase().includes('youtube') || 
          userMessage.toLowerCase().includes('link') || 
          userMessage.toLowerCase().includes('video')) {
        
        const videos = await searchYouTube(userMessage)
        
        if (videos.length > 0) {
          botResponse = '🎥 Here are some great YouTube tutorials for you:\n'
          videos.forEach((video, idx) => {
            const title = video.snippet.title
            const videoId = video.id.videoId
            const channelName = video.snippet.channelTitle
            
            botResponse += `\n${idx + 1}. ${title}\n   By: ${channelName}\n   🔗 https://www.youtube.com/watch?v=${videoId}\n`
          })
          botResponse += '\n\nHappy crocheting! 🧶✨'
        } else {
          botResponse = '❌ Sorry, I couldn\'t find YouTube videos at the moment. Try searching directly on YouTube for "' + userMessage + '"'
        }

        setMessages(prev => [...prev, { role: 'assistant', content: botResponse }])
        incrementRequestCount()
        setLoading(false)
        return
      }

      // Otherwise, call Gemini for pattern/explanation
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a friendly and expert crochet assistant. A user asked: "${userMessage}"

If they're asking for a pattern or how to make something:
- Provide a clear, step-by-step crochet pattern
- Include materials needed
- Use proper crochet abbreviations (ch, sc, dc, etc.)
- Format it nicely with sections

If they're asking about techniques:
- Explain clearly with examples
- Be encouraging and helpful

Keep responses concise but complete. Use emojis occasionally to be friendly. DO NOT use markdown formatting like **, *, or # symbols - just use plain text with line breaks.`
              }]
            }]
          })
        }
      )

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'API request failed')
      }

      botResponse = data.candidates[0].content.parts[0].text

      // Clean up the response
      botResponse = formatMessage(botResponse)

      // Add YouTube videos at the end if appropriate
      if (wantsVideos) {
        const videos = await searchYouTube(userMessage)
        
        if (videos.length > 0) {
          botResponse += '\n\n🎥 Video Tutorials:\n'
          videos.forEach((video, idx) => {
            const title = video.snippet.title
            const videoId = video.id.videoId
            const channelName = video.snippet.channelTitle
            
            botResponse += `\n${idx + 1}. ${title}\n   By: ${channelName}\n   🔗 https://www.youtube.com/watch?v=${videoId}\n`
          })
        } else if (import.meta.env.VITE_YOUTUBE_API_KEY) {
          botResponse += '\n\n💡 Tip: Try searching YouTube directly for video tutorials!'
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: botResponse }])
      
      // Increment request counter after successful response
      incrementRequestCount()

    } catch (error) {
      console.error('Error:', error)
      
      // Better error messages
      let errorMessage = '❌ Oops! Something went wrong.'
      
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        errorMessage = '⏰ Rate limit reached!\n\n💡 Solutions:\n1. Wait a few minutes and try again\n2. You might be sending requests too quickly (10 per minute limit)\n3. Daily limit: 250 requests per day\n\nTry again in a moment!'
      } else if (error.message.includes('API key')) {
        errorMessage = '🔑 API key issue! Please check your Gemini API key configuration.'
      } else {
        errorMessage = `❌ Error: ${error.message}\n\nPlease try again or rephrase your question.`
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const suggestedPrompts = [
    '🧣 How do I make a simple scarf?',
    '🐙 Create an amigurumi octopus pattern',
    '🎀 What is a magic ring?',
    '🧶 Best yarn for beginners',
    '📏 Show me how to measure gauge'
  ]

  // Calculate remaining requests
  const remainingRequests = MAX_DAILY_REQUESTS - requestsToday
  const usagePercentage = (requestsToday / MAX_DAILY_REQUESTS) * 100

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <Navbar />

        {/* Admin Panel - Hidden by default, toggle with Ctrl+Shift+A */}
        {showAdminPanel && (
          <div className="fixed top-20 right-6 bg-purple-900 text-white px-5 py-3 rounded-xl shadow-2xl z-50 border-2 border-purple-700">
            <div className="font-bold text-lg mb-2">🔐 Admin Panel</div>
            <div className="space-y-1 text-sm">
              <div>Requests today: <span className="font-semibold">{requestsToday}</span></div>
              <div>Remaining: <span className="font-semibold">{remainingRequests}</span></div>
              <div>Limit: <span className="font-semibold">{MAX_DAILY_REQUESTS}</span></div>
              <div className="w-48 h-2 bg-purple-800 rounded-full overflow-hidden mt-2">
                <div 
                  className={`h-full transition-all ${
                    usagePercentage < 50 ? 'bg-green-400' : 
                    usagePercentage < 80 ? 'bg-yellow-400' : 
                    'bg-red-400'
                  }`}
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
            </div>
            <div className="text-xs mt-2 opacity-75 border-t border-purple-700 pt-2">
              Press <kbd className="bg-purple-800 px-1 rounded">Ctrl+Shift+A</kbd> to hide
            </div>
          </div>
        )}

        <main className="mx-auto max-w-5xl px-6 py-8 h-[calc(100vh-80px)] flex flex-col">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-bold text-purple-900">
                Crochet AI Assistant
              </h1>
            </div>
            <p className="text-purple-600 font-medium">
              Your personal crochet helper - patterns, tutorials, and tips! {import.meta.env.VITE_YOUTUBE_API_KEY ? '🎥' : ''}
            </p>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 bg-white rounded-2xl border-2 border-purple-200 shadow-lg overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                        : 'bg-purple-50 text-purple-900 border-2 border-purple-200'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {message.content.split('\n').map((line, i) => {
                        // Check if line contains a URL
                        const urlRegex = /(https?:\/\/[^\s]+)/g;
                        const parts = line.split(urlRegex);
                        
                        return (
                          <p key={i} className={i > 0 ? 'mt-2' : ''}>
                            {parts.map((part, j) => {
                              // If it's a URL, make it clickable
                              if (part.match(urlRegex)) {
                                return (
                                  <a
                                    key={j}
                                    href={part}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`underline hover:opacity-80 transition-opacity font-semibold ${
                                      message.role === 'user' ? 'text-white' : 'text-purple-600'
                                    }`}
                                  >
                                    {part}
                                  </a>
                                );
                              }
                              // Otherwise, render as plain text
                              return <span key={j}>{part}</span>;
                            })}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl px-5 py-3">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts (only show at start) */}
            {messages.length === 1 && (
              <div className="border-t-2 border-purple-100 p-4 bg-purple-50/50">
                <p className="text-sm font-semibold text-purple-900 mb-3">💡 Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(prompt.replace(/^[🧣🐙🎀🧶📏]\s/, ''))}
                      className="px-4 py-2 bg-white text-purple-700 rounded-lg text-sm font-medium border-2 border-purple-200 hover:bg-purple-100 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t-2 border-purple-200 p-4 bg-gradient-to-r from-purple-50 to-white">
              <div className="flex gap-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about crochet... (Press Enter to send)"
                  rows="2"
                  className="flex-1 rounded-xl border-2 border-purple-200 bg-white px-4 py-3 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                  disabled={loading || requestsToday >= MAX_DAILY_REQUESTS}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim() || requestsToday >= MAX_DAILY_REQUESTS}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-purple-700"
                >
                  {loading ? '...' : '✨ Send'}
                </button>
              </div>
              <div className="mt-2">
                <p className="text-xs text-purple-600">
                  💡 Tip: Ask "how to make [item]" or "show me [technique]" for video tutorials!
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}
