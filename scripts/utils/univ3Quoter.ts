export async function getUniswapV3Quote(
  tokenIn: string,
  tokenOut: string,
  amountIn: string,
  fee: number
): Promise<number> {
  // ⚠️ SIMULATION — remplace par vrai appel Quoter si besoin
  console.log(`📦 Simulating UniV3 quote: ${tokenIn} → ${tokenOut}`);
  return Math.random() * 1000; // fake price
}
