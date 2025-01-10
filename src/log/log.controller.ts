import { Controller, Get, Query } from '@nestjs/common';
import { LogService } from './log.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { GetLogInfoDto } from './dtos/get-log-info.dto';
import { CursorBasedPaginationRequestDto } from './dtos/cursor-based-pagination.dto';

@Controller('logs')
export class LogController {
  constructor(private readonly logService: LogService) {}

    @ApiOperation({
      summary: '로그 목록 가져오기 ',
      description: 'cursor / pageSize ',
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
