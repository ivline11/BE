import { Body, Controller, Post, Req} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { WordService } from './word.service';
import { CreateWordsListDto } from './dtos/create-words-list.dto';

@Controller('word')
export class WordController {

  constructor(private readonly wordService: WordService) {}

  @ApiOperation({
    summary: '단어 목록 생성하기',
    description: '단어와 유사도 저장',
  })
  @ApiOkResponse({
    description: '성공 ',
  })
  @Post('words-list')
  async createWordsList(
    @Body() body: CreateWordsListDto,
  ){
    const result = await this.wordService.saveWords(body);
    return result;
  }
}