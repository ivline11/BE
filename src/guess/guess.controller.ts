import { Controller, Body, Param, Post } from '@nestjs/common';
import { GuessWordBodyDto } from './dtos/guess-word-body.dto';
import { GuessService } from './guess.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('guess')
export class GuessController {

  constructor(private readonly guessService: GuessService) {}

  @ApiOperation({
    summary: '단어 예측하기',
    description: '사용자가 단어를 입력하면 유사도 반환',
  })
  @Post('/')
  async guessWord(
    @Body() guessWordBodyDto: GuessWordBodyDto, 
  ) {
    return this.guessService.guessWord(guessWordBodyDto);
  }
}