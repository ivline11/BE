import { Controller, Get, Query } from '@nestjs/common';
import { LogService } from './log.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { GetLogInfoDto } from './dtos/get-log-info.dto';
import { CursorBasedPaginationRequestDto } from './dtos/cursor-based-pagination.dto';

@Controller('logs')
export class LogController {
  constructor(private readonly logService: LogService) {}

  /**
   * 로그 목록 가져오기 (유사도 순 정렬 및 무한 스크롤 지원)
   * @param offset - 조회 시작 인덱스
   * @param limit - 가져올 로그 개수
   */
    @ApiOperation({
      summary: '로그 목록 가져오기 ',
      description: 'offset / limit ',
    })
    @ApiOkResponse({
      description: '성공 ',
    })
  @Get()
  async getLogs(
    @Query() options: CursorBasedPaginationRequestDto,
  ): Promise<GetLogInfoDto[]> {
    return this.logService.getLogs(options);
  }
}
