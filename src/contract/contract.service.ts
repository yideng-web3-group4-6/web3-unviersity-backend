// src/contract/contract.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ethers, providers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import * as tokenAbi from './YiDengToken.json';

@Injectable()
export class ContractService {
  private provider: providers.JsonRpcProvider;
  private signer: ethers.Signer;
  private contract: ethers.Contract;
  private logger = new Logger(ContractService.name);

  constructor() {
    const rpcUrl = process.env.RPC_URL;
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const privateKey = process.env.PRIVATE_KEY;

    if (!rpcUrl || !contractAddress || !privateKey) {
      this.logger.error(
        '环境变量 RPC_URL, CONTRACT_ADDRESS 或 PRIVATE_KEY 未配置',
      );
      throw new Error('缺少区块链配置参数');
    }

    this.provider = new providers.JsonRpcProvider(rpcUrl);
    this.signer = new ethers.Wallet(privateKey, this.provider);
    this.contract = new ethers.Contract(
      contractAddress,
      tokenAbi.abi,
      this.signer,
    );
  }

  async buyCourseWithETH(ethAmount: string): Promise<any> {
    try {
      const tx = await this.contract.buyWithETH({
        value: parseEther(ethAmount),
      });
      this.logger.log(`交易发送成功，txHash: ${tx.hash}`);
      const receipt = await tx.wait();
      this.logger.log(`交易确认，txHash: ${receipt.transactionHash}`);
      return receipt;
    } catch (error) {
      this.logger.error(`合约调用出错: ${error}`);
      throw error;
    }
  }
}
