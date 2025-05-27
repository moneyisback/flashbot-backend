import { ethers } from "ethers";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import dotenv from "dotenv";
dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

async function executeBundle(to: string, data: string) {
  const flashbotsProvider = await FlashbotsBundleProvider.create(provider, wallet);

  const tx = {
    to,
    data,
    gasLimit: 3000000,
    maxFeePerGas: ethers.utils.parseUnits("100", "gwei"),
    maxPriorityFeePerGas: ethers.utils.parseUnits("2", "gwei"),
    chainId: 1
  };

  const signedTx = await wallet.signTransaction(tx);
  const bundle = [{ signedTransaction: signedTx }];

  const blockNumber = await provider.getBlockNumber();
  const result = await flashbotsProvider.sendBundle(bundle, blockNumber + 1);

  console.log("Execution result:", result);
}

export default executeBundle;
