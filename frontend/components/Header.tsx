'use client'

import { useState } from 'react'
import { Menu, X, Wallet, ChevronDown } from 'lucide-react'
import ConnectWallet from './ConnectWallet'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isWalletOpen, setIsWalletOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Documentation', href: '#docs' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold gradient-text">Meme Launchpad</h1>
                  <p className="text-xs text-white/60">X Layer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-white/70 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsWalletOpen(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Wallet className="w-5 h-5" />
              <span>Connect Wallet</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/10 backdrop-blur-xl border-t border-white/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-white/70 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Wallet Connection Modal */}
      <ConnectWallet isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
    </header>
  )
}
