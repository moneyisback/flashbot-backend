import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import { providers, Wallet } from "ethers";

export async function createFlashbotsProvider(rpcUrl: string, relayUrl: string) {
  const provider = new providers.JsonRpcProvider(rpcUrl);
  const authSigner = Wallet.createRandom();

  const originalGetNetwork = provider.getNetwork.bind(provider);
  provider.getNetwork = async () => ({
    chainId: 1,
    name: "mainnet",
  });

  const flashbotsProvider = await FlashbotsBundleProvider.create(provider, authSigner, relayUrl);
  return flashbotsProvider;
}
