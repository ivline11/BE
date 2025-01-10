import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateLogDto {
  @IsString()
  walletAddress: string;

  @IsString()
  word: string;

  @IsNumber()
  similarity: number;
}
