import { BigNumber, ethers } from "ethers";

export function formatUnits(value: BigNumber, decimals = 18) {
  return parseFloat(ethers.utils.formatUnits(value, decimals));
}

export function parseUnits(value: string, decimals = 18) {
  return ethers.utils.parseUnits(value, decimals);
}

export function calculateProfit(buyAmount: BigNumber, sellAmount: BigNumber) {
  const profit = sellAmount.sub(buyAmount);
  return profit;
}
