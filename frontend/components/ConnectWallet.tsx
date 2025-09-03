'use client'

import { useEffect, useState } from 'react'
import { X, Wallet, ExternalLink, CheckCircle } from 'lucide-react'

interface ConnectWalletProps {
  isOpen: boolean
  onClose: () => void
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

export default function ConnectWallet({ isOpen, onClose }: ConnectWalletProps) {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const handleWalletSelect = async (walletId: string) => {
    setSelectedWallet(walletId)
    setIsConnecting(true)
    
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnecting(false)
      alert(`Wallet connection will be integrated with wagmi/rainbowkit!`)
      onClose()
    }, 2000)
  }

  // Animate on mount
  useEffect(() => {
    if (isOpen) {
      const id = requestAnimationFrame(() => setIsVisible(true))
      return () => cancelAnimationFrame(id)
    }
    setIsVisible(false)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
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
          `transform transition-all duration-300 ease-out ` +
          (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4')
        }
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Connect Wallet</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200"
            aria-label="Close wallet connection modal"
            title="Close"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Wallet List */}
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
