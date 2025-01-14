import {
  IsString,
  IsNumber,
  ValidateNested,
  IsArray,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

// 단어와 유사도 정보 DTO
export class WordDto {
  @IsString()
  word: string; // 단어

  @IsNumber()
  similarity: number; // 유사도
}

// 정답 단어 DTO
export class AnswerDto {
  @IsString()
  word: string; // 선택된 단어
}

// 전체 응답 DTO
export class CreateWordsListDto {
  @ValidateNested()
  @Type(() => AnswerDto)
  answer: AnswerDto; // 정답 단어 정보

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WordDto)
  similar_words: WordDto[]; // 유사 단어 목록
}
