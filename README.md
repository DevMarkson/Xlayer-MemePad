# 🚀 Meme Token Launchpad on X Layer

A Pump.fun-style meme token launchpad built on the X Layer chain (OKX zkEVM L2) with automatic bonding curve mechanics and DEX integration.

## 🌟 Features

### Core Functionality
- **Instant Token Creation**: Users can mint new meme tokens by paying a small fee in OKB
- **Bonding Curve Model**: Automatic pricing and liquidity accumulation through linear bonding curve mechanics
- **OKB Pool Mechanism**: Fees collected in OKB are pooled until reaching the 80 OKB threshold
- **DEX Integration**: Automatic liquidity provision to DEXs on X Layer once threshold is met
- **Fee Distribution**: Smart fee distribution between platform, creators, and referrers

### Technical Features
- **Smart Contract Framework**: Built with Solidity and OpenZeppelin contracts
- **Bonding Curve Algorithm**: Linear price increase based on tokens sold
- **Automatic Liquidity Management**: 36 OKB permanently locked for base liquidity
- **Referral System**: Built-in referral rewards for token promotion
- **Gas Optimized**: Efficient contract design for X Layer deployment

## 🏗️ Architecture

### Smart Contracts

#### 1. **TokenFactory.sol**
- Main contract managing token creation and bonding curve integration
- Handles fee collection and distribution
- Manages liquidity threshold monitoring
- Coordinates between tokens and bonding curves

#### 2. **MemeToken.sol**
- ERC-20 token template with 1 billion initial supply
- Owner-controlled minting and burning capabilities
- Standard ERC-20 functionality

#### 3. **BondingCurve.sol**
- Linear bonding curve implementation
- Automatic price calculation based on supply
- Buy/sell mechanics with price discovery

### Bonding Curve Mechanics

The bonding curve follows a linear model:
- **Initial Price**: 0.0001 OKB per token
- **Price Increment**: 0.00001 OKB per token sold
- **Formula**: `Price = InitialPrice + (TotalSold × PriceIncrement)`

### Fee Structure

- **Token Creation Fee**: 0.1 OKB
- **Platform Fee**: 40% of creation fee
- **Creator Fee**: 40% of creation fee  
- **Referrer Fee**: 20% of creation fee (if referrer exists)

### Liquidity Management

- **Threshold**: 80 OKB accumulated fees
- **Permanently Locked**: 36 OKB for base liquidity
- **DEX Provision**: Remaining 44 OKB automatically added to DEX

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Hardhat
- MetaMask or OKX Wallet with X Layer testnet configured

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd meme-token-launchpad
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your private key and API keys
```

4. **Compile contracts**
```bash
npm run compile
```

### Configuration

Create a `.env` file with:
```env
PRIVATE_KEY=your_private_key_here
OKLINK_API_KEY=your_oklink_api_key_here
```

### Testing

Run the test suite:
```bash
npm test
```

### Deployment

#### Testnet Deployment
```bash
npm run deploy:testnet
```

#### Mainnet Deployment
```bash
npm run deploy:mainnet
```

## 📊 Usage

### Creating a New Token

1. **Connect Wallet**: Connect your OKX Wallet or MetaMask to X Layer
2. **Pay Creation Fee**: Send 0.1 OKB to create your token
3. **Set Token Details**: Provide name and symbol for your meme token
4. **Token Deployment**: Your token is instantly deployed with 1 billion supply

### Trading Through Bonding Curve

1. **Buy Tokens**: Send OKB to buy tokens at current bonding curve price
2. **Price Discovery**: Price automatically increases with each purchase
3. **Sell Tokens**: Sell tokens back through the bonding curve
4. **Liquidity**: All trades contribute to the liquidity pool

### Referral System

1. **Share Referral Link**: Share your unique referral link
2. **Earn Rewards**: Receive 20% of creation fees from referred users
3. **Track Performance**: Monitor your referral earnings

## 🔧 Development

### Project Structure
```
├── contracts/           # Smart contracts
│   ├── TokenFactory.sol
│   ├── MemeToken.sol
│   └── BondingCurve.sol
├── scripts/            # Deployment scripts
├── test/              # Test files
├── hardhat.config.js  # Hardhat configuration
└── README.md
```

### Adding New Features

1. **Modify Contracts**: Update Solidity contracts as needed
2. **Update Tests**: Add corresponding test cases
3. **Deploy**: Use deployment scripts for testnet/mainnet

### Testing New Features

```bash
# Run specific test file
npx hardhat test test/TokenFactory.test.js

# Run with gas reporting
REPORT_GAS=true npm test
```

## 🌐 Networks

### X Layer Testnet
- **Chain ID**: 195
- **RPC URL**: https://rpc-testnet.xlayer.tech
- **Explorer**: https://www.oklink.com/xlayer-testnet

### X Layer Mainnet
- **Chain ID**: 196
- **RPC URL**: https://rpc.xlayer.tech
- **Explorer**: https://www.oklink.com/xlayer

## 🔒 Security

### Contract Security Features
- **Access Control**: Owner-only functions for critical operations
- **Input Validation**: Comprehensive parameter validation
- **Reentrancy Protection**: Built-in protection against reentrancy attacks
- **Emergency Functions**: Emergency withdrawal capabilities

### Audit Considerations
- **OpenZeppelin**: Uses audited OpenZeppelin contracts
- **Code Review**: Comprehensive testing and review
- **Gradual Deployment**: Testnet deployment before mainnet

## 📈 Roadmap

### Phase 1: Core Infrastructure ✅
- [x] Smart contract framework
- [x] Bonding curve mechanics
- [x] Fee distribution system
- [x] Basic testing suite

### Phase 2: Frontend & Integration 🚧
- [ ] React/Next.js frontend
- [ ] Wallet integration (OKX Wallet, MetaMask)
- [ ] User interface for token creation
- [ ] Trading interface

### Phase 3: DEX Integration 📋
- [ ] OkieSwap integration
- [ ] Uniswap v2/v3 support
- [ ] Automatic liquidity provision
- [ ] Cross-DEX arbitrage

### Phase 4: Advanced Features 📋
- [ ] Advanced bonding curves
- [ ] Social features
- [ ] Analytics dashboard
- [ ] Mobile app

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Discussions**: Join community discussions for help and ideas

## 🙏 Acknowledgments

- **OpenZeppelin**: For secure, audited smart contract libraries
- **Hardhat**: For the excellent development framework
- **X Layer**: For the scalable L2 infrastructure
- **Community**: For feedback and contributions

---

**⚠️ Disclaimer**: This is experimental software. Use at your own risk. Always test on testnet before mainnet deployment.
