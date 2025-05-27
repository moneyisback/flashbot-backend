export async function getPriceDifference(tokenA: string, tokenB: string): Promise<number> {
  // ⚠️ Remplacer ceci par ta logique réelle d'appel à Uniswap/Sushi/Balancer
  const priceA = 1.00;
  const priceB = 0.985;

  const diff = ((priceA - priceB) / priceB) * 100;
  return diff;
}
