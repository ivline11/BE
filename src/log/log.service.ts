import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from './log.schema';
import { RedisService } from '../utils/redis/redis.service';
import { CreateLogDto } from './dtos/create-log.dto';
import { GetLogInfoDto } from './dtos/get-log-info.dto';
import { CursorBasedPaginationRequestDto } from './dtos/cursor-based-pagination.dto';

@Injectable()
export class LogService {
  constructor(
    @InjectModel(Log.name) private readonly logModel: Model<LogDocument>,
    private readonly redisService: RedisService,
  ) {}

  /**
   * 로그 추가 및 Redis 갱신
   * @param log - 새로 추가된 로그 데이터
   */
  async addLog(createLogDto : CreateLogDto): Promise<void> {
    // MongoDB에 로그 저장
    await this.logModel.create(createLogDto);

    // Redis에 로그 추가
    await this.redisService.addLog(createLogDto);
  }

  /**
   * 유사도 기준으로 정렬된 로그 가져오기
   * @param offset - 조회 시작 인덱스
   * @param limit - 가져올 로그 개수
   */
  async getLogs(options: CursorBasedPaginationRequestDto): Promise<GetLogInfoDto[]> {
    const { cursor = 0, pageSize = 3 } = options;
  
    // Redis에서 데이터를 가져옴
    const cachedLogs = await this.redisService.getSortedLogs(cursor, pageSize);
  
    // Redis에 캐시된 데이터가 부족한 경우
    if (cachedLogs.length < pageSize) {
      const cachedCount = cachedLogs.length;
      const dbCursor = cursor + cachedCount;
  
      // DB에서 나머지 데이터를 가져오기
      const dbLogs = await this.logModel
        .find()
        .sort({ similarity: -1 })
        .skip(dbCursor)
        .limit(pageSize - cachedCount)
        .exec();
  
      // Redis 캐시 데이터와 DB 데이터를 병합
      const logsList = [...cachedLogs, ...dbLogs];
  
      // DTO 형식으로 변환하여 반환
      return logsList.map((log, index) => ({
        walletAddress: log.walletAddress,
        word: log.word,
        similarity: log.similarity,
        rank: cursor + index + 1, // 순위 계산
        isAnswer: log.isCorrect,
      }));
    }
  
    // Redis에서 가져온 데이터만 반환
    return cachedLogs.map((log, index) => ({
      walletAddress: log.walletAddress,
      word: log.word,
      similarity: log.similarity,
      rank: cursor + index + 1, // 순위 계산
      isAnswer: log.isCorrect,
    }));
  }
  
}
