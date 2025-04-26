import React, { useState, useEffect } from 'react'
import { Home, Settings } from 'lucide-react'
import ISBNScanner from './ISBNScanner'
import './App.css'

// Pages
const HomePage = () => (
  <div className="flex flex-col items-center justify-center p-6">
    <h1 className="text-2xl font-bold mb-4">Home Page</h1>
    <p className="text-center">
      Welcome to BookNest! Dein persönliches Bücher-Nest als Progressive Web App.
    </p>
  </div>
)

const SettingsPage = () => (
  <div className="flex flex-col items-center justify-center p-6">
    <h1 className="text-2xl font-bold mb-4">Settings Page</h1>
    <div className="w-full max-w-md">
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Appearance</h2>
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="h-4 w-4" />
          <span>Dark Mode</span>
        </label>
      </div>
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Notifications</h2>
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="h-4 w-4" defaultChecked />
          <span>Enable Push Notifications</span>
        </label>
      </div>
      <div className="p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">About</h2>
        <p>Version 1.0.0</p>
      </div>
    </div>
  </div>
)

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isMobile, setIsMobile] = useState(false)
  const [scannerOpen, setScannerOpen] = useState(false)
  const [isbn, setIsbn] = useState('')

  // Mobile check
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768)
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // Page renderer
  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />
      case 'settings': return <SettingsPage />
      default: return <HomePage />
    }
  }

  // Top navigation
  const WebNavigation = () => (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 font-bold text-xl">🐦 BookNest</div>
          <nav className="flex space-x-4">
            <button
              onClick={() => setCurrentPage('home')}
              className={`px-3 py-2 rounded flex items-center ${currentPage === 'home' ? 'text-blue-600' : 'hover:bg-gray-100'}`}
            >
              <Home className="mr-2 h-5 w-5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => setCurrentPage('settings')}
              className={`px-3 py-2 rounded flex items-center ${currentPage === 'settings' ? 'text-blue-600' : 'hover:bg-gray-100'}`}
            >
              <Settings className="mr-2 h-5 w-5" />
              <span>Settings</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  )

  // Bottom navigation on mobile
  const MobileNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md">
      <div className="flex justify-around">
        <button
          onClick={() => setCurrentPage('home')}
          className={`flex flex-col items-center py-3 px-6 ${currentPage === 'home' ? 'text-blue-600' : ''}`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button
          onClick={() => setCurrentPage('settings')}
          className={`flex flex-col items-center py-3 px-6 ${currentPage === 'settings' ? 'text-blue-600' : ''}`}
        >
          <Settings className="h-6 w-6" />
          <span className="text-xs mt-1">Settings</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="App min-h-screen bg-gray-50">
      {/* Scanner Button & Result */}
      <div className="p-6">
        <button
          onClick={() => setScannerOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
        >
          📷 Buch scannen
        </button>
        {isbn && (
          <p className="mt-4">
            Gescannte ISBN: <span className="font-mono">{isbn}</span>
          </p>
        )}
      </div>

      {/* Scanner Overlay */}
      {scannerOpen && (
        <ISBNScanner
          onDetected={code => {
            setIsbn(code)
            setScannerOpen(false)
          }}
          onClose={() => setScannerOpen(false)}
        />
      )}

      {/* Navigation & Pages */}
      {isMobile ? null : <WebNavigation />}
      <div className={`${isMobile ? 'pt-4 pb-20' : 'pt-20 pb-4'}`}>{renderPage()}</div>
      {isMobile && <MobileNavigation />}
    </div>
  )
}
