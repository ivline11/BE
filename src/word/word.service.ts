import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { FastApiService } from 'src/utils/swagger/fastAPI/fastAPI.service';
import { WordRepository } from './word.repository';
import { CreateWordsListDto } from './dtos/create-words-list.dto';
import { Word } from './word.entity';
import { Game } from '../game/game.entity';
import {response,errResponse } from '../response/response';
import { BaseResponse } from '../response/response.status';
import { GameRepository } from 'src/game/game.repository';


@Injectable()
export class WordService{
    
    constructor(
        private readonly wordRepository : WordRepository,
        private readonly fastApiService: FastApiService,
     ){}

     async createWordsList() {
        try {
          // FastAPI에서 단어 가져오기
          const selectedWord = await this.fastApiService.selectWord();
          const similarWords = await this.fastApiService.getSimilarWords(selectedWord);
    
          // 단어 리스트 생성
          const wordsList = similarWords.map(({ word, similarity }) => {
            const wordEntity = new Word();
            wordEntity.word = word;
            wordEntity.similarity = similarity;
            wordEntity.isAnswer = false; 
            return wordEntity;
          });
    
          // 정답 단어 추가
          const selectedWordEntity = new Word();
          selectedWordEntity.word = selectedWord;
          selectedWordEntity.similarity = 100;
          selectedWordEntity.isAnswer = true;
    
          // 단어 저장
          await this.wordRepository.saveWordsList([...wordsList, selectedWordEntity]);
    
          return response(BaseResponse.CREATE_WORDS_LIST_SUCCESS);
        } catch (error) {
          console.error(error);
          return errResponse(BaseResponse.CREATE_WORDS_LIST_FAILED);
        }
    }
}