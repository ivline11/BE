import { IsString, IsNotEmpty, IsNumberString } from 'class-validator';

export class SubmitWordBodyDto {
  @IsString()
  @IsNotEmpty()
  walletAddress: string; 

  @IsString()
  @IsNotEmpty()
  word: string; 

  @IsNumberString()
  @IsNotEmpty()
  fee: string;
}
