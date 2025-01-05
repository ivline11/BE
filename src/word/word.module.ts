import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WordService } from './word.service';
import { WordController } from './word.controller';

@Module({
    imports : [HttpModule],
    controllers : [WordController],
    providers: [WordService],
})
export class WordModule{}