// config/rpc.ts
require('dotenv').config(); // Only if using JS. Remove if you're using TS with dotenv in root.

export const RPC_URLS = {
  // 🔵 Ethereum
  mainnet: process.env.MAINNET_RPC_URL || "",
  goerli: process.env.GOERLI_RPC_URL || "",
  sepolia: process.env.SEPOLIA_RPC_URL || "",

  // 🟣 Polygon
  polygon: process.env.POLYGON_RPC_URL || "",
  mumbai: process.env.MUMBAI_RPC_URL || "",

  // 🔴 Optimism
  optimism: process.env.OPTIMISM_RPC_URL || "",
  optimismGoerli: process.env.OPTIMISM_GOERLI_RPC_URL || "",

  // ⚪ Arbitrum
  arbitrum: process.env.ARBITRUM_RPC_URL || "",
  arbitrumGoerli: process.env.ARBITRUM_GOERLI_RPC_URL || "",

  // 🔵 Base
  base: process.env.BASE_RPC_URL || "",
  baseGoerli: process.env.BASE_GOERLI_RPC_URL || "",

  // ⚫ Fork (Hardhat Network Forking)
  fork: process.env.FORK_RPC_URL || process.env.MAINNET_RPC_URL || "",
};

export const FORK_BLOCK_NUMBERS = {
  mainnet: parseInt(process.env.FORK_BLOCK_MAINNET || "19665000"),
  base: parseInt(process.env.FORK_BLOCK_BASE || "12500000"),
  polygon: parseInt(process.env.FORK_BLOCK_POLYGON || "52000000"),
  optimism: parseInt(process.env.FORK_BLOCK_OPTIMISM || "118000000"),
  arbitrum: parseInt(process.env.FORK_BLOCK_ARBITRUM || "134000000"),
};
