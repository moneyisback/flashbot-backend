import { network } from "hardhat";
import { ethers } from "ethers";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import { Wallet, providers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  console.log("🚀 Initialisation Flashbots Fork...");

  const provider = new providers.JsonRpcProvider("http://127.0.0.1:8545");

  const networkData = await provider.getNetwork();
  console.log(`🌐 Network actuel: chainId=${networkData.chainId} (${networkData.name})`);

  const forkedProvider = new providers.StaticJsonRpcProvider("http://127.0.0.1:8545", {
    chainId: 1,
    name: "mainnet",
  });

  const authSigner = Wallet.createRandom();
  const flashbotsProvider = await FlashbotsBundleProvider.create(
    forkedProvider,
    authSigner,
    "https://relay.flashbots.net",
    "mainnet"
  );

  console.log("✅ Connexion Flashbots OK");

  // ➔ Ici ton script scanning / send bundle
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
