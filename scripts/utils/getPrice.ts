import { ethers } from "ethers";
import ERC20_ABI from "../abi/erc20.json";

export async function getTokenPrice(address: string, provider: ethers.providers.Provider): Promise<number> {
  const contract = new ethers.Contract(address, ERC20_ABI, provider);
  const decimals = await contract.decimals();
  const balance = await contract.balanceOf(process.env.PRICE_FEEDER!);

  return parseFloat(ethers.utils.formatUnits(balance, decimals));
}
