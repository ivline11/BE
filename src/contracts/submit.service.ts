import { Injectable } from '@nestjs/common';
import { JsonRpcProvider, Wallet, Contract, parseEther } from 'ethers';
import * as abi from './abi/guess-contract.abi.json';
import { SubmitWordBodyDto } from 'src/guess/dtos/submit-word-body.dto';

@Injectable()
export class SubmitService {
  private readonly provider: JsonRpcProvider;
  private readonly contractAddress: string;
  private readonly signer: Wallet;
  private readonly contract: Contract;

  constructor() {
    this.provider = new JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    this.contractAddress = process.env.CONTRACT_ADDRESS || '';
    const privateKey = process.env.PRIVATE_KEY || '';

    if (!privateKey) {
      throw new Error('Private key is not defined in environment variables');
    }

    this.signer = new Wallet(privateKey, this.provider);
    this.contract = new Contract(this.contractAddress, abi, this.signer);
  }

  async submitWord(submitWordBodyDto: SubmitWordBodyDto): Promise<void> {
    try {
      // 스마트 컨트랙트의 submitWord 함수 호출
      const tx = await this.contract.submitWord(submitWordBodyDto.word, {
        value: parseEther(submitWordBodyDto.fee), // 전송 비용 (ethers.utils 대신 parseEther 사용)
      });

      // 트랜잭션 완료 대기
      await tx.wait();
    } catch (error) {
      console.error('Error submitting word:', error);
      throw new Error('Failed to submit word');
    }
  }
}
