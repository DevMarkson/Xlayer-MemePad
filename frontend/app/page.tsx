'use client'

import { useState } from 'react'
import { Rocket, Coins, TrendingUp, Users, Zap, Shield } from 'lucide-react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import TokenCreation from '@/components/TokenCreation'
import TokenList from '@/components/TokenList'
import Footer from '@/components/Footer'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'create' | 'trade'>('create')

  return (
    <main className="min-h-screen">
      <Header />
      
      <Hero />
      
      <Features />
      
      {/* Main Action Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Ready to Launch Your Meme Token?
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Create your token in seconds, trade through bonding curves, and watch your community grow with automatic liquidity provision.
            </p>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20">
              <button
                onClick={() => setActiveTab('create')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === 'create'
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                🚀 Create Token
              </button>
              <button
                onClick={() => setActiveTab('trade')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === 'trade'
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                💰 Trade Tokens
              </button>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="animate-fade-in">
            {activeTab === 'create' ? (
              <TokenCreation />
            ) : (
              <TokenList />
            )}
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">100+</div>
              <div className="text-white/70">Tokens Created</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">$2.5M+</div>
              <div className="text-white/70">Total Volume</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">50K+</div>
              <div className="text-white/70">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">80 OKB</div>
              <div className="text-white/70">Liquidity Threshold</div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
