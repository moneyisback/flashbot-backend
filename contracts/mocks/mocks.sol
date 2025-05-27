// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor(string memory name, string memory symbol, uint256 initialSupply)
        ERC20(name, symbol)
    {
        _mint(msg.sender, initialSupply);
    }
}

contract MockWETH is ERC20 {
    constructor() ERC20("Wrapped ETH", "WETH") {
        _mint(msg.sender, 1000000 ether);
    }

    function deposit() external payable {
        _mint(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        _burn(msg.sender, amount);
        payable(msg.sender).transfer(amount);
    }

    receive() external payable {}
}

contract MockRouter {
    function swapExactTokensForTokens(
        uint amountIn,
        uint,
        address[] calldata path,
        address to,
        uint
    ) external returns (uint[] memory) {
        IERC20(path[0]).transferFrom(msg.sender, address(this), amountIn);
        IERC20(path[1]).transfer(to, amountIn * 2); // 💸 fake profit
        uint[] memory result = new uint[](2);
        result[0] = amountIn;
        result[1] = amountIn * 2;
        return result;
    }

    function exactInput(
        bytes calldata,
        address /*recipient*/,
        uint256,
        uint256 amountIn,
        uint256
    ) external payable returns (uint256) {
        // Simule un retour avec x2 gain
        return amountIn * 2;
    }
}
