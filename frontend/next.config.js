/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
  },
  env: {
    NEXT_PUBLIC_XLAYER_TESTNET_RPC: "https://rpc-testnet.xlayer.tech",
    NEXT_PUBLIC_XLAYER_MAINNET_RPC: "https://rpc.xlayer.tech",
    NEXT_PUBLIC_XLAYER_TESTNET_CHAIN_ID: "195",
    NEXT_PUBLIC_XLAYER_MAINNET_CHAIN_ID: "196",
  },
};

module.exports = nextConfig;
