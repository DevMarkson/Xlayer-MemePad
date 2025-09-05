# 🚀 Meme Token Launchpad on X Layer

A Pump.fun-style meme token launchpad built on the **X Layer chain (OKX zkEVM L2)** with automatic bonding curve mechanics and DEX integration.

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
- **Frontend UI**: Clean, user-friendly website with OKX Wallet / MetaMask integration

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

## 🔧 Development

### Project Structure

```
├── contracts/           # Smart contracts
│   ├── TokenFactory.sol
│   ├── MemeToken.sol
│   └── BondingCurve.sol
├── frontend/           # React/Next.js frontend
├── scripts/            # Deployment scripts
├── test/              # Test files
├── hardhat.config.js  # Hardhat configuration
└── README.md
```


## 📈 Roadmap

### Phase 1: Core Infrastructure ✅
- [x] Smart contract framework
- [x] Bonding curve mechanics
- [x] Fee distribution system
- [x] Basic testing suite

### Phase 2: Frontend & Integration ✅
- [x] React/Next.js frontend
- [x] Wallet integration (OKX Wallet, MetaMask)
- [x] User interface for token creation
- [x] Trading interface

### Phase 3: DEX Integration ✅
- [x] OkieSwap integration
- [x] Uniswap v2/v3 support
- [x] Automatic liquidity provision
- [x] Cross-DEX arbitrage

### Phase 4: Advanced Features ✅
- [x] Advanced bonding curves
- [x] Social features
- [x] Analytics dashboard
- [x] Mobile app

## 📄 License
This project is licensed under the MIT License.
