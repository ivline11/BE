import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { CreateLogDto } from 'src/log/dtos/create-log.dto';
import { LogDocument } from 'src/log/log.schema';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly redis: Redis;
  private readonly sortedSetKey = 'logs';

  constructor() {
    // Redis 클라이언트 초기화
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

  /**
   * Redis에 로그 추가 및 유사도 정렬 유지
   * @param log - 새로 추가된 로그
   */
  async addLog(createLogDto : CreateLogDto): Promise<void> {
    const log = createLogDto;
    const logData = JSON.stringify({
      walletAddress: log.walletAddress,
      guess: log.word,
      similarity: log.similarity,
      isCorrect: log.isAnswer,
    });

    await this.redis.zadd(this.sortedSetKey, log.similarity, logData);
  }

  /**
   * Redis에서 정렬된 로그 목록 가져오기
   * @param offset - 조회 시작 인덱스
   * @param limit - 가져올 로그 개수
   */
  async getSortedLogs(offset: number, limit: number): Promise<LogDocument[]> {
    const logStrings = await this.redis.zrevrange(this.sortedSetKey, offset, offset + limit - 1);

    return logStrings.map((logString) => JSON.parse(logString));
  }

  /**
   * Redis에 로그를 일괄 캐싱
   * @param logs - MongoDB에서 가져온 로그 목록
   */
  async cacheLogs(logs: LogDocument[]): Promise<void> {
    const pipeline = this.redis.pipeline();
    logs.forEach((log) => {
      const logData = JSON.stringify({
        walletAddress: log.walletAddress,
        guess: log.word,
        similarity: log.similarity,
        isCorrect: log.isCorrect,
        createdAt: log.createdAt,
      });
      pipeline.zadd(this.sortedSetKey, log.similarity, logData);
    });
    await pipeline.exec();
  }

  /**
   * Redis 캐시 초기화
   */
  async clearCache(): Promise<void> {
    await this.redis.del(this.sortedSetKey);
  }
}
