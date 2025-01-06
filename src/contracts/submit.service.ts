import { Injectable } from '@nestjs/common';
import { JsonRpcProvider, Wallet, Contract, parseEther } from 'ethers';
import * as abi from './abi/guess-contract.abi.json';
import { SubmitWordBodyDto } from 'src/guess/dtos/submit-word-body.dto';

@Injectable()
export class SubmitService {
  private readonly provider: JsonRpcProvider;
  private readonly signer: Wallet;

  constructor() {
    this.provider = new JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    this.signer = new Wallet(process.env.PRIVATE_KEY!, this.provider);
  }

  async submitWord(contractAddress: string, submitWordBodyDto: SubmitWordBodyDto): Promise<void> {
    try {
      // 스마트 컨트랙트의 submitWord 함수 호출
      const contract = new Contract(contractAddress, abi, this.signer);
      const tx = await contract.submitWord(submitWordBodyDto.word, {
        value: parseEther(submitWordBodyDto.fee), 
      });

      // 트랜잭션 완료 대기
      await tx.wait();
    } catch (error) {
      console.error('Error submitting word:', error);
      throw new Error('Failed to submit word');
    }
  }
}
