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
        private readonly gameRepository : GameRepository,
        private readonly fastApiService: FastApiService,
     ){}

    async createWordsList (){
        try {
            const selectedWord = await this.fastApiService.selectWord();

            const similarWords = await this.fastApiService.getSimilarWords(selectedWord);

            const wordsList = similarWords.map(({ word, similarity }) => {
              const wordEntity = new Word();
              wordEntity.word = word;
              wordEntity.similarity = similarity;
              return wordEntity;
            });

            await this.wordRepository.save(wordsList);
            return response(BaseResponse.CREATE_WORDS_LIST_SUCCESS);

        } catch (error) {
            console.error(error);
            return errResponse(BaseResponse.CREATE_WORDS_LIST_FAILED);
        }
    }
}