import { ethers } from 'ethers';
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json';
import { abi as IUniswapV3QuoterABI } from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';
import dotenv from 'dotenv';

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

// ✅ Deployed addresses
const UNIV3_QUOTER = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6';
const SUSHISWAP_FACTORY = '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac';
const UNISWAP_FACTORY = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';

const UNIV2_FACTORY_ABI = [
  'function getPair(address tokenA, address tokenB) external view returns (address pair)'
];

const factoryUni = new ethers.Contract(UNISWAP_FACTORY, UNIV2_FACTORY_ABI, provider);
const factorySushi = new ethers.Contract(SUSHISWAP_FACTORY, UNIV2_FACTORY_ABI, provider);

// 🔁 Price from Uniswap V2
export async function getUniV2Price(tokenA: string, tokenB: string): Promise<number> {
  const pairAddress = await factoryUni.getPair(tokenA, tokenB);
  return await getV2PriceFromPair(pairAddress, tokenA);
}

// 🔁 Price from Sushiswap
export async function getSushiPrice(tokenA: string, tokenB: string): Promise<number> {
  const pairAddress = await factorySushi.getPair(tokenA, tokenB);
  return await getV2PriceFromPair(pairAddress, tokenA);
}

// 🔁 Price from Uniswap V3
export async function getUniV3Price(tokenIn: string, tokenOut: string): Promise<number> {
  const quoter = new ethers.Contract(UNIV3_QUOTER, IUniswapV3QuoterABI, provider);
  const amountIn = ethers.utils.parseUnits("1", 18);

  try {
    const amountOut = await quoter.callStatic.quoteExactInputSingle(
      tokenIn,
      tokenOut,
      3000, // 0.3% fee
      amountIn,
      0
    );
    return parseFloat(ethers.utils.formatUnits(amountOut, 18));
  } catch (err) {
    if (err instanceof Error) {
      console.error("❌ UniV3 quote error:", err.message);
    } else {
      console.error("❌ UniV3 quote error:", err);
    }
    return 0;
  }
}

// 🛠️ Helper function
async function getV2PriceFromPair(pairAddress: string, tokenIn: string): Promise<number> {
  if (pairAddress === ethers.constants.AddressZero) return 0;

  const pair = new ethers.Contract(pairAddress, IUniswapV2PairABI, provider);
  const [reserve0, reserve1] = await pair.getReserves();
  const token0 = await pair.token0();

  const [resIn, resOut] = tokenIn.toLowerCase() === token0.toLowerCase()
    ? [reserve0, reserve1]
    : [reserve1, reserve0];

  if (resIn.eq(0) || resOut.eq(0)) return 0;

  return parseFloat(resOut.toString()) / parseFloat(resIn.toString());
}
