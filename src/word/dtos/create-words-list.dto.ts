import { IsString, IsNumber, ValidateNested, IsArray, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class WordDto {
  @IsString()
  word: string;

  @IsNumber()
  similarity: number;
}

export class CreateWordsListDto {
  @ValidateNested()
  @Type(() => WordDto)
  answer: WordDto; // 정답 단어 및 유사도

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WordDto)
  similar_words:WordDto[]; // 유사 단어 목록
}
