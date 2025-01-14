import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class GetLogInfoDto {
  @IsString()
  player: string;

  @IsString()
  guess: string;

  @IsNumber()
  similarity: number;

  @IsNumber()
  proximity: number;
}
