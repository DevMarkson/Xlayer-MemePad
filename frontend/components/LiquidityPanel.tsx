'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Lock, Coins, Activity } from 'lucide-react'
import { DEMO_MODE, TOKEN_FACTORY_ADDRESS } from '../lib/constants'
import { getContract } from '../lib/web3'
import FactoryAbi from '../lib/abis/TokenFactory.json'
import LiquidityManagerAbi from '../lib/abis/LiquidityManager.json'

interface LiquidityStats {
  totalProvided: string
  totalLocked: string
  lastProvision: string
  pendingLiquidity: string
  threshold: string
  progress: number
}

export default function LiquidityPanel() {
  const [stats, setStats] = useState<LiquidityStats>({
    totalProvided: '0',
    totalLocked: '0',
    lastProvision: 'Never',
    pendingLiquidity: '0',
    threshold: '80',
    progress: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (DEMO_MODE) {
      setStats({
        totalProvided: '45.2',
        totalLocked: '36.0',
        lastProvision: '2 hours ago',
        pendingLiquidity: '34.8',
        threshold: '80',
        progress: 43.5
      })
      setIsLoading(false)
      return
    }

    const loadLiquidityData = async () => {
      try {
        if (!TOKEN_FACTORY_ADDRESS) return

        const factory = await getContract(TOKEN_FACTORY_ADDRESS, FactoryAbi)
        const pendingLiquidity = await factory.pendingLiquidity()
        const threshold = await factory.LIQUIDITY_THRESHOLD()

        const pending = Number(pendingLiquidity) / 1e18
        const thresholdValue = Number(threshold) / 1e18
        const progress = (pending / thresholdValue) * 100

        setStats({
          totalProvided: '0',
          totalLocked: '36.0',
          lastProvision: 'Never',
          pendingLiquidity: pending.toFixed(2),
          threshold: thresholdValue.toFixed(0),
          progress: Math.min(progress, 100)
        })
      } catch (error) {
        console.error('Failed to load liquidity data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadLiquidityData()
  }, [])

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-success-500'
    if (progress >= 75) return 'bg-warning-500'
    if (progress >= 50) return 'bg-primary-500'
    return 'bg-gray-500'
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">OKB Pool & Liquidity</h3>
        <p className="text-white/70">Automatic liquidity provision and DEX integration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Liquidity Progress */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">Liquidity Threshold</h4>
              <p className="text-sm text-white/60">Progress to DEX integration</p>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              <p className="text-white/60 mt-2">Loading liquidity data...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white/60">Progress</span>
                  <span className="text-sm font-medium text-white">
                    {stats.progress.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(stats.progress)}`}
                    style={{ width: `${stats.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-white/60 mt-1">
                  {stats.pendingLiquidity} / {stats.threshold} OKB
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Coins className="w-4 h-4 text-success-400" />
                    <span className="text-sm font-medium text-white">Total Provided</span>
                  </div>
                  <p className="text-lg font-bold text-success-400">{stats.totalProvided} OKB</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lock className="w-4 h-4 text-warning-400" />
                    <span className="text-sm font-medium text-white">Permanently Locked</span>
                  </div>
                  <p className="text-lg font-bold text-warning-400">{stats.totalLocked} OKB</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* DEX Integration */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-success-500 to-primary-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">DEX Integration</h4>
              <p className="text-sm text-white/60">Automatic liquidity provision</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* DEX Routers */}
            <div className="space-y-4">
              <h5 className="text-sm font-medium text-white">Connected DEXs</h5>
              
              <div className="space-y-3">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-white">OK</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">OkieSwap</p>
                        <p className="text-xs text-white/60">Native X Layer DEX</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white/60">Router</p>
                      <p className="text-xs font-medium text-white">Demo Router</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-white">U2</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Uniswap V2</p>
                        <p className="text-xs text-white/60">Compatible DEX</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white/60">Router</p>
                      <p className="text-xs font-medium text-white">Demo Router</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Integration Info */}
            <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-xl p-4 border border-primary-500/20">
              <h5 className="text-sm font-medium text-white mb-2">How It Works</h5>
              <ul className="text-xs text-white/60 space-y-1">
                <li>• Trading fees accumulate in OKB pool</li>
                <li>• At 80 OKB threshold, automatic DEX integration triggers</li>
                <li>• 36 OKB permanently locked for base liquidity</li>
                <li>• Remaining 44 OKB distributed to DEXs</li>
                <li>• 50/50 split between OkieSwap and Uniswap V2</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
