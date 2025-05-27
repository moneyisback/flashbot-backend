// scripts/utils/getFlashbotsProvider.ts

import { Wallet, providers } from "ethers";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import dotenv from "dotenv";
dotenv.config();

export async function getFlashbotsProvider(
  baseProvider: providers.JsonRpcProvider
): Promise<FlashbotsBundleProvider> {
  const authSigner = Wallet.createRandom();

  const flashbots = await FlashbotsBundleProvider.create(
    baseProvider,
    authSigner,
    process.env.FLASHBOTS_RELAY || "https://relay.flashbots.net",
    "mainnet"
  );

  return flashbots;
}
