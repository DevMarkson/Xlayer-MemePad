'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Wallet, ChevronDown, LogOut } from 'lucide-react'
import ConnectWallet from './ConnectWallet'

// Add ethereum to window object for TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isWalletOpen, setIsWalletOpen] = useState(false)
  const [walletState, setWalletState] = useState<{
    type: string;
    address: string;
    isConnected: boolean;
  } | null>(null)

  const navigation = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Documentation', href: '#docs' },
  ]

  // Check wallet connection on mount
  useEffect(() => {
    checkWalletConnection()
  }, [])

  // Function to check if wallet is already connected
  const checkWalletConnection = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setWalletState({
            type: window.ethereum.isMetaMask ? 'MetaMask' : 'Other',
            address: accounts[0],
            isConnected: true
          })
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error)
    }
  }

  // Function to disconnect wallet
  const disconnectWallet = () => {
    setWalletState(null)
    setIsWalletOpen(false)
  }

  // Function to open wallet modal (always shows wallet selection)
  const openWalletModal = () => {
    setWalletState(null) // Reset wallet state to ensure fresh start
    setIsWalletOpen(true)
  }

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
            {walletState?.isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="px-4 py-2 bg-success-500/20 border border-success-500/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Wallet className="w-4 h-4 text-success-400" />
                    <span className="text-success-400 text-sm font-medium">Connected</span>
                    <span className="text-white/60 text-xs">
                      {walletState.address.slice(0, 6)}...{walletState.address.slice(-4)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                  title="Disconnect Wallet"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
                         ) : (
               <button
                 onClick={openWalletModal}
                 className="btn-primary flex items-center space-x-2"
               >
                 <Wallet className="w-5 h-5" />
                 <span>Connect Wallet</span>
               </button>
             )}

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
       <ConnectWallet 
         isOpen={isWalletOpen} 
         onClose={() => setIsWalletOpen(false)}
         onWalletConnect={(walletInfo) => {
           setWalletState(walletInfo)
           setIsWalletOpen(false)
         }}
         currentWalletState={walletState}
       />
    </header>
  )
}
