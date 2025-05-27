// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ILendingPool.sol";
import "./ILendingPoolAddressesProvider.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IUniswapV2Router02 {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
}

interface ISwapRouter {
    function exactInput(
        bytes calldata path,
        address recipient,
        uint256 deadline,
        uint256 amountIn,
        uint256 amountOutMinimum
    ) external payable returns (uint256 amountOut);
}

contract FlashloanArbitrage is ReentrancyGuard {
    using SafeERC20 for IERC20;

    ILendingPool public lendingPool;
    address public owner;
    address public immutable weth;
    address public immutable sushiswapRouter;
    address public immutable uniswapRouter;

    event FlashloanExecuted(address indexed asset, uint256 profit);
    event TokensRescued(address indexed token, uint256 amount);
    event ETHRescued(uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "FlashloanArbitrage: caller is not the owner");
        _;
    }

    constructor(
        address _weth,
        address _sushiswapRouter,
        address _uniswapRouter
    ) {
        require(_weth != address(0), "FlashloanArbitrage: WETH zero address");
        require(_sushiswapRouter != address(0), "FlashloanArbitrage: Sushi router zero address");
        require(_uniswapRouter != address(0), "FlashloanArbitrage: Uni router zero address");

        owner = msg.sender;
        weth = _weth;
        sushiswapRouter = _sushiswapRouter;
        uniswapRouter = _uniswapRouter;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "FlashloanArbitrage: new owner zero address");
        require(newOwner != owner, "FlashloanArbitrage: already owner");

        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function rescueERC20(address token, uint256 amount) external onlyOwner nonReentrant {
        require(token != address(0), "FlashloanArbitrage: token zero address");
        require(amount > 0, "FlashloanArbitrage: amount zero");

        IERC20(token).safeTransfer(owner, amount);
        emit TokensRescued(token, amount);
    }

    function rescueETH(uint256 amount) external onlyOwner nonReentrant {
        require(amount > 0, "FlashloanArbitrage: amount zero");

        (bool sent, ) = owner.call{value: amount}("");
        require(sent, "FlashloanArbitrage: ETH rescue failed");
        emit ETHRescued(amount);
    }

    receive() external payable {}
    fallback() external payable {}

    function initLendingPool(address providerAddress) external onlyOwner {
        require(providerAddress != address(0), "FlashloanArbitrage: provider zero address");
        require(address(lendingPool) == address(0), "FlashloanArbitrage: already initialized");

        ILendingPoolAddressesProvider provider = ILendingPoolAddressesProvider(providerAddress);
        lendingPool = ILendingPool(provider.getLendingPool());
    }

    /// 🔥 PATCHED - Fonction appelée par le bot Flashbots
    function executeArbitrage(
        address token,
        address tokenB,
        uint256 amount,
        uint24 feeTier,
        uint256 minProfit
    ) external onlyOwner nonReentrant {
        require(token != address(0) && tokenB != address(0), "FlashloanArbitrage: zero address");
        require(amount > 0, "FlashloanArbitrage: amount zero");

        address[] memory path = new address[](2);
        path[0] = token;
        path[1] = tokenB;

        requestFlashloan(token, amount, path, feeTier, minProfit);
    }

    function requestFlashloan(
        address token,
        uint256 amount,
        address[] memory path,
        uint24 feeTier,
        uint256 minProfit
    ) public onlyOwner nonReentrant {
        require(token != address(0), "FlashloanArbitrage: token zero address");
        require(amount > 0, "FlashloanArbitrage: amount zero");
        require(path.length == 2, "FlashloanArbitrage: invalid path length");
        require(path[0] == token, "FlashloanArbitrage: path[0] mismatch");
        require(address(lendingPool) != address(0), "FlashloanArbitrage: pool not set");

        bytes memory data = abi.encode(path, feeTier, minProfit);
        address[] memory assets = new address[](1);
        uint256[] memory amounts = new uint256[](1);
        uint256[] memory modes = new uint256[](1);

        assets[0] = token;
        amounts[0] = amount;
        modes[0] = 0;

        lendingPool.flashLoan(
            address(this),
            assets,
            amounts,
            modes,
            address(this),
            data,
            0
        );
    }

    function executeOperation(
        address[] calldata,
        uint256[] calldata amounts,
        uint256[] calldata fees,
        address initiator,
        bytes calldata params
    ) external nonReentrant returns (bool) {
        require(msg.sender == address(lendingPool), "FlashloanArbitrage: caller not pool");
        require(initiator == address(this), "FlashloanArbitrage: unauthorized");

        (address[] memory path, uint24 feeTier, uint256 minProfit) = abi.decode(params, (address[], uint24, uint256));
        uint256 amountIn = amounts[0];

        // SushiSwap
        IERC20(path[0]).approve(sushiswapRouter, 0);
        IERC20(path[0]).approve(sushiswapRouter, amountIn);
        address[] memory sushiPath = new address[](2);
        sushiPath[0] = path[0];
        sushiPath[1] = path[1];

        try IUniswapV2Router02(sushiswapRouter).swapExactTokensForTokens(
            amountIn,
            1,
            sushiPath,
            address(this),
            block.timestamp
        ) {} catch Error(string memory reason) {
            revert(string(abi.encodePacked("SushiSwap failed: ", reason)));
        } catch {
            revert("SushiSwap failed");
        }

        uint256 intermediate = IERC20(path[1]).balanceOf(address(this));
        require(intermediate > 0, "FlashloanArbitrage: no output from SushiSwap");

        // UniswapV3
        IERC20(path[1]).approve(uniswapRouter, 0);
        IERC20(path[1]).approve(uniswapRouter, intermediate);
        bytes memory uniPath = abi.encodePacked(path[1], feeTier, path[0]);

        uint256 minOut = amountIn + fees[0] + minProfit;

        try ISwapRouter(uniswapRouter).exactInput(
            uniPath,
            address(this),
            block.timestamp,
            intermediate,
            minOut
        ) {} catch Error(string memory reason) {
            revert(string(abi.encodePacked("UniswapV3 failed: ", reason)));
        } catch {
            revert("UniswapV3 failed");
        }

        // Repay
        uint256 totalDebt = amountIn + fees[0];
        uint256 finalBalance = IERC20(path[0]).balanceOf(address(this));
        require(finalBalance >= totalDebt, "FlashloanArbitrage: not profitable");

        IERC20(path[0]).approve(address(lendingPool), 0);
        IERC20(path[0]).approve(address(lendingPool), totalDebt);

        emit FlashloanExecuted(path[0], finalBalance - totalDebt);
        return true;
    }
}
