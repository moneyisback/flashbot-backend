import { ethers } from "ethers";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import dotenv from "dotenv";
dotenv.config();

const RPC_URL = process.env.MAINNET_RPC_URL!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const FLASHBOTS_ENDPOINT = "https://relay.flashbots.net";

async function main() {
  // 🧠 Provider & Wallet
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  // 🛡️ Flashbots Provider
  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    wallet,
    FLASHBOTS_ENDPOINT
  );

  console.log("👤 Wallet:", wallet.address);
  console.log("📡 RPC:", RPC_URL);

  // 🔐 Transaction Setup
  const gasLimit = ethers.utils.hexlify(180000);
  const maxFeePerGas = ethers.utils.parseUnits("40", "gwei");
  const maxPriorityFeePerGas = ethers.utils.parseUnits("3", "gwei");

  const tx = {
    to: wallet.address,
    value: ethers.utils.parseEther("0"),
    gasLimit,
    maxFeePerGas,
    maxPriorityFeePerGas,
    type: 2,
    nonce: await provider.getTransactionCount(wallet.address),
    chainId: 1,
  };

  const signedTx = await wallet.signTransaction(tx);
  console.log("🧾 Signed TX:", signedTx);

  const blockNumber = await provider.getBlockNumber();

  // 📦 Build Bundle
  const bundle = [signedTx];

  console.log("📦 Sending bundle for block", blockNumber + 1);

  const bundleSubmission = await flashbotsProvider.sendRawBundle(bundle, blockNumber + 1);

  if ("error" in bundleSubmission) {
    console.error("❌ Flashbots error:", bundleSubmission.error.message);
    process.exit(1);
  }

  const simulation = await bundleSubmission.simulate();

  if ("error" in simulation && simulation.error) {
    console.error("❌ Simulation failed:", simulation.error.message || simulation.error);
    process.exit(1);
  }

  console.log("✅ Simulation succeeded");

  const waitResponse = await bundleSubmission.wait();

  if (waitResponse === 0) {
    console.log("❌ Bundle not included in target block");
  } else {
    console.log("✅ Bundle included!");
  }
}

main().catch((err) => {
  console.error("🔥 Critical Error:", err);
  process.exit(1);
});
