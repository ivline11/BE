import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { CreateLogDto } from 'src/log/dtos/create-log.dto';
import { LogDocument } from 'src/log/log.schema';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly redis: Redis;
  private readonly sortedSetKey = 'logs';

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
    });
  }

  onModuleInit() {
    console.log('RedisService initialized');
  }

  onModuleDestroy() {
    this.redis.disconnect();
    console.log('RedisService disconnected');
  }

  async addLog(createLogDto: CreateLogDto): Promise<void> {
    const log = createLogDto;
    const timestamp = Date.now(); // 최신순 정렬을 위한 타임스탬프 추가
    const logData = JSON.stringify({
      walletAddress: log.walletAddress,
      word: log.word,
      similarity: log.similarity,
    });

    await this.redis.zadd(this.sortedSetKey, timestamp.toString(), logData);
  }
  

  async getSortedLogs(offset: number, limit: number): Promise<LogDocument[]> {
    // 최신순으로 정렬된 로그를 반환
    const logStrings = await this.redis.zrevrange(this.sortedSetKey, offset, offset + limit - 1);

    return logStrings.map((logString) => JSON.parse(logString));
  }

  async cacheLogs(logs: LogDocument[]): Promise<void> {
    const pipeline = this.redis.pipeline();
    logs.forEach((log) => {
      const timestamp = log.createdAt || Date.now(); // 생성 시간
      const logData = JSON.stringify({
        walletAddress: log.walletAddress,
        word: log.word,
        similarity: log.similarity,
      });
      pipeline.zadd(this.sortedSetKey, timestamp.toString(), logData);
    });
    await pipeline.exec();
  }  
}
