import { ethers, network } from "hardhat";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import { Wallet, providers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  console.log("🚀 Initialisation Scanner MultiToken sur Fork...");

  const provider = new providers.JsonRpcProvider("http://127.0.0.1:8545");

  // ➔ Pas besoin de modifier _network maintenant

  console.log(`🌐 Network actuel: chainId=${(await provider.getNetwork()).chainId}`);

  console.warn("⚠️ Attention : tu es en mode fork, certaines simulations peuvent différer du vrai mainnet.");

  const authSigner = Wallet.createRandom();

  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    authSigner,
    "https://relay.flashbots.net",
    {
      chainId: 1,
      name: "mainnet"
    }
  );

  console.log("✅ Connexion Flashbots OK (FORCE MAINNET)");

  // ➔ Ensuite tu peux démarrer ta boucle de scanning ici normalement
  while (true) {
    const block = await provider.getBlockNumber();
    console.log(`⛓️ Nouveau block forké: ${block}`);

    await new Promise((resolve) => setTimeout(resolve, 5000)); // attends 5 sec entre chaque scan
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
