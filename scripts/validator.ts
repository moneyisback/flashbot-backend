import { ethers } from "ethers";

export function validateProfit(txProfit: string, threshold: string = "0.01"): boolean {
  const profit = ethers.utils.parseEther(txProfit);
  const limit = ethers.utils.parseEther(threshold);
  return profit.gt(limit);
}
