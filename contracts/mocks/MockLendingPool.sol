// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockLendingPool {
    function flashLoan(
        address, address[] calldata, uint256[] calldata, uint256[] calldata,
        address, bytes calldata, uint16
    ) external pure {
        // dummy for interface
    }
}

contract MockLendingPoolAddressesProvider {
    address public pool;

    constructor(address _pool) {
        pool = _pool;
    }

    function getLendingPool() external view returns (address) {
        return pool;
    }
}
