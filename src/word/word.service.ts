import { Injectable } from '@nestjs/common';
import { WordRepository } from './word.repository';
import { CreateWordsListDto } from './dtos/create-words-list.dto';
import { Word } from './word.entity';


@Injectable()
export class WordService{
    constructor(private readonly wordRepository : WordRepository ){

    }

    async saveWords (createWordsListDto : CreateWordsListDto): Promise<Word[]> {
        const wordsList = createWordsListDto.words.map((wordDto) => {
            const word = new Word();
            word.word = wordDto.word;
            word.similarity = wordDto.similarity;
            word.isAnswer = wordDto.isAnswer;
            return word;
        });
        return this.wordRepository.save(wordsList);
    }
}