import {Controller, Get} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { WordService } from './word.service';

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
    const result = await this.wordService.createWordsList();
    return result;
  }
}