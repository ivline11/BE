import { IsString ,IsBoolean, IsNumber } from 'class-validator';

export class GetWordInfoDto {

  @IsString()
  word: string; 

  @IsNumber()
  similarity: number; 

  @IsBoolean()
  isAnswer : boolean;
}
