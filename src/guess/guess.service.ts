import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ethers,recoverAddress } from 'ethers';
import { WordRepository } from '../word/word.repository';
import { GuessWordBodyDto } from './dtos/guess-word-body.dto';
import { SubmitWordBodyDto } from 'src/guess/dtos/submit-word-body.dto';
import { SubmitService } from 'src/contracts/submit.service';
import { ProofService } from 'src/contracts/proof.service';
import { GetWordInfoDto } from './dtos/get-word-info.dto';
import { WordService } from 'src/word/word.service';
import { GameRepository } from 'src/game/game.repository';

@Injectable()
export class GuessService {

    constructor(
        private readonly wordRepository: WordRepository,
        private readonly gameRepository: GameRepository,
        private readonly submitService : SubmitService,
        private readonly proofService : ProofService,
        private readonly wordService : WordService,
    ){}
  
    async guessWord(gameId : number, guessWordBodyDto : GuessWordBodyDto): Promise<GetWordInfoDto>{
        const { word, walletAddress, signature } = guessWordBodyDto;

        // 1. 주소 검증 
        const message = `Sign this message to verify your wallet: ${guessWordBodyDto.walletAddress}`;
        const recoveredAddress = recoverAddress(message, guessWordBodyDto.signature);
        if (recoveredAddress.toLowerCase() !== guessWordBodyDto.walletAddress.toLowerCase()) {
            throw new UnauthorizedException('Invalid signature or address mismatch');
        }

        const currentGame = await this.gameRepository.findOne({ where: { id: gameId } });
        if (!currentGame) {
            throw new Error('Game not found');
        }

        // 2. 비용 제출 
        const fee = process.env.FEE;
        const submitWordBodyDto : SubmitWordBodyDto = {
            walletAddress,
            signature,
            word,
            fee
        };
        await this.submitService.submitWord(currentGame.contractAddress,  submitWordBodyDto);

        // 3. 유사도 반환    
        const matchedWord = await this.wordRepository.findWordByValue(word);

        if (matchedWord) {
            if (matchedWord.isAnswer) {
                const { proof, publicSignals } = await this.proofService.generateProof(matchedWord.word);
                const isValid = await this.proofService.submitProof(proof,publicSignals);
                if (!isValid) {
                    throw new Error('Proof verification failed.');
                }
                await this.wordService.createWordsList();
                return {
                    word,
                    similarity: matchedWord.similarity,
                    isAnswer: true,
                };
                } else {
                    return {
                        word,
                        similarity: matchedWord.similarity,
                        isAnswer: false,
                };
            }
        } 
        return null;        
    }
}