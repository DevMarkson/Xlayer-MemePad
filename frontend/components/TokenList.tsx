'use client'

import { useEffect, useMemo, useState } from 'react'
import { TrendingUp, TrendingDown, Coins } from 'lucide-react'
import { loadDemoTokens } from '../lib/storage'
import { DEMO_MODE, TOKEN_FACTORY_ADDRESS } from '../lib/constants'
import { getContract } from '../lib/web3'
import FactoryAbi from '../lib/abis/TokenFactory.json'
import CurveAbi from '../lib/abis/BondingCurve.json'

declare global {
  interface Window {
    ethereum?: any
  }
}

interface UiToken {
  id: number
  name: string
  symbol: string
  creator: string
  creationTime: string
  currentPrice: string
  priceChange: string
  totalSold: string
  maxSupply: string
  isPriceUp: boolean
  bondingCurveAddress: string
  curveContractAddress?: string // Full address for contract calls
  tokenAddress?: string // Full token address for factory calls
}

const seedMock: UiToken[] = [
  { id: 1, name: 'DogeMoon', symbol: 'DOGE', creator: '0x1234...5678', creationTime: '2 hours ago', currentPrice: '0.00015', priceChange: '+12.5%', totalSold: '1,250,000', maxSupply: '1,000,000,000', isPriceUp: true, bondingCurveAddress: '0xabcd...efgh' },
  { id: 2, name: 'PepeCoin', symbol: 'PEPE', creator: '0x8765...4321', creationTime: '5 hours ago', currentPrice: '0.00018', priceChange: '+8.3%', totalSold: '890,000', maxSupply: '1,000,000,000', isPriceUp: true, bondingCurveAddress: '0xdcba...hgfe' },
  { id: 3, name: 'ShibaInu', symbol: 'SHIB', creator: '0x9999...8888', creationTime: '1 day ago', currentPrice: '0.00012', priceChange: '-3.2%', totalSold: '2,100,000', maxSupply: '1,000,000,000', isPriceUp: false, bondingCurveAddress: '0x1111...2222' }
]

