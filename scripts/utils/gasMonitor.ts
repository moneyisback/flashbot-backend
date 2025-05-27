import { providers } from 'ethers'

export async function getGasPrice(provider: providers.JsonRpcProvider): Promise<number> {
  const gasPrice = await provider.getGasPrice()
  return parseFloat(gasPrice.toString()) / 1e9 // Gwei
}

export function isProfitWorth(profit: number, gasGwei: number, minProfitEth = 0.005): boolean {
  // Tu peux complexifier en fonction du gasGwei si tu veux
  return profit >= minProfitEth
}
