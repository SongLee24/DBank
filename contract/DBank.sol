// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract DBank {
    // 存储账户余额
    mapping(address => uint) private balance;

    // 不可变变量
    address private immutable token;

    constructor(address _token) {
        token = _token;
    } 

    // 注意：所有amount应该是用户（或前端应用）直接向合约提供的最小单位数量（wei，或带10^18小数位的单位）
    //      单位转换在应用层进行
    modifier requireBalance(uint amount) {
        require(amount <= balance[msg.sender], "Your balance is not enough.");
        _;
    }

    // 查询余额
    function myBalance() public view returns (uint) {
        return balance[msg.sender];
    }

    // 存款 -----> 将个人账户的代币转移到 DBank 合约账户
    function deposit(uint amount) public {
        // 在代币合约中，将个人账户的 token 转移到 DBank 账户(合约地址)
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "deposit failed");
        // 记录
        balance[msg.sender] += amount;
    }

    // 取款 -----> 将 DBank 合约账户的代币转移到个人账户
    function withdraw(uint amount) external requireBalance(amount) {
        // 在代币合约中，将 DBank 合约账户的 token 转移到个人账户中
        // require(IERC20(token).transfer(msg.sender, amount), "withdraw failed");
        SafeERC20.safeTransfer(IERC20(token), msg.sender, amount);
        // 记录
        balance[msg.sender] -= amount;
    }

    // 转账 -----> 银行内的转账
    function bankTransfer(address to, uint amount) public requireBalance(amount) {
        // 直接记录
        balance[msg.sender] -= amount;
        balance[to] += amount;
    }
}
