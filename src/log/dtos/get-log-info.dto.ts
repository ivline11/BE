import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class GetLogInfoDto {
  @IsString()
  walletAddress: string;

  @IsString()
  word: string;

  @IsNumber()
  similarity: number;

  @IsNumber()
  rank: number;
}
