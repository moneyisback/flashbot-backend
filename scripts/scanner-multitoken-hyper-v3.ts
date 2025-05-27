import { ethers } from "ethers";
import tokens from "../config/tokens"; // hypothetique
import abi from "../abi/uniswapPool.json";
import dotenv from "dotenv";
dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

// Hypothèse : chaque token a { address, decimals }
async function scanPools() {
  for (const tokenA of tokens) {
    for (const tokenB of tokens) {
      if (tokenA.address === tokenB.address) continue;

      try {
        const poolAddress = await getPoolAddress(tokenA.address, tokenB.address);
        const poolContract = new ethers.Contract(poolAddress, abi, provider);

        const [reserves0, reserves1] = await poolContract.getReserves();

        const token0 = await poolContract.token0();
        const token1 = await poolContract.token1();

        const decimals0 = tokenA.address === token0 ? tokenA.decimals : tokenB.decimals;
        const decimals1 = tokenA.address === token1 ? tokenA.decimals : tokenB.decimals;

        const priceA = parseFloat(ethers.utils.formatUnits(reserves1, decimals1));
        const priceB = parseFloat(ethers.utils.formatUnits(reserves0, decimals0));

        const ratio = priceA / priceB;

        if (ratio > 1.01 || ratio < 0.99) {
          console.log(`[⚠️ OPPORTUNITÉ] ${tokenA.symbol}/${tokenB.symbol} -> ratio ${ratio}`);
        }

      } catch (e) {
        console.error(`[❌ ERROR] Failed on ${tokenA.symbol}/${tokenB.symbol}`, e.message);
      }
    }
  }
}

async function getPoolAddress(tokenA: string, tokenB: string): Promise<string> {
  // Hypothèse : Factory ou SDK utilisé ici
  // pour l’instant un placeholder
  return "0xFakePoolAddress123456789";
}

scanPools();
