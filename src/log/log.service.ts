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

  async addLog(createLogDto: CreateLogDto): Promise<void> {
    await this.logModel.create(createLogDto);
    await this.redisService.addLog(createLogDto);
  }


  async getLogs(options: CursorBasedPaginationRequestDto): Promise<GetLogInfoDto[]> {
    const { cursor = 0, pageSize = 3 } = options;

    const cachedLogs = await this.redisService.getSortedLogs(cursor, pageSize);

    if (cachedLogs.length < pageSize) {
      const cachedCount = cachedLogs.length;
      const dbCursor = cursor + cachedCount;

      const dbLogs = await this.logModel
        .find()
        .sort({ createdAt: -1 }) 
        .skip(dbCursor)
        .limit(pageSize - cachedCount)
        .exec();

      const logsList = [...cachedLogs, ...dbLogs];

      return logsList.map((log, index) => ({
        player: log.walletAddress,
        guess: log.word,
        similarity: log.similarity,
        proximity: cursor + index + 1, 
      }));
    }

    return cachedLogs.map((log, index) => ({
      player: log.walletAddress,
      guess: log.word,
      similarity: log.similarity,
      proximity: cursor + index + 1, 
    }));
  }

  async clearLogs(): Promise<void> {
    await this.logModel.deleteMany({});
    await this.redisService.clearLogs();
  }
}
