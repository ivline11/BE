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

  async addLog(createLogDto : CreateLogDto): Promise<void> {
    const log = createLogDto;
    const logData = JSON.stringify({
      walletAddress: log.walletAddress,
      word: log.word,
      similarity: log.similarity,
    });

    await this.redis.zadd(this.sortedSetKey, log.similarity, logData);
  }

  async getSortedLogs(offset: number, limit: number): Promise<LogDocument[]> {
    const logStrings = await this.redis.zrevrange(this.sortedSetKey, offset, offset + limit - 1);

    return logStrings.map((logString) => JSON.parse(logString));
  }

  async cacheLogs(logs: LogDocument[]): Promise<void> {
    const pipeline = this.redis.pipeline();
    logs.forEach((log) => {
      const logData = JSON.stringify({
        walletAddress: log.walletAddress,
        word: log.word,
        similarity: log.similarity,
        createdAt: log.createdAt,
      });
      pipeline.zadd(this.sortedSetKey, log.similarity, logData);
    });
    await pipeline.exec();
  }

  async clearCache(): Promise<void> {
    await this.redis.del(this.sortedSetKey);
  }
}
