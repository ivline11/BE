import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema} from './log.schema'
import { RedisModule } from 'src/utils/redis/redis.module';
import { LogService } from './log.service';
import { LogController } from './log.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
    RedisModule,
  ],
  controllers : [LogController],
  providers: [LogService],
  exports: [MongooseModule,LogService],
})
export class LogModule {}