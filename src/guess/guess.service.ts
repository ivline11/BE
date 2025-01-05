import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ethers } from 'ethers';
import { WordRepository } from '../word/word.repository';
import { GuessWordBodyDto } from './dtos/guess-word-body.dto';
import { SubmitWordBodyDto } from 'src/guess/dtos/submit-word-body.dto';
import { SubmitService } from 'src/contracts/submit.service';
import { ProofService } from 'src/contracts/proof.service';
import { GetWordInfoDto } from './dtos/get-word-info.dto';

@Injectable()
export class WordService {

    constructor(
        private readonly wordRepository: WordRepository,
        private readonly submitService : SubmitService,
        private readonly proofService : ProofService,
    ){}
  
    async guessWord(guessWordBodyDto : GuessWordBodyDto): Promise<GetWordInfoDto>{
        // 1. 주소 검증 
        const message = `Sign this message to verify your wallet: ${guessWordBodyDto.walletAddress}`;
        const recoveredAddress = ethers.utils.verifyMessage(message, guessWordBodyDto.signature);
        if (recoveredAddress.toLowerCase() !== guessWordBodyDto.walletAddress.toLowerCase()) {
            throw new UnauthorizedException('Invalid signature or address mismatch');
        }

        // 2. 비용 제출 
        const { word, walletAddress, signature } = guessWordBodyDto;
        const fee = '0.01';
        const submitWordBodyDto : SubmitWordBodyDto = {
            walletAddress,
            word,
            fee
        };
        await this.submitService.submitWord(submitWordBodyDto);

        // 3. 유사도 반환    
        const matchedWord = await this.wordRepository.findWordByValue(word);

        if (matchedWord) {
            if (matchedWord.isAnswer) {
                const { proof, publicSignals } = await this.proofService.generateProof(matchedWord.word);
                const isValid = await this.proofService.submitProof(proof,publicSignals);
                if (!isValid) {
                    throw new Error('Proof verification failed.');
                }
                
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
          
    }

}