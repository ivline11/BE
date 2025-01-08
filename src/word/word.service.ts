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
          const { answer, similar_words } = await this.fastApiService.generateWordsList();
          console.log()
    
          // 단어 리스트 생성
          const wordsList = similar_words.map(({ word, similarity }) => {
            const wordEntity = new Word();
            wordEntity.word = word;
            wordEntity.similarity = similarity;
            wordEntity.isAnswer = false; 
            return wordEntity;
          });
          console.log("list" , wordsList);
    
          // 정답 단어 추가
          const answerEntity = new Word();
          answerEntity.word = answer.word;
          answerEntity.similarity = 100;
          answerEntity.isAnswer = true;
    
          // 단어 저장
          await this.wordRepository.saveWordsList([...wordsList, answerEntity]);
    
          return response(BaseResponse.CREATE_WORDS_LIST_SUCCESS);
        } catch (error) {
          console.error(error);
          return errResponse(BaseResponse.CREATE_WORDS_LIST_FAILED);
        }
    }
}