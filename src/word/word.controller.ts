import { Body, Controller, Get, Req} from '@nestjs/common';
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
  @Get('words-list')
  async createWordsList(){
    return this.wordService.createWordsList;
  }
}