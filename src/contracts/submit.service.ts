import { Injectable } from '@nestjs/common';
import { JsonRpcProvider, Wallet, parseEther, Contract } from 'ethers';
import { SubmitWordBodyDto } from 'src/guess/dtos/submit-word-body.dto';

@Injectable()
export class SubmitService {
  private readonly provider: JsonRpcProvider;

  constructor() {
    this.provider = new JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
  }

  async submitWord(contractAddress: string, submitWordBodyDto: SubmitWordBodyDto): Promise<void> {
    try {
      // ABI를 코드 안에 직접 작성
      const abi = [
        {
          "inputs": [
            { "internalType": "string", "name": "word", "type": "string" }
          ],
          "name": "submitWord",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        }
      ];

      // 컨트랙트 인스턴스 생성
      const contract = new Contract(contractAddress, abi, this.provider);

      // submitWord 호출
      const tx = await contract.submitWord(submitWordBodyDto.word, {
        value: parseEther(submitWordBodyDto.fee), // 입력받은 금액을 wei 단위로 변환
      });

      // 트랜잭션 완료 대기
      await tx.wait();
      console.log('Transaction successfully submitted:', tx.hash);
    } catch (error) {
      console.error('Error submitting word:', error);
      throw new Error('Failed to submit word');
    }
  }
}
