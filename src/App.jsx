import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Box,
  Stack,
} from '@mui/material';
import {ethers} from 'ethers';
import dbankAbi from './ABI.json';


function App() {
  const [balance, setBalance] = useState(0);
  const [account, setAccount] = useState(null);
  const [bankContract, setBankContract] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [transferAddress, setTransferAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  const connectWallet = async() => {
    try {
      // 1、检查浏览器是否安装了以太坊钱包（如MetaMask）
      if (!window.ethereum) {
        alert('请安装MetaMask等以太坊钱包插件！');
        return;
      }
      // 2、请求连接钱包，获取账户
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      
      // 3、访问合约
      const dbankAddress = "0xcf33936D93CFda55e0e0B041B2C0a93817E2fdB1";
      const theBankContract = new ethers.Contract(dbankAddress, dbankAbi, signer);
      setBankContract(theBankContract);

      // 首次调用合约的myBalance方法，显示余额
      const firstBalance = await theBankContract.myBalance();
      setBalance(ethers.formatUnits(firstBalance, 18));
    } catch (error) {
      console.error("连接钱包失败:", error);
      alert("连接钱包失败！");
    }
  }

  const getMyBalance = async() => {
    if (!bankContract) {
      console.log("银行合约未连接！");
      return;
    }
    try {
      // 调用合约的myBalance方法
      const myBalance = await bankContract.myBalance();
      setBalance(ethers.formatUnits(myBalance, 18));
    } catch (error) {
      console.error("获取余额失败:", error);
      alert("获取余额失败！");
    }
  }

  const deposit = async() => {
    if (!bankContract || !depositAmount) {
      alert("请输入存款金额！");
      return;
    }
    try {
      const tx = await bankContract.deposit(ethers.parseUnits(depositAmount, 18));
      await tx.wait(); // 等待交易被打包
      alert("存款成功！");
      setDepositAmount(''); // 清空输入框
      getMyBalance(); // 更新余额
    } catch (error) {
      console.error("存款失败:", error);
      alert("存款失败！");
    }
  }

  const withdraw = async() => {
    if (!bankContract || !withdrawAmount) {
      alert("请输入取款金额！");
      return;
    }
    try {
      const tx = await bankContract.withdraw(ethers.parseUnits(withdrawAmount, 18));
      await tx.wait(); // 等待交易被打包
      alert("取款成功！");
      setWithdrawAmount(''); // 清空输入框
      getMyBalance(); // 更新余额
    } catch (error) {
      console.error("取款失败:", error);
      alert("取款失败！");
    }
  }

  const bankTransfer = async() => {
    if (!bankContract || !transferAmount) {
      alert("请输入转账金额！");
      return;
    }
    try {
      const tx = await bankContract.bankTransfer(transferAddress,ethers.parseUnits(transferAmount, 18));
      await tx.wait(); // 等待交易被打包
      alert("转账成功！");
      setTransferAmount(''); // 清空输入框
      getMyBalance(); // 更新余额
    } catch (error) {
      console.error("转账失败:", error);
      alert("转账失败！");
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          MFT Bank
        </Typography>
        <Button variant="contained" size="large" onClick={connectWallet}>
          Connect Wallet
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            账户地址
          </Typography>
          <Typography component="p">
            {account ? account : '未连接'}
          </Typography>
        </CardContent>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" component="h2" gutterBottom>
                账户余额
              </Typography>
              <Button variant="outlined" size="small" onClick={getMyBalance}>
                  更新余额
              </Button>
            </Box>
            <Typography component="p">
              {balance} MFT
            </Typography>
        </CardContent>
      </Card>

      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              存款
            </Typography>
            <TextField
              label="金额（MFT币）"
              fullWidth
              margin="normal"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <Button variant="contained" color="secondary" fullWidth onClick={deposit}>
              存款
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              取款
            </Typography>
            <TextField
              label="金额（MFT币）"
              fullWidth
              margin="normal"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <Button variant="contained" color="secondary" fullWidth onClick={withdraw}>
              取款
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              银行转账
            </Typography>
            <TextField
              label="转账地址"
              fullWidth
              margin="normal"
              value={transferAddress}
              onChange={(e) => setTransferAddress(e.target.value)}
            />
            <TextField
              label="转账金额（MFT币）"
              fullWidth
              margin="normal"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
            />
            <Button variant="contained" color="secondary" fullWidth onClick={bankTransfer}>
              转账
            </Button>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}

export default App;
