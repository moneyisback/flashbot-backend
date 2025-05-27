import { Contract, BigNumber, providers } from "ethers";
import IUniswapV3QuoterABI from "./abi/UniswapV3QuoterABI.json";

const QUOTER_ADDRESS = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6"; // Uniswap V3 Quoter

export async function getUniswapV3Quote(
  provider: providers.JsonRpcProvider,
  tokenIn: string,
  tokenOut: string,
  amountIn: BigNumber
): Promise<BigNumber> {
  const quoter = new Contract(QUOTER_ADDRESS, IUniswapV3QuoterABI, provider);

  try {
    const fee = 3000; // 0.3%
    const amountOut = await quoter.callStatic.quoteExactInputSingle(
      tokenIn,
      tokenOut,
      fee,
      amountIn,
      0
    );
    return BigNumber.from(amountOut);
  } catch (err: any) {
    console.warn("❌ Erreur UniswapV3 Quote:", err.message);
    return BigNumber.from(0);
  }
}
