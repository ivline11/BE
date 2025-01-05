import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService} from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameModule } from './game/game.module';
import { LogModule } from './database/log.module';
import {GuessModule} from './guess/guess.module';
import { WordModule } from './word/word.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Word } from './word/word.entity';
import { Game } from './game/game.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<'string'>('MONGO_URI'),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        entities: [Word,Game],
        synchronize: process.env.DB_SYNC === 'true',
    }),
    LogModule,
    WordModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
