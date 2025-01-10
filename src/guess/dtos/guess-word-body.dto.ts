import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GuessWordBodyDto {
  @ApiProperty({ description: '추측한 단어', example: 'apple' })
  @IsString()
  word: string;

  @ApiProperty({ description: '사용자의 지갑 주소', example: '0x1234567890abcdef1234567890abcdef12345678' })
  @IsString()
  walletAddress: string;
}
