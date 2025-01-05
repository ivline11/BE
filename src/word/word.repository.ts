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
}