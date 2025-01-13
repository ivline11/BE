import { Injectable } from '@nestjs/common';
import { JsonRpcProvider, Wallet, Contract, parseEther } from 'ethers';
import { WordRepository } from '../word/word.repository';
import { GuessWordBodyDto } from './dtos/guess-word-body.dto';
import { GetWordInfoDto } from './dtos/get-word-info.dto';
import { WordService } from '../word/word.service';
import { LogService } from '../log/log.service';
import { feeContractAbi } from '../contracts/abi/fee-contract.abi';
import { Word } from '../word/word.entity';
import { ProofService } from 'src/proof/proof.service';

@Injectable()
export class GuessService {
  private readonly provider: JsonRpcProvider;
  private readonly signer: Wallet;
  private readonly contract: Contract;

  constructor(
    private readonly wordRepository: WordRepository,
    private readonly wordService: WordService,
    private readonly logService: LogService,
    private readonly proofService: ProofService,
  ) {
    const contractAddress = process.env.CONTRACT_ADDRESS as string;
    this.provider = new JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    this.signer = new Wallet(process.env.PRIVATE_KEY as string, this.provider);
    this.contract = new Contract(contractAddress, feeContractAbi, this.signer);
  }

  async guessWord(guessWordBodyDto: GuessWordBodyDto): Promise<GetWordInfoDto> {
    const { word, walletAddress } = guessWordBodyDto;

    console.log("Start guessWord function"); // 시작 지점 로그
    console.log("Received data:", { word, walletAddress });

    // 1. 게임 상태 확인
    await this.checkAndInitializeGame();
    console.log("check")

    // 2. 비용 제출 및 proof 생성
    await this.generateProof(word);
    console.log("proof generated")

    // 3. 단어 찾기
    const matchedWord = await this.wordRepository.findWordByValue(word);

    // 4. 로그 생성
    const log = this.createLog(walletAddress, matchedWord || { word, similarity: 0, isAnswer: false } as Word);
    console.log("Created log...");
    console.log("Saving log to database...");
    await this.logService.addLog(log);
    console.log("Log saved successfully.");

    // 5. 정답 확인 및 게임 초기화
    if (matchedWord?.isAnswer) {
      await this.initializeNewGame();
      console.log("Matched word is the answer. Initializing new game...");
    }

    // 6. 유사도 반환
    console.log("Getting word info...");
    return this.getWordInfo(matchedWord, word);
  }

  /**
   * 게임 상태 확인 및 초기화
   */
  private async checkAndInitializeGame(): Promise<void> {
    try {
      const gameEnded: boolean = await this.contract.gameEnded();
      console.log('Game ended status:', gameEnded);

      if (gameEnded) {
        console.log('Game ended. Initializing new game...');
        await this.initializeNewGame();
      }
    } catch (error) {
      console.error('Error checking game state:', error);
      throw new Error('Failed to check game state');
    }
  }

  /**
   * 새로운 게임 초기화
   */
  private async initializeNewGame(): Promise<void> {
    try {
      await this.clearDatabases();
      const newGame = await this.wordService.createWordsList();
      const tx = await this.contract.setAnswer(newGame, {
        gasLimit: 100_000,
      });
      const receipt = await tx.wait();
      console.log('New answer set in contract:', receipt.transactionHash);
    } catch (error) {
      console.error('Error initializing new game:', error);
      throw new Error('Failed to initialize new game');
    }
  }

  /**
   * 증명 생성
   */
  private async generateProof(word: string): Promise<string> {
    try {
      return await this.proofService.generateProof(word);
    } catch (error) {
      console.error('Error generating proof:', error);
      throw new Error('Proof generation failed');
    }
  }

  /**
   * 유사도 데이터 생성
   */
  private getWordInfo(word: Word | null, inputWord: string): GetWordInfoDto {
    return {
      word: word?.word || inputWord,
      similarity: word?.similarity || 0,
      isAnswer: word?.isAnswer || false,
    };
  }

  /**
   * 로그 생성
   */
  private createLog(walletAddress: string, word: Word | null) {
    if (!word || !word.word) {
      throw new Error('Cannot create log without a valid word.');
    }
  
    return {
      walletAddress,
      word: word.word,
      similarity: word.similarity || 0,
    };
  }

  /**
   * wordDB와 logDB 초기화
   */
  private async clearDatabases(): Promise<void> {
    try {
      await this.wordRepository.clearWords();
      await this.logService.clearLogs();
    } catch (error) {
      console.error('Error clearing databases:', error);
      throw new Error('Failed to clear databases');
    }
  }
}
