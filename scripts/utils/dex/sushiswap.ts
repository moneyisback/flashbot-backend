import { Contract, BigNumber, providers } from "ethers";
import { abi as IUniswapV2RouterABI } from "@uniswap/v2-periphery/build/IUniswapV2Router02.json";

// 💡 Si tu utilises une autre adresse de router, remplace ici
export async function getSushiswapPrice(
  provider: providers.Provider,
  routerAddress: string,
  tokenIn: string,
  tokenOut: string,
  amountIn: BigNumber
): Promise<BigNumber> {
  const router = new Contract(routerAddress, IUniswapV2RouterABI, provider);

  try {
    const amountsOut = await router.getAmountsOut(amountIn, [tokenIn, tokenOut]);
    return amountsOut[1];
  } catch (err: any) {
    console.warn("❌ SushiSwap Price Fetch Error:", err.message);
    return BigNumber.from(0);
  }
}
