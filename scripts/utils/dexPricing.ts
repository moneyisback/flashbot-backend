export async function getPriceFromRouter(
  dex: string,
  amountIn: string,
  path: string[]
): Promise<number> {
  // ⚠️ SIMULATION — remplacer par appel RPC réel si besoin
  console.log(`📦 Simulating ${dex} price for`, path.join(" → "));
  return Math.random() * 1000; // fake price
}
