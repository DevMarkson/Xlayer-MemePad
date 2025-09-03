'use client'

import { useEffect, useState } from 'react'
import { X, Wallet, ExternalLink, CheckCircle } from 'lucide-react'

// Add wallet providers to window object for TypeScript
declare global {
  interface Window {
    ethereum?: any
    okxwallet?: any
  }
}

interface ConnectWalletProps {
  isOpen: boolean
  onClose: () => void
  onWalletConnect: (walletInfo: {
    type: string;
    address: string;
    isConnected: boolean;
  }) => void
  currentWalletState: {
    type: string;
    address: string;
    isConnected: boolean;
  } | null
}

const wallets = [
  {
    id: 'metamask',
    name: 'MetaMask',
    description: 'Connect using MetaMask wallet',
    icon: '🦊',
    url: 'https://metamask.io/',
    recommended: true
  },
  {
    id: 'okx',
    name: 'OKX Wallet',
    description: 'Connect using OKX Wallet',
    icon: '🔗',
    url: 'https://www.okx.com/web3',
    recommended: true
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    description: 'Connect using WalletConnect',
    icon: '🔌',
    url: 'https://walletconnect.com/'
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    description: 'Connect using Coinbase Wallet',
    icon: '🪙',
    url: 'https://www.coinbase.com/wallet'
  }
]

export default function ConnectWallet({ isOpen, onClose, onWalletConnect, currentWalletState }: ConnectWalletProps) {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState<{
    type: string;
    address: string;
    isConnected: boolean;
  } | null>(null)

  // Reset states when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedWallet(null)
      setIsConnecting(false)
      setConnectedWallet(null)
    }
  }, [isOpen])

  // Animate on mount
  useEffect(() => {
    if (isOpen) {
      const id = requestAnimationFrame(() => setIsVisible(true))
      return () => cancelAnimationFrame(id)
    }
    setIsVisible(false)
  }, [isOpen])

  const handleWalletSelect = async (walletId: string) => {
    setSelectedWallet(walletId)
    setIsConnecting(true)
    
    try {
      if (walletId === 'metamask') {
        // Check if MetaMask is installed
        if (typeof window.ethereum === 'undefined') {
          alert('MetaMask is not installed! Please install MetaMask first.')
          setIsConnecting(false)
          return
        }

        // Check if it's actually MetaMask (not OKX or other wallet)
        if (!window.ethereum.isMetaMask) {
          alert('Please switch to MetaMask wallet in your browser. OKX or other wallets are not MetaMask.')
          setIsConnecting(false)
          return
        }

        // Request account access
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        })
        
        if (accounts.length > 0) {
          const walletInfo = {
            type: 'MetaMask',
            address: accounts[0],
            isConnected: true
          }
          setConnectedWallet(walletInfo)
          onWalletConnect(walletInfo)
          alert(`Connected to MetaMask! Account: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`)
          onClose()
        }
      } else if (walletId === 'okx') {
        // Check if OKX wallet is available
        if (typeof window.okxwallet !== 'undefined') {
          try {
            const accounts = await window.okxwallet.request({ 
              method: 'eth_requestAccounts' 
            })
            if (accounts.length > 0) {
              const walletInfo = {
                type: 'OKX Wallet',
                address: accounts[0],
                isConnected: true
              }
              setConnectedWallet(walletInfo)
              onWalletConnect(walletInfo)
              alert(`Connected to OKX Wallet! Account: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`)
              onClose()
            }
          } catch (error) {
            alert('Failed to connect to OKX Wallet. Please try again.')
          }
        } else {
          alert('OKX Wallet is not installed! Please install OKX Wallet extension first.')
        }
      } else if (walletId === 'walletconnect') {
        // WalletConnect implementation
        alert('WalletConnect integration will be added with wagmi/rainbowkit')
      } else if (walletId === 'coinbase') {
        // Coinbase Wallet implementation
        if (typeof window.ethereum !== 'undefined' && window.ethereum.isCoinbaseWallet) {
          try {
            const accounts = await window.ethereum.request({ 
              method: 'eth_requestAccounts' 
            })
            if (accounts.length > 0) {
              const walletInfo = {
                type: 'Coinbase Wallet',
                address: accounts[0],
                isConnected: true
              }
              setConnectedWallet(walletInfo)
              onWalletConnect(walletInfo)
              alert(`Connected to Coinbase Wallet! Account: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`)
              onClose()
            }
          } catch (error) {
            alert('Failed to connect to Coinbase Wallet. Please try again.')
          }
        } else {
          alert('Coinbase Wallet is not installed! Please install Coinbase Wallet extension first.')
        }
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
      alert('Failed to connect wallet. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div
        className={
          `relative w-full max-w-md mx-4 rounded-2xl border border-white/10 ` +
          `bg-slate-900 shadow-2xl p-6 ` +
          `transform transition-all duration-500 ease-out ` +
          (isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95')
        }
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            Connect Wallet
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200"
            aria-label="Close wallet connection modal"
            title="Close"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Show current wallet info if connected */}
        {currentWalletState?.isConnected && (
          <div className="mb-6 p-4 bg-success-500/10 border border-success-500/20 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-success-400 font-medium">{currentWalletState.type}</p>
                <p className="text-white/70 text-sm">
                  {currentWalletState.address.slice(0, 6)}...{currentWalletState.address.slice(-4)}
                </p>
              </div>
              <button
                onClick={() => {
                  onWalletConnect({ ...currentWalletState, isConnected: false })
                  onClose()
                }}
                className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}

        {/* Wallet List - Always show when modal opens */}
        <div className="space-y-3 mb-6">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  selectedWallet === wallet.id
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
                onClick={() => handleWalletSelect(wallet.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{wallet.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-white">{wallet.name}</h4>
                      {wallet.recommended && (
                        <span className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/60">{wallet.description}</p>
                  </div>
                  {selectedWallet === wallet.id && isConnecting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : selectedWallet === wallet.id ? (
                    <CheckCircle className="w-5 h-5 text-success-400" />
                  ) : (
                    <ExternalLink className="w-5 h-5 text-white/40" />
                  )}
                </div>
              </div>
            ))}
          </div>

        {/* Network Info */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h4 className="font-medium text-white mb-3 flex items-center space-x-2">
            <Wallet className="w-4 h-4" />
            <span>Network Requirements</span>
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Network:</span>
              <span className="text-white">X Layer (L2)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Chain ID:</span>
              <span className="text-white">195 (Testnet) / 196 (Mainnet)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Currency:</span>
              <span className="text-white">OKB</span>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-4 text-center">
          <p className="text-sm text-white/60">
            Don't have a wallet?{' '}
            <a 
              href="https://metamask.io/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 underline"
            >
              Learn how to get one
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
