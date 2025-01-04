import { IsString, IsNumber, ValidateNested, IsArray, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class WordDto {
  @IsString()
  word: string;

  @IsNumber()
  similarity: number;

  @IsBoolean()
  isAnswer : boolean;
}

export class CreateWordsListDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WordDto)
  words: WordDto[]; 
}
