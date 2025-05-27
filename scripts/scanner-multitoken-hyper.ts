import { ethers, network } from "hardhat";
import { Wallet, providers, Contract } from "ethers";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import dotenv from "dotenv";
dotenv.config();

// 📍 Adresses importantes
const UNISWAP_V2_ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; // ✅ Router correct V2
const UNISWAP_V3_QUOTER = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6"; // ✅ Quoter V3 correct

const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

async function main() {
  console.log("🚀 Initialisation Scanner MultiToken avec Price Feed...");

  const provider = new providers.JsonRpcProvider(process.env.LOCALHOST_RPC_URL || "http://127.0.0.1:8545");

  // 🛠️ Forcer ChainID à Mainnet
  const originalGetNetwork = provider.getNetwork.bind(provider);
  provider.getNetwork = async () => ({
    chainId: 1,
    name: "mainnet",
  });
  console.log("🌐 Network actuel forcé sur chainId=1");

  const authSigner = Wallet.createRandom();
  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    authSigner,
    process.env.FLASHBOTS_RELAY || "https://relay.flashbots.net"
  );
  console.log("✅ Connexion Flashbots OK");

  // 🧩 Setup contrats Uniswap
  const uniswapV2 = new Contract(
    UNISWAP_V2_ROUTER,
    ["function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)"],
    provider
  );

  const uniswapV3 = new Contract(
    UNISWAP_V3_QUOTER,
    ["function quoteExactInput(bytes path, uint256 amountIn) external returns (uint256 amountOut)"],
    provider
  );

  // 🎯 Scan sur chaque block
  provider.on("block", async (blockNumber) => {
    console.log(`⛓️ Nouveau block forké: ${blockNumber}`);

    try {
      const amountIn = ethers.utils.parseUnits("1", 6); // 1 USDC (6 decimals)

      // Uniswap V2 - prix de 1 USDC en WETH
      const v2Amounts = await uniswapV2.getAmountsOut(amountIn, [USDC, WETH]);
      const priceV2 = v2Amounts[1];
      console.log(`🧪 [V2] 1 USDC ➔ ${ethers.utils.formatEther(priceV2)} WETH`);

      // Uniswap V3 - prix de 1 USDC en WETH (utilisation correcte de callStatic)
      const pathV3 = ethers.utils.solidityPack(["address", "uint24", "address"], [USDC, 3000, WETH]);
      const priceV3 = await uniswapV3.callStatic.quoteExactInput(pathV3, amountIn); // ✅ PATCH callStatic
      console.log(`🧪 [V3] 1 USDC ➔ ${ethers.utils.formatEther(priceV3)} WETH`);

      // Calcul du spread
      const spread = ((priceV3.sub(priceV2)).mul(10000)).div(priceV2).toNumber() / 100;
      console.log(`📈 Spread: ${spread}%`);

      if (Math.abs(spread) > 0.5) { // 🚨 Détection d'opportunité si spread > 0.5%
        console.log(`🚨 OPPORTUNITÉ D'ARBITRAGE détectée! Spread = ${spread}%`);
      }

    } catch (err: any) {
      console.error(`⚠️ Erreur lors du scan : ${err.message}`);
    }
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
