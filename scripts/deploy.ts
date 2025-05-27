import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

// Define the addresses for WETH, SUSHI, and UNIV3 at the top-level scope
const WETH = process.env.WETH_ADDRESS!;
const SUSHI = process.env.SUSHI_ADDRESS!;
const UNIV3 = process.env.UNIV3_ADDRESS!;

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.MAINNET_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  console.log("🚀 Deploying from:", wallet.address);
  console.log("💰 Balance:", (await wallet.getBalance()).toString());

  // Import or define your contract's ABI and BYTECODE
  const ABI = require("../artifacts/contracts/FlashloanArbitrage.sol/FlashloanArbitrage.json");

  const BYTECODE = ABI.bytecode;

  const factory = new ethers.ContractFactory(
    ABI.abi,
    BYTECODE,
    wallet
  );

  const contract = await factory.deploy(WETH, SUSHI, UNIV3);
  await contract.deployed();

  console.log("✅ Deployed to:", contract.address);
}

main().catch(err => {
  console.log("✅ .env Vars =>", { WETH, SUSHI, UNIV3 });
  console.error("❌ Deploy failed", err);
  process.exit(1);
});
