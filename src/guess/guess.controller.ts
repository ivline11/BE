import { Controller, Body, Param, Post } from '@nestjs/common';
import { GuessWordBodyDto } from './dtos/guess-word-body.dto';
import { GuessService } from './guess.service';

@Controller('guess')
export class GuessController {

  constructor(private readonly guessService: GuessService) {}
  @Post('/:gameId/guess')
  async guessWord(
    @Param('gameId') gameId: number, 
    @Body() guessWordBodyDto: GuessWordBodyDto, 
  ) {
    return this.guessService.guessWord(gameId, guessWordBodyDto);
  }
}