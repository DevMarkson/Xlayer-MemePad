'use client'

import { Github, Twitter, MessageCircle, ExternalLink } from 'lucide-react'

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Documentation', href: '#docs' },
    { name: 'API Reference', href: '#api' }
  ],
  support: [
    { name: 'Help Center', href: '#help' },
    { name: 'Community', href: '#community' },
    { name: 'Contact Us', href: '#contact' },
    { name: 'Bug Report', href: '#bugs' }
  ],
  legal: [
    { name: 'Terms of Service', href: '#terms' },
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Cookie Policy', href: '#cookies' },
    { name: 'Disclaimer', href: '#disclaimer' }
  ]
}

const socialLinks = [
  { name: 'GitHub', href: '#', icon: Github },
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'Discord', href: '#', icon: MessageCircle }
]

export default function Footer() {
  return (
    <footer className="bg-white/5 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h3 className="text-xl font-bold gradient-text">Meme Launchpad</h3>
                <p className="text-sm text-white/60">X Layer</p>
              </div>
            </div>
            <p className="text-white/70 mb-6 max-w-md">
              The first meme token launchpad on X Layer with automatic bonding curve mechanics, 
              instant liquidity provision, and referral rewards.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-white/60 text-sm">
                © 2024 Meme Token Launchpad. Built with ❤️ for the X Layer community.
              </p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 text-white/60">
                <div className="w-2 h-2 bg-success-400 rounded-full"></div>
                <span>X Layer Testnet</span>
              </div>
              <a
                href="https://www.oklink.com/xlayer-testnet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 flex items-center space-x-1"
              >
                <span>Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-xs text-white/60 text-center">
            <strong>⚠️ Disclaimer:</strong> This is experimental software. Use at your own risk. 
            Always test on testnet before mainnet deployment. Cryptocurrency investments are subject to market risks.
          </p>
        </div>
      </div>
    </footer>
  )
}
