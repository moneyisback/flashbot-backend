import { BigNumber, Contract, providers } from "ethers";
import CurvePoolABI from "./abi/CurvePoolABI.json";

// Exemple : 3pool - USDT/USDC/DAI
const CURVE_POOL_ADDRESS = "0xb7D02E7D67E70B9A8F5f94C6D1beF7C19aD0eDf0";
const TOKEN_INDEXES: Record<string, number> = {
  "0xA0b86991c6218b36c1d19d4a2e9Eb0cE3606eB48": 1, // USDC
  "0xdAC17F958D2ee523a2206206994597C13D831ec7": 0, // USDT
  "0x6B175474E89094C44Da98b954EedeAC495271d0F": 2, // DAI
};

export async function getCurveQuote(
  provider: providers.JsonRpcProvider,
  tokenIn: string,
  tokenOut: string,
  amountIn: BigNumber
): Promise<BigNumber> {
  try {
    const contract = new Contract(CURVE_POOL_ADDRESS, CurvePoolABI, provider);

    const i = TOKEN_INDEXES[tokenIn];
    const j = TOKEN_INDEXES[tokenOut];

    if (i === undefined || j === undefined) {
      console.warn(`⚠️ Curve token index not found for ${tokenIn} or ${tokenOut}`);
      return BigNumber.from("0");
    }

    const amountOut = await contract.get_dy(i, j, amountIn);
    return BigNumber.from(amountOut);
  } catch (err: any) {
    console.warn(`⚠️ Curve quote failed: ${err.message}`);
    return BigNumber.from("0");
  }
}
