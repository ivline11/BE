import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WordService } from './word.service';
import { WordController } from './word.controller';
import { WordRepository } from './word.repository';
import { FastApiModule } from '../utils/swagger/fastAPI/fastAPI.module';

@Module({
    imports : [HttpModule,FastApiModule],
    controllers : [WordController],
    providers: [WordService,WordRepository],
})
export class WordModule{}