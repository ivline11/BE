import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import {Game} from "./game.entity"

@Injectable()
export class GameRepository extends Repository<Game>{
    constructor(dataSource: DataSource) {
        super(Game, dataSource.createEntityManager());
    }

    async findGameById(gameId: number): Promise<Game | null> {
        return this.findOne({ where: { id: gameId } });
      }
}