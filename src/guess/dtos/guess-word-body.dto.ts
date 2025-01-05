import { IsString } from 'class-validator';

export class GuessWordBodyDto {

  @IsString()
  word: string; 

  @IsString()
  walletAddress: string; 

  @IsString()
  signature: string; 
}
