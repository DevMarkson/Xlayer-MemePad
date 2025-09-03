# 🎨 Meme Token Launchpad Frontend

A beautiful, modern React/Next.js frontend for the Meme Token Launchpad on X Layer chain.

## ✨ Features

### 🎯 **User Interface**

- **Modern Design**: Glassmorphism UI with gradient accents
- **Responsive Layout**: Mobile-first design that works on all devices
- **Smooth Animations**: CSS animations and transitions for better UX
- **Dark Theme**: Beautiful dark theme optimized for crypto applications

### 🚀 **Core Functionality**

- **Token Creation**: Intuitive form for creating new meme tokens
- **Trading Interface**: Buy/sell tokens through bonding curve mechanics
- **Wallet Integration**: Support for MetaMask, OKX Wallet, and more
- **Real-time Updates**: Live price updates and token information

### 🔧 **Technical Features**

- **Next.js 14**: Latest React framework with App Router
- **TypeScript**: Full type safety and better development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid development
- **Component Library**: Reusable UI components with consistent design

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Modern web browser

### Installation

1. **Navigate to frontend directory**

```bash
cd frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm run dev
```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page component
├── components/            # Reusable UI components
│   ├── Header.tsx         # Navigation header
│   ├── Hero.tsx           # Hero section
│   ├── Features.tsx       # Features showcase
│   ├── TokenCreation.tsx  # Token creation form
│   ├── TokenList.tsx      # Token trading interface
│   ├── ConnectWallet.tsx  # Wallet connection modal
│   └── Footer.tsx         # Footer component
├── public/                # Static assets
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── next.config.js         # Next.js configuration
└── README.md              # This file
```

## 🎨 Design System

### **Color Palette**

- **Primary**: Blue gradient (#0ea5e9 to #d946ef)
- **Secondary**: Purple gradient (#d946ef to #a21caf)
- **Success**: Green (#22c55e)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### **Typography**

- **Font Family**: Inter (sans-serif) + JetBrains Mono (monospace)
- **Headings**: Bold weights (600-800)
- **Body**: Regular weight (400-500)

### **Components**

- **Buttons**: Gradient primary, glass secondary
- **Cards**: Glassmorphism with backdrop blur
- **Inputs**: Glass effect with focus states
- **Modals**: Backdrop blur with glass panels

## 🔌 Wallet Integration

### **Supported Wallets**

- **MetaMask**: Most popular Ethereum wallet
- **OKX Wallet**: Native OKX ecosystem wallet
- **WalletConnect**: Multi-wallet connection
- **Coinbase Wallet**: Coinbase's Web3 wallet

### **Network Support**

- **X Layer Testnet**: Chain ID 195
- **X Layer Mainnet**: Chain ID 196
- **Automatic Detection**: Wallet network switching

## 📱 Responsive Design

### **Breakpoints**

- **Mobile**: < 768px (default)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### **Mobile Features**

- Touch-friendly buttons and inputs
- Swipe gestures for navigation
- Optimized layouts for small screens
- Mobile-first component design

## 🚀 Development

### **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### **Adding New Components**

1. Create component file in `components/` directory
2. Use TypeScript interfaces for props
3. Follow existing design patterns
4. Add to appropriate page or layout

### **Styling Guidelines**

- Use Tailwind CSS utilities first
- Create custom components in `globals.css`
- Follow the established color palette
- Maintain consistent spacing and typography

## 🔗 Integration Points

### **Smart Contract Integration**

- **TokenFactory**: Token creation and management
- **BondingCurve**: Price calculations and trading
- **MemeToken**: ERC-20 token functionality

### **Blockchain Features**

- **Web3 Connection**: Wallet integration
- **Transaction Handling**: Meta-transactions and gas optimization
- **Event Listening**: Real-time blockchain updates

## 🎯 Next Steps

### **Phase 2 Completion**

- [ ] Integrate wagmi/rainbowkit for wallet connection
- [ ] Connect to deployed smart contracts
- [ ] Implement real token creation flow
- [ ] Add live trading functionality

### **Phase 3 Features**

- [ ] Real-time price updates
- [ ] Transaction history
- [ ] User dashboard
- [ ] Analytics and charts

### **Phase 4 Enhancements**

- [ ] Mobile app (React Native)
- [ ] Advanced trading features
- [ ] Social features and sharing
- [ ] Multi-language support

## 🐛 Troubleshooting

### **Common Issues**

1. **Port 3000 in use**: Change port in `package.json`
2. **Build errors**: Clear `.next` folder and reinstall dependencies
3. **Styling issues**: Ensure Tailwind CSS is properly imported

### **Getting Help**

- Check the main project README
- Review component documentation
- Open an issue for bugs
- Join community discussions

## 📄 License

This frontend is part of the Meme Token Launchpad project and follows the same MIT license.

---

**Built with ❤️ for the X Layer hackathon community**
