import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.MAINNET_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const ARB_CONTRACT_ADDRESS = "0x18970A229e3E735108B9AA850e94356B1f1737fD"; // Deployed contract
const ABI = require("../artifacts/contracts/FlashloanArbitrage.sol/FlashloanArbitrage.json").abi;

const contract = new ethers.Contract(ARB_CONTRACT_ADDRESS, ABI, wallet);

// Tokens
const WETH = process.env.WETH_ADDRESS!;
const DAI = process.env.DAI_ADDRESS!;
const SUSHI_ROUTER = process.env.SUSHI_ROUTER!;
const UNIV3_QUOTER = process.env.UNIV3_QUOTER!;

// Simule une swap pour estimer prix (Uniswap V3)
async function getUniswapPrice(amountIn: ethers.BigNumber): Promise<ethers.BigNumber> {
  const quoterABI = [
    "function quoteExactInputSingle(address tokenIn,address tokenOut,uint24 fee,uint256 amountIn,uint160 sqrtPriceLimitX96) external returns (uint256 amountOut)"
  ];
  const quoter = new ethers.Contract(UNIV3_QUOTER, quoterABI, provider);
  const amountOut = await quoter.callStatic.quoteExactInputSingle(WETH, DAI, 3000, amountIn, 0);
  return amountOut;
}

// Simule une swap pour estimer prix (SushiSwap)
async function getSushiPrice(amountIn: ethers.BigNumber): Promise<ethers.BigNumber> {
  const routerABI = [
    "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)"
  ];
  const router = new ethers.Contract(SUSHI_ROUTER, routerABI, provider);
  const amounts = await router.getAmountsOut(amountIn, [WETH, DAI]);
  return amounts[1];
}

// Surveillance
async function monitor() {
  const amountIn = ethers.utils.parseEther("1"); // 1 WETH

  while (true) {
    try {
      const uniOut = await getUniswapPrice(amountIn);
      const sushiOut = await getSushiPrice(amountIn);

      const uniPrice = parseFloat(ethers.utils.formatUnits(uniOut, 18));
      const sushiPrice = parseFloat(ethers.utils.formatUnits(sushiOut, 18));
      const diff = sushiPrice - uniPrice;

      console.log(`🟢 [Monitor] UNI: ${uniPrice} | SUSHI: ${sushiPrice} | Δ: ${diff}`);

      if (Math.abs(diff) > 1.0) {
        console.log("⚠️ Arbitrage opportunity detected!");

        const tx = await contract.executeArbitrage(WETH, DAI, {
          gasLimit: 500000,
          gasPrice: await provider.getGasPrice()
        });

        console.log("🚀 Transaction sent:", tx.hash);
        const receipt = await tx.wait();
        console.log("✅ Executed at block:", receipt.blockNumber);
      }
    } catch (err) {
      console.error("❌ Error while monitoring:", err);
    }

    await new Promise(res => setTimeout(res, 15000)); // Wait 15s
  }
}

monitor();
