import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import {Word} from "./word.entity"

@Injectable()
export class WordRepository extends Repository<Word>{
    constructor(dataSource: DataSource) {
        super(Word, dataSource.createEntityManager());
    }

    async findWordByValue(word: string): Promise<Word | null> {
        return this.findOne({ where: { word } });
    }

    async saveWordsList(wordsList: Word[]): Promise<void> {
        await this.save(wordsList);
        console.log('Words saved successfully');
    }

    async clearWords(): Promise<void> {
        await this.clear();
    }
}