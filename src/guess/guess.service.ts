import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ethers, hashMessage, verifyMessage } from 'ethers';
import { WordRepository } from '../word/word.repository';
import { GuessWordBodyDto } from './dtos/guess-word-body.dto';
import { GetWordInfoDto } from './dtos/get-word-info.dto';
import { WordService } from '../word/word.service';

@Injectable()
export class GuessService {
  private readonly provider: ethers.JsonRpcProvider;
  private readonly signer: ethers.Wallet;
  private readonly contract: ethers.Contract;

  constructor(
    private readonly wordRepository: WordRepository,
    private readonly wordService: WordService,
  ) {
    // Provider 및 Signer 초기화
    this.provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    this.signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, this.provider);

    // 스마트 컨트랙트 인스턴스 생성
    const contractAbi = [
        {
          "inputs": [],
          "name": "gameEnded",
          "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
          "stateMutability": "view",
          "type": "function",
        },
        {
          "inputs": [{ "internalType": "string", "name": "guessedWord", "type": "string" }],
          "name": "guessWord",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function",
        },
        {
          "inputs": [{ "internalType": "string", "name": "newAnswer", "type": "string" }],
          "name": "setAnswer",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function",
        },
      ];
    const contractAddress = process.env.CONTRACT_ADDRESS as string;
    this.contract = new ethers.Contract(contractAddress, contractAbi, this.signer);


  }

  async guessWord(guessWordBodyDto: GuessWordBodyDto): Promise<GetWordInfoDto> {
    // 1. 게임 상태 확인 및 재시작
    try {
      const gameEnded = await this.contract.gameEnded();
      if (gameEnded) {
        console.log('Game has ended. Restarting the game...');
        const tx = await this.contract.setAnswer('newAnswer');
        await tx.wait();
        console.log('Game restarted with a new answer');
      }
    } catch (error) {
      console.error('Error checking gameEnded status:', error);
      throw new Error('Failed to check gameEnded status');
    }
  
    // 2. 트랜잭션 실행
    const fee = ethers.parseEther(process.env.FEE || '0.01');
    try {
      const tx = await this.contract.guessWord(guessWordBodyDto.word, {
        value: fee,
        gasLimit:  ethers.parseUnits('1000000', 'wei') // 가스 제한 설정
      });
      const receipt = await tx.wait();
      console.log(`Transaction successful: ${receipt.transactionHash}`);
    } catch (error) {
      console.error('Error submitting guessWord transaction:', error);
      throw new Error('Failed to submit guessWord transaction');
    }
  
    // 3. 유사도 반환
    const matchedWord = await this.wordRepository.findWordByValue(guessWordBodyDto.word);
    if (matchedWord) {
      if (matchedWord.isAnswer) {
        await this.wordService.createWordsList();
        return {
          word: matchedWord.word,
          similarity: matchedWord.similarity,
          isAnswer: true,
        };
      } else {
        return {
          word: matchedWord.word,
          similarity: matchedWord.similarity,
          isAnswer: false,
        };
      }
    }
  
    return null;
  }
}