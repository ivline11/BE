import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FastApiService } from './fastAPI.service';

@Module({
  imports: [HttpModule], // HttpModule 필요
  providers: [FastApiService],
  exports: [FastApiService], // FastApiService 내보내기
})
export class FastApiModule {}
