import { ethers } from "ethers";
import { getDexPrice } from "../utils/dexPricing";

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

async function detectArbitrage() {
  const pairs = [
    ["0xTokenA", "0xTokenB"],
    ["0xTokenB", "0xTokenC"],
  ];

  for (const pair of pairs) {
    const price = await getDexPrice(pair, provider);
    if (price > 1.02 || price < 0.98) {
      console.log(`⚠️ Arbitrage opportunity detected on ${pair[0]} / ${pair[1]}: ${price}`);
    }
  }
}

detectArbitrage();
