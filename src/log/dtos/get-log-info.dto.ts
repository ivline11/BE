import { IsString, IsNumber, IsDate } from 'class-validator';

export class GetLogInfoDto {
  @IsString()
  player: string;

  @IsString()
  guess: string;

  @IsNumber()
  similarity: number;

  @IsString()
  proximity: string;

}