export default function TokenList() {
  const [tradeAmount, setTradeAmount] = useState('')
  const [isTrading, setIsTrading] = useState(false)
  const [selectedToken, setSelectedToken] = useState<UiToken | null>(null)
  const [onchainTokens, setOnchainTokens] = useState<UiToken[]>([])
  const [pricePreview, setPricePreview] = useState<{ buyPrice: string; sellPrice: string } | null>(null)
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false)

  // Load demo tokens
  const demoTokens = useMemo(() => loadDemoTokens(), [])

  // Calculate price preview when trade amount or selected token changes
  useEffect(() => {
    if (!selectedToken || !tradeAmount) {
      setPricePreview(null)
      return
    }

    const calculatePrice = async () => {
      setIsCalculatingPrice(true)
      try {
        const amount = parseFloat(tradeAmount)
        if (isNaN(amount) || amount <= 0) {
          setPricePreview(null)
          return
        }

        // For demo mode or when no curve contract, use simple calculation
        if (DEMO_MODE || !selectedToken.curveContractAddress) {
          const currentPrice = parseFloat(selectedToken.currentPrice)
          const buyPrice = currentPrice * amount * 1.02 // 2% premium for buy
          const sellPrice = currentPrice * amount * 0.98 // 2% discount for sell
          
          setPricePreview({
            buyPrice: buyPrice.toFixed(6),
            sellPrice: sellPrice.toFixed(6)
          })
          return
        }

        // Try to get prices from contract with timeout
        const curve = await getContract(selectedToken.curveContractAddress!, CurveAbi)
        const amountWei = BigInt(Math.floor(amount * 1e18))
        
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Contract call timeout')), 10000)
        )
        
        const buyPricePromise = curve.getBuyPrice(amountWei)
        const sellPricePromise = curve.getSellPrice(amountWei)
        
        const [buyPriceWei, sellPriceWei] = await Promise.race([
          Promise.all([buyPricePromise, sellPricePromise]),
          timeoutPromise
        ]) as [bigint, bigint]
        
        const buyPrice = Number(buyPriceWei) / 1e18
        const sellPrice = Number(sellPriceWei) / 1e18
        
        setPricePreview({
          buyPrice: buyPrice.toFixed(6),
          sellPrice: sellPrice.toFixed(6)
        })
      } catch (error) {
        console.error('Failed to calculate price preview:', error)
        // Fallback to simple calculation
        const amount = parseFloat(tradeAmount)
        const currentPrice = parseFloat(selectedToken.currentPrice)
        const buyPrice = currentPrice * amount * 1.02
        const sellPrice = currentPrice * amount * 0.98
        
        setPricePreview({
          buyPrice: buyPrice.toFixed(6),
          sellPrice: sellPrice.toFixed(6)
        })
      } finally {
        setIsCalculatingPrice(false)
      }
    }

    // Debounce the calculation
    const timeoutId = setTimeout(calculatePrice, 300) // Reduced debounce time
    return () => clearTimeout(timeoutId)
  }, [tradeAmount, selectedToken])

  useEffect(() => {
    if (DEMO_MODE || !TOKEN_FACTORY_ADDRESS) return
    ;(async () => {
      try {
        const factory = await getContract(TOKEN_FACTORY_ADDRESS, FactoryAbi)
        const addrs: string[] = await factory.getAllTokens()
        const ui: UiToken[] = []
        for (let i = 0; i < addrs.length; i++) {
          const info = await factory.getTokenInfo(addrs[i])
          const curveAddr: string = info.bondingCurve
          let price = '0.00000'
          let sold = '0'
          let max = '1,000,000,000'
          try {
            const curve = await getContract(curveAddr, CurveAbi)
            const cp = await curve.currentPrice()
            const ts = await curve.totalSold()
            const ms = await curve.MAX_SUPPLY()
            price = Number(cp) / 1e18 + ''
            sold = ts.toString()
            max = ms.toString()
          } catch {}
          ui.push({
            id: 10000 + i,
            name: info.name,
            symbol: info.symbol,
            creator: info.creator,
            creationTime: new Date(Number(info.creationTime) * 1000).toLocaleString(),
            currentPrice: price,
            priceChange: '+0.0%',
            totalSold: sold,
            maxSupply: max,
            isPriceUp: true,
            bondingCurveAddress: curveAddr.slice(0, 6) + '...' + curveAddr.slice(-4),
            curveContractAddress: curveAddr, // Store full address for contract calls
            tokenAddress: addrs[i] // Store the actual token address
          })
        }
        setOnchainTokens(ui)
      } catch (e) {
        console.error('Failed to load on-chain tokens', e)
      }
    })()
  }, [])

  const tokens: UiToken[] = useMemo(() => {
    const mappedDemo = demoTokens.map((t, idx) => ({
      id: 1000 + idx,
      name: t.name,
      symbol: t.symbol,
      creator: t.creator || 'you',
      creationTime: 'just now',
      currentPrice: '0.00010',
      priceChange: '+0.0%',
      totalSold: '0',
      maxSupply: '1,000,000,000',
      isPriceUp: true,
      bondingCurveAddress: t.address.slice(0, 6) + '...' + t.address.slice(-4),
      curveContractAddress: t.address, // Demo tokens have full address
      tokenAddress: t.address // For demo tokens, use the same address
    }))
    return [...onchainTokens, ...mappedDemo, ...seedMock]
  }, [demoTokens, onchainTokens])

  const handleTrade = async (action: 'buy' | 'sell') => {
    if (!selectedToken || !tradeAmount || !pricePreview) return
    
    setIsTrading(true)
    try {
      if (DEMO_MODE) {
        // Demo mode - simulate wallet transaction
        const provider = window.ethereum
        if (!provider) {
          alert('Please install MetaMask to continue')
          return
        }

        // Request account access
        const accounts = await provider.request({ method: 'eth_requestAccounts' })
        if (!accounts || accounts.length === 0) {
          alert('Please connect your wallet')
          return
        }

        const userAddress = accounts[0]
        const amount = parseFloat(tradeAmount)
        const price = parseFloat(action === 'buy' ? pricePreview.buyPrice : pricePreview.sellPrice)
        
        // Create transaction object for MetaMask
        const txParams = {
          from: userAddress,
          to: selectedToken.tokenAddress || '0x0000000000000000000000000000000000000000', // Demo address
          value: action === 'buy' ? 
            `0x${Math.floor(price * 1e18).toString(16)}` : // Convert to hex
            '0x0',
          gas: '0x5208', // 21000 gas
          gasPrice: '0x3b9aca00', // 1 gwei
          data: '0x', // Empty data for demo
        }

        // Show MetaMask transaction popup
        const txHash = await provider.request({
          method: 'eth_sendTransaction',
          params: [txParams]
        })

        // Simulate transaction confirmation
        setTimeout(() => {
          setIsTrading(false)
          alert(`✅ ${action === 'buy' ? 'Buy' : 'Sell'} transaction successful!\n\nTransaction Hash: ${txHash}\nAmount: ${tradeAmount} ${selectedToken.symbol}\nPrice: ${price} OKB\nTotal: ${(amount * price).toFixed(6)} OKB`)
          setTradeAmount('')
          setPricePreview(null)
        }, 2000)

        return
      }

      if (!TOKEN_FACTORY_ADDRESS || !selectedToken.tokenAddress) {
        throw new Error('Token factory or token address not available')
      }

      const factory = await getContract(TOKEN_FACTORY_ADDRESS, FactoryAbi)
      const amount = parseFloat(tradeAmount)
      const amountWei = BigInt(Math.floor(amount * 1e18))

      if (action === 'buy') {
        // Buy tokens - send OKB value
        const buyValue = BigInt(Math.floor(parseFloat(pricePreview.buyPrice) * 1e18))
        const tx = await factory.buyTokens(selectedToken.tokenAddress, amountWei, { value: buyValue })
        await tx.wait()
        alert(`Successfully bought ${tradeAmount} ${selectedToken.symbol} tokens!`)
      } else {
        // Sell tokens - no value needed
        const tx = await factory.sellTokens(selectedToken.tokenAddress, amountWei)
        await tx.wait()
        alert(`Successfully sold ${tradeAmount} ${selectedToken.symbol} tokens!`)
      }

      // Reset form
      setTradeAmount('')
      setPricePreview(null)
      
    } catch (error: any) {
      console.error('Trade failed:', error)
      if (error.code === 4001) {
        alert('Transaction was rejected by user')
      } else {
        alert(`Trade failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    } finally {
      setIsTrading(false)
    }
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
            <h4 className="text-lg font-semibold text-white mb-4">Available Tokens {DEMO_MODE ? '(Demo + Sample)' : '(On-chain + Demo + Sample)'}</h4>
            <div className="space-y-4">
              {tokens.map((token) => (
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

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Amount to Buy/Sell</label>
                    <input 
                      type="number" 
                      value={tradeAmount} 
                      onChange={(e) => setTradeAmount(e.target.value)} 
                      placeholder="Enter amount" 
                      className="input-field w-full" 
                    />
                  </div>

                  {/* Price Preview */}
                  {tradeAmount && (
                    <div className="bg-white/5 rounded-xl p-4">
                      <h5 className="text-sm font-medium text-white mb-3">Price Preview</h5>
                      {isCalculatingPrice ? (
                        <div className="text-center py-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500 mx-auto"></div>
                          <p className="text-xs text-white/60 mt-1">Calculating...</p>
                        </div>
                      ) : pricePreview ? (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/60">Buy {tradeAmount} tokens for:</span>
                            <span className="text-success-400 font-medium">{pricePreview.buyPrice} OKB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">Sell {tradeAmount} tokens for:</span>
                            <span className="text-error-400 font-medium">{pricePreview.sellPrice} OKB</span>
                          </div>
                          <div className="border-t border-white/10 pt-2 mt-2">
                            <div className="flex justify-between">
                              <span className="text-white/60">Price per token:</span>
                              <span className="text-white font-medium">
                                {(parseFloat(pricePreview.buyPrice) / parseFloat(tradeAmount)).toFixed(6)} OKB
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-white/60">Enter a valid amount to see price preview</p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleTrade('buy')} 
                      disabled={isTrading || !tradeAmount || !pricePreview} 
                      className="btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isTrading ? 'Buying...' : 'Buy Tokens'}
                    </button>
                    <button 
                      onClick={() => handleTrade('sell')} 
                      disabled={isTrading || !tradeAmount || !pricePreview} 
                      className="btn-secondary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isTrading ? 'Selling...' : 'Sell Tokens'}
                    </button>
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
