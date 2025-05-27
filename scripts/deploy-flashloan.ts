import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("🚀 Déploiement avec l'account:", deployer.address);
  const balance = await deployer.getBalance();
  console.log("💰 Solde:", hre.ethers.utils.formatEther(balance), "ETH");

  const FlashloanArbitrage = await hre.ethers.getContractFactory("FlashloanArbitrage", deployer);

  const flashloanArbitrage = await FlashloanArbitrage.deploy(
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
    "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F", // SushiSwap Router
    "0xE592427A0AEce92De3Edee1F18E0157C05861564"  // Uniswap V3 Router
  );

  await flashloanArbitrage.deployed();

  console.log("✅ Contract déployé à l'adresse:", flashloanArbitrage.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
