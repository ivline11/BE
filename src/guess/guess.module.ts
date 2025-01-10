import { Module } from '@nestjs/common';
import { GuessService } from './guess.service';
import { GuessController } from './guess.controller';
import { WordRepository } from 'src/word/word.repository';
import { GameModule } from 'src/game/game.module';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { SubmitService } from 'src/contracts/submit.service';
import { ProofService } from 'src/contracts/proof.service';
import { WordService } from 'src/word/word.service';
import { SubmitService } from 'src/contracts/submit.service';
import { FastApiModule } from 'src/utils/fastAPI/fastAPI.module';
import { Log, LogSchema } from '../log/log.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { LogModule } from 'src/log/log.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([WordRepository]), 
        FastApiModule,
        GameModule, 
        LogModule,
      ],
    controllers: [GuessController],
    providers: [GuessService,SubmitService, ProofService, WordService,WordRepository],
})
export class GuessModule {}