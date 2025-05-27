// scripts/dashboard.ts
import Table from 'cli-table3';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

// 🛰️ Setup provider
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

// 📌 Tokens to track
const TOKENS = [
  { name: 'ETH', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18 },
  { name: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eb48', decimals: 6 },
];

// 📦 ERC20 ABI fragment
const ERC20_ABI = [
  'function symbol() view returns (string)',
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

// 👁️ Wallet address to monitor
const WALLET = process.env.MONITORED_WALLET || '0xYourAddressHere';

async function displayDashboard() {
  const table = new Table({
    head: ['Token', 'Balance'],
    colWidths: [15, 30],
  });

  for (const token of TOKENS) {
    const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
    const balance = await contract.balanceOf(WALLET);
    const formatted = ethers.utils.formatUnits(balance, token.decimals);
    table.push([token.name, formatted]);
  }

  console.clear();
  console.log('📊 Wallet Token Balances\n');
  console.log(table.toString());
}

displayDashboard().catch((err) => {
  console.error('❌ Failed to load dashboard:', err);
});
