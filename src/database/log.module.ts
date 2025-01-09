import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema} from '../game/schemas/log.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
  ],
  exports: [MongooseModule],
})
export class LogModule {}