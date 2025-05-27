import { ethers, network } from "hardhat";

async function main() {
  console.log("🚀 Lancement du script d'impersonation...");

  // Adresse du whale à impersonate (ex: whale ETH ou USDC)
  const richAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";

  // Ton compte Hardhat local pour recevoir l'ETH
  const [deployer] = await ethers.getSigners();
  const myAddress = deployer.address;

  console.log(`👤 Compte riche à impersonate : ${richAddress}`);
  console.log(`🧑‍💻 Mon compte local : ${myAddress}`);

  // Impersonate l'account
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [richAddress],
  });

  const impersonatedSigner = await ethers.getSigner(richAddress);

  // Envoi de 10 ETH depuis le whale vers ton compte Hardhat
  await impersonatedSigner.sendTransaction({
    to: myAddress,
    value: ethers.utils.parseEther("10.0"), // 10 ETH 🤑
  });

  console.log(`✅ 10 ETH envoyés à ${myAddress}`);

  // Maintenant déploiement avec ton compte local (deployer)
  console.log("🚀 Déploiement du contrat avec ton compte local...");

  const FlashloanArbitrage = await ethers.getContractFactory("FlashloanArbitrage", deployer);
  
  const flashloanArbitrage = await FlashloanArbitrage.deploy(
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH adresse Mainnet
    "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F", // Sushiswap Router
    "0xE592427A0AEce92De3Edee1F18E0157C05861564"  // Uniswap V3 Router
  );

  await flashloanArbitrage.deployed();
  console.log(`✅ FlashloanArbitrage déployé à l'adresse : ${flashloanArbitrage.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
