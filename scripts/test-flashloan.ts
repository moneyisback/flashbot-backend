// scripts/test-flashloan.ts
import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();
import hre from "hardhat";


const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const WETH = process.env.WETH_ADDRESS!;
const AAVE_LENDING_PROVIDER = "0xb53C1a33016B2DC2fF3653530bFF1848a515c8c5";
const UNISWAP_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
const SUSHISWAP_ROUTER = "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);

  const Flashloan = await hre.ethers.getContractFactory("FlashloanArbitrage");
  const contract = await Flashloan.deploy(WETH, SUSHISWAP_ROUTER, UNISWAP_ROUTER);
  await contract.deployed();
  console.log("🚀 Contract deployed at:", contract.address);

  console.log("🔧 Init LendingPool...");
  const txInit = await contract.initLendingPool(AAVE_LENDING_PROVIDER);
  await txInit.wait();

  const amountIn = ethers.utils.parseUnits("1000", 6); // 1000 USDC
  const path = [USDC, DAI];
  const data = ethers.utils.defaultAbiCoder.encode(["address[]"], [path]);

  console.log("💸 Approving flashloan...");
  const flashloanTx = await contract.requestFlashloan(USDC, amountIn, data);
  const receipt = await flashloanTx.wait();

  console.log("✅ Flashloan test complete ✅");
  console.log("📜 Receipt:", receipt.transactionHash);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});


