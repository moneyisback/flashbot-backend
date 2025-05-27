import { execSync } from "child_process";
import chalk from "chalk";
import fs from "fs";
import path from "path";

// Colors
const log = console.log;
const success = (msg: string) => log(chalk.greenBright("✅ " + msg));
const error = (msg: string) => log(chalk.redBright("❌ " + msg));
const info = (msg: string) => log(chalk.cyanBright("📘 " + msg));

function run(command: string, label: string) {
  info(`Executing: ${label}`);
  try {
    const output = execSync(command, { stdio: "inherit" });
    success(`${label} OK`);
    return output;
  } catch (err) {
    error(`${label} FAILED`);
    process.exit(1);
  }
}

function checkEnvVariables(requiredVars: string[]) {
  info("Checking .env file...");
  const envPath = path.resolve(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) {
    error(".env file not found!");
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, "utf-8");
  const missing = requiredVars.filter(v => !envContent.includes(v + "="));
  if (missing.length) {
    error(`Missing env vars: ${missing.join(", ")}`);
    process.exit(1);
  }

  success(".env looks OK");
}

(async () => {
  log(chalk.bold("\n🚀 Flashbot MEVBot Full Test - INITIATED...\n"));

  checkEnvVariables([
    "MAINNET_RPC_URL",
    "FLASHBOTS_RELAY_SIGNING_KEY",
    "FLASHLOAN_ARBITRAGE_ADDRESS",
    "GAS_PRIORITY_FEE_GWEI",
    "FLASHBOTS_RELAY"
  ]);

  run("npx hardhat compile", "Hardhat Compile");
  run("npx hardhat test", "Smart Contract Unit Tests");

  run("npx ts-node scripts/scanner-multitoken-hyper-v3.ts", "Arbitrage Scanner");
  run("npx ts-node scripts/executor-flashbots.ts", "Flashbots Bundle Executor");

  success("\n🔥 ALL SYSTEMS GREEN - MEVBOT READY FOR PROD DEPLOY!\n");
})();
