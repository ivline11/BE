import { Module } from '@nestjs/common';
import { GuessService } from './guess.service';
import { GuessController } from './guess.controller';
import { WordRepository } from 'src/word/word.repository';
import { GameModule } from 'src/game/game.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordService } from 'src/word/word.service';
import { ProofService } from 'src/proof/proof.service';
import { FastApiModule } from 'src/utils/fastAPI/fastAPI.module';
import { LogModule } from 'src/log/log.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([WordRepository]), 
        FastApiModule,
        GameModule, 
        LogModule,
      ],
    controllers: [GuessController],
    providers: [GuessService,ProofService, WordService,WordRepository],
})
export class GuessModule {}