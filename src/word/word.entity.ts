import {
    BaseEntity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { Game } from '../game/game.entity';

@Entity('word')
export class Word extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255})
  word: string;

  @Column({ type: 'float' })
  similarity: number;

  @Column({ type: 'boolean'})
  isAnswer: boolean;

  @ManyToOne(() => Game, (game) => game.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date; 

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

}