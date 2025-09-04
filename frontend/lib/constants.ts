export const TOKEN_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS || ''
export const XLAYER_TESTNET = 195
export const XLAYER_MAINNET = 196
export const APP_CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || XLAYER_TESTNET)
export const DEMO_MODE = String(process.env.NEXT_PUBLIC_DEMO_MODE || '').toLowerCase() === 'true'
