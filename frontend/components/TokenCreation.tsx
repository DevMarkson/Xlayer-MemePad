'use client'

import { useState } from 'react'
import { Rocket, Coins, Users, Info } from 'lucide-react'
import { getContract } from '../lib/web3'
import TokenFactoryAbi from '../lib/abis/TokenFactory.json'
import { TOKEN_FACTORY_ADDRESS } from '../lib/constants'

export default function TokenCreation() {
  const [formData, setFormData] = useState({
    tokenName: '',
    tokenSymbol: '',
    referrer: '',
    agreeToTerms: false
  })
  const [isCreating, setIsCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!TOKEN_FACTORY_ADDRESS) {
      alert('TokenFactory address is not set. Please set NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS in your env.')
      return
    }

    setIsCreating(true)
    try {
      const factory = await getContract(TOKEN_FACTORY_ADDRESS, TokenFactoryAbi)
      // 0.1 OKB in wei
      const value = BigInt(1e17)
      const tx = await factory.createToken(
        formData.tokenName,
        formData.tokenSymbol,
        formData.referrer || '0x0000000000000000000000000000000000000000',
        { value }
      )
      await tx.wait()
      alert('✅ Token created successfully!')
      setFormData({ tokenName: '', tokenSymbol: '', referrer: '', agreeToTerms: false })
    } catch (err: any) {
      console.error(err)
      alert(err?.message || 'Failed to create token')
    } finally {
      setIsCreating(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Create Your Meme Token</h3>
          <p className="text-white/70">Launch your token in seconds with just a few clicks!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Token Name */}
          <div>
            <label htmlFor="tokenName" className="block text-sm font-medium text-white mb-2">
              Token Name *
            </label>
            <input
              type="text"
              id="tokenName"
              name="tokenName"
              value={formData.tokenName}
              onChange={handleInputChange}
              placeholder="e.g., DogeMoon, PepeCoin, ShibaInu"
              className="input-field w-full"
              required
            />
            <p className="text-sm text-white/60 mt-1">Choose a catchy name for your meme token</p>
          </div>

          {/* Token Symbol */}
          <div>
            <label htmlFor="tokenSymbol" className="block text-sm font-medium text-white mb-2">
              Token Symbol *
            </label>
            <input
              type="text"
              id="tokenSymbol"
              name="tokenSymbol"
              value={formData.tokenSymbol}
              onChange={handleInputChange}
              placeholder="e.g., DOGE, PEPE, SHIB"
              className="input-field w-full"
              maxLength={10}
              required
            />
            <p className="text-sm text-white/60 mt-1">Short symbol (max 10 characters)</p>
          </div>

          {/* Referrer (Optional) */}
          <div>
            <label htmlFor="referrer" className="block text-sm font-medium text-white mb-2">
              Referrer Address (Optional)
            </label>
            <input
              type="text"
              id="referrer"
              name="referrer"
              value={formData.referrer}
              onChange={handleInputChange}
              placeholder="0x... (referrer wallet address)"
              className="input-field w-full"
            />
            <p className="text-sm text-white/60 mt-1">Referrer will earn 20% of your creation fee</p>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="mt-1 w-4 h-4 text-primary-500 bg-white/10 border-white/20 rounded focus:ring-primary-500"
              required
            />
            <label htmlFor="agreeToTerms" className="text-sm text-white/80">
              I agree to the{' '}
              <a href="#" className="text-primary-400 hover:text-primary-300 underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-400 hover:text-primary-300 underline">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Creation Fee Info */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80">Creation Fee:</span>
              <span className="text-white font-semibold">0.1 OKB</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80">Initial Supply:</span>
              <span className="text-white font-semibold">1,000,000,000 tokens</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">Network:</span>
              <span className="text-white font-semibold">X Layer (L2)</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isCreating || !formData.agreeToTerms}
            className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isCreating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creating Token...</span>
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                <span>🚀 Launch Token Now</span>
              </>
            )}
          </button>
        </form>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-white/70">
              <p className="mb-2">
                <strong>What happens next?</strong> After payment, your token will be instantly deployed with:
              </p>
              <ul className="list-disc list-inside space-y-1 text-white/60">
                <li>1 billion initial supply sent to your wallet</li>
                <li>Automatic bonding curve setup</li>
                <li>Ready for trading immediately</li>
                <li>Automatic liquidity provision at 80 OKB threshold</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
