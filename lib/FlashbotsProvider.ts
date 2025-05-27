// lib/FlashbotsProvider.ts
import { FlashbotsBundleProvider, FlashbotsBundleResolution } from "@flashbots/ethers-provider-bundle";
import { ethers } from "ethers";

export async function getFlashbotsProvider(
  provider: ethers.providers.JsonRpcProvider,
  authSigner: ethers.Wallet
): Promise<FlashbotsBundleProvider> {
  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    authSigner,
    "https://rpc.flashbots.net" // Flashbots Protect RPC
  );
  return flashbotsProvider;
}
