import { ethers } from "hardhat";
import { expect } from "chai";
import * as dotenv from "dotenv";
dotenv.config();

describe("FlashloanArbitrage", function () {
  let deployer: any;
  let flashloanArb: any;

  const { utils } = ethers;

  const WETH = utils.getAddress("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");
  const UNISWAP_ROUTER = utils.getAddress("0xE592427A0AEce92De3Edee1F18E0157C05861564");
  const SUSHISWAP_ROUTER = utils.getAddress("0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F");
  const AAVE_PROVIDER = utils.getAddress("0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5");

  beforeEach(async () => {
    [deployer] = await ethers.getSigners();

    const FlashloanArbitrage = await ethers.getContractFactory("FlashloanArbitrage");
    flashloanArb = await FlashloanArbitrage.deploy(WETH, SUSHISWAP_ROUTER, UNISWAP_ROUTER);
    await flashloanArb.deployed();
  });

  it("should deploy with valid constructor params", async () => {
    const owner = await flashloanArb.owner();
    const weth = await flashloanArb.weth();
    expect(owner).to.equal(deployer.address);
    expect(weth).to.equal(WETH);
  });

  it("should initialize the lending pool", async () => {
    const tx = await flashloanArb.initLendingPool(AAVE_PROVIDER);
    await tx.wait();

    const lp = await flashloanArb.lendingPool();
    expect(lp).to.not.equal(ethers.constants.AddressZero);
  });

  it("should fail flashloan request without opportunity", async () => {
    await flashloanArb.initLendingPool(AAVE_PROVIDER);

    const token = WETH;
    const amount = ethers.utils.parseEther("10");
    const path = [
      WETH,
      utils.getAddress("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48") // USDC
    ];
    const feeTier = 3000;
    const minProfit = ethers.utils.parseEther("1");

    try {
      const tx = await flashloanArb.requestFlashloan(token, amount, path, feeTier, minProfit);
      await tx.wait();
      throw new Error("Flashloan should have reverted but did not");
    } catch (err: any) {
      expect(err.message).to.include("revert");
    }
  });
});
