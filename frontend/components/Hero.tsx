'use client'

import { ArrowRight, Play, Star } from 'lucide-react'

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 mb-8">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-white/90">🚀 First Meme Token Launchpad on X Layer</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Launch Your Meme Token</span>
            <br />
            <span className="text-white">in Seconds</span>
          </h1>
          
          {/* Description */}
          <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto mb-12 leading-relaxed">
            Create, launch, and trade meme tokens on X Layer with automatic bonding curve mechanics. 
            No coding required. Just pay 0.1 OKB and watch your token go viral! 🌟
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 group">
              <span>🚀 Create Token Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <button className="btn-secondary text-lg px-8 py-4 flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">0.1 OKB</div>
              <div className="text-white/70">Creation Fee</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">1B Supply</div>
              <div className="text-white/70">Initial Tokens</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">Auto LP</div>
              <div className="text-white/70">Liquidity Provision</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 animate-bounce-gentle">
        <div className="w-4 h-4 bg-primary-400 rounded-full opacity-60"></div>
      </div>
      <div className="absolute top-1/3 right-20 animate-bounce-gentle" style={{ animationDelay: '1s' }}>
        <div className="w-3 h-3 bg-secondary-400 rounded-full opacity-60"></div>
      </div>
      <div className="absolute bottom-1/4 left-1/4 animate-bounce-gentle" style={{ animationDelay: '2s' }}>
        <div className="w-2 h-2 bg-yellow-400 rounded-full opacity-60"></div>
      </div>
    </section>
  )
}
