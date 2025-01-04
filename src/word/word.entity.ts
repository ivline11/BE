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
import { GameEntity } from '../game/entities/game.entity';

@Entity('word')
export class Word extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255})
  word: string;

  @Column({ type: 'float' })
  similarity: number;

  @Column({ type: 'boolean' , default:'false'})
  isAnswer: boolean;


  @ManyToOne(() => GameEntity, (game) => game.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game: GameEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date; 

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

}