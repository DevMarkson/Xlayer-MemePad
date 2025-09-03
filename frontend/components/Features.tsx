'use client'

import { Zap, TrendingUp, Shield, Users, Coins, Rocket } from 'lucide-react'

const features = [
  {
    icon: <Rocket className="w-8 h-8" />,
    title: 'Instant Token Creation',
    description: 'Create your meme token in seconds with just a name, symbol, and 0.1 OKB fee. No coding knowledge required!',
    color: 'from-primary-500 to-primary-600'
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: 'Bonding Curve Mechanics',
    description: 'Automatic price discovery through linear bonding curves. Price increases with each token sold, ensuring fair value.',
    color: 'from-secondary-500 to-secondary-600'
  },
  {
    icon: <Coins className="w-8 h-8" />,
    title: 'Automatic Liquidity',
    description: 'Once 80 OKB threshold is reached, liquidity is automatically provided to DEXs with 36 OKB permanently locked.',
    color: 'from-success-500 to-success-600'
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Referral Rewards',
    description: 'Earn 20% of creation fees from users you refer. Build your community and earn passive income!',
    color: 'from-warning-500 to-warning-600'
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Secure & Audited',
    description: 'Built with OpenZeppelin contracts and comprehensive security measures. Your funds are safe with us.',
    color: 'from-error-500 to-error-600'
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'X Layer L2',
    description: 'Deploy on X Layer (OKX zkEVM) for ultra-low gas fees and lightning-fast transactions.',
    color: 'from-purple-500 to-purple-600'
  }
]

export default function Features() {
  return (
    <section className="py-20 px-4" id="features">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Why Choose Our Launchpad?
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            We've built the most user-friendly and feature-rich meme token launchpad on X Layer. 
            Here's what makes us special:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="card group hover:scale-105 transition-all duration-300"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-4 text-white">
                {feature.title}
              </h3>
              
              <p className="text-white/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* How It Works Section */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold mb-12 gradient-text">
            How It Works
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2 text-white">Connect Wallet</h4>
              <p className="text-white/70">Connect your OKX Wallet or MetaMask to X Layer</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2 text-white">Create Token</h4>
              <p className="text-white/70">Pay 0.1 OKB fee and provide token details</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2 text-white">Trade & Grow</h4>
              <p className="text-white/70">Start trading through bonding curve mechanics</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                4
              </div>
              <h4 className="text-lg font-semibold mb-2 text-white">Auto Liquidity</h4>
              <p className="text-white/70">Automatic DEX integration at 80 OKB threshold</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
