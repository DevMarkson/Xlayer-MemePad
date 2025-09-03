'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, Coins, Users, Calendar, ArrowUpRight } from 'lucide-react'

// Mock data for demonstration
const mockTokens = [
  {
    id: 1,
    name: 'DogeMoon',
    symbol: 'DOGE',
    creator: '0x1234...5678',
    creationTime: '2 hours ago',
    currentPrice: '0.00015',
    priceChange: '+12.5%',
    totalSold: '1,250,000',
    maxSupply: '1,000,000,000',
    isPriceUp: true,
    bondingCurveAddress: '0xabcd...efgh'
  },
  {
    id: 2,
    name: 'PepeCoin',
    symbol: 'PEPE',
    creator: '0x8765...4321',
    creationTime: '5 hours ago',
    currentPrice: '0.00018',
    priceChange: '+8.3%',
    totalSold: '890,000',
    maxSupply: '1,000,000,000',
    isPriceUp: true,
    bondingCurveAddress: '0xdcba...hgfe'
  },
  {
    id: 3,
    name: 'ShibaInu',
    symbol: 'SHIB',
    creator: '0x9999...8888',
    creationTime: '1 day ago',
    currentPrice: '0.00012',
    priceChange: '-3.2%',
    totalSold: '2,100,000',
    maxSupply: '1,000,000,000',
    isPriceUp: false,
    bondingCurveAddress: '0x1111...2222'
  }
]

export default function TokenList() {
  const [selectedToken, setSelectedToken] = useState<typeof mockTokens[0] | null>(null)
  const [tradeAmount, setTradeAmount] = useState('')
  const [isTrading, setIsTrading] = useState(false)

  const handleTrade = async (action: 'buy' | 'sell') => {
    if (!selectedToken || !tradeAmount) return
    
    setIsTrading(true)
    
    // Simulate trading process
    setTimeout(() => {
      setIsTrading(false)
      alert(`${action === 'buy' ? 'Buy' : 'Sell'} order will be integrated with smart contracts!`)
    }, 2000)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Trade Meme Tokens</h3>
        <p className="text-white/70">Buy and sell tokens through bonding curve mechanics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Token List */}
        <div className="lg:col-span-2">
          <div className="card">
            <h4 className="text-lg font-semibold text-white mb-4">Available Tokens</h4>
            <div className="space-y-4">
              {mockTokens.map((token) => (
                <div
                  key={token.id}
                  onClick={() => setSelectedToken(token)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    selectedToken?.id === token.id
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                        <span className="text-xl">🚀</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-white">{token.name}</h5>
                        <p className="text-sm text-white/60">{token.symbol}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg font-bold text-white">{token.currentPrice} OKB</span>
                        <div className={`flex items-center text-sm ${
                          token.isPriceUp ? 'text-success-400' : 'text-error-400'
                        }`}>
                          {token.isPriceUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span>{token.priceChange}</span>
                        </div>
                      </div>
                      <p className="text-sm text-white/60">Created {token.creationTime}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-white/60">Total Sold</p>
                      <p className="text-white font-medium">{token.totalSold}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Max Supply</p>
                      <p className="text-white font-medium">{token.maxSupply}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Creator</p>
                      <p className="text-white font-medium font-mono">{token.creator}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trading Panel */}
        <div className="lg:col-span-1">
          <div className="card">
            <h4 className="text-lg font-semibold text-white mb-4">Trading Panel</h4>
            
            {selectedToken ? (
              <div className="space-y-6">
                {/* Token Info */}
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                      <span className="text-lg">🚀</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-white">{selectedToken.name}</h5>
                      <p className="text-sm text-white/60">{selectedToken.symbol}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Current Price:</span>
                      <span className="text-white font-medium">{selectedToken.currentPrice} OKB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Price Change:</span>
                      <span className={`font-medium ${selectedToken.isPriceUp ? 'text-success-400' : 'text-error-400'}`}>
                        {selectedToken.priceChange}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Total Sold:</span>
                      <span className="text-white font-medium">{selectedToken.totalSold}</span>
                    </div>
                  </div>
                </div>

                {/* Trade Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Amount to {selectedToken ? 'Buy' : 'Sell'}
                    </label>
                    <input
                      type="number"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="input-field w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleTrade('buy')}
                      disabled={isTrading || !tradeAmount}
                      className="btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isTrading ? 'Buying...' : 'Buy Tokens'}
                    </button>
                    <button
                      onClick={() => handleTrade('sell')}
                      disabled={isTrading || !tradeAmount}
                      className="btn-secondary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isTrading ? 'Selling...' : 'Sell Tokens'}
                    </button>
                  </div>
                </div>

                {/* Bonding Curve Info */}
                <div className="bg-white/5 rounded-xl p-4">
                  <h6 className="font-medium text-white mb-3 flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Bonding Curve</span>
                  </h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Initial Price:</span>
                      <span className="text-white">0.0001 OKB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Price Increment:</span>
                      <span className="text-white">0.00001 OKB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Formula:</span>
                      <span className="text-white font-mono text-xs">P = 0.0001 + (Sold × 0.00001)</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Coins className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/60">Select a token to start trading</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
