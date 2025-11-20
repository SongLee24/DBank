// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// 从 OpenZeppelin 的 ERC20 派生一个新合约
contract MyFirstToken is ERC20 {
    // 构造函数
    constructor(uint256 initialSupply) ERC20("MyFirstToken", "MFT") {
        // 通过 _mint 函数铸造初始供应量的代币到部署合约的地址
        _mint(msg.sender, initialSupply);
    }
}
