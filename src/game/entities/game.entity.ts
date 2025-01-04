import {
    BaseEntity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';

import { Word } from '../../word/word.entity';

@Entity()
export class GameEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255})
  contractAddress: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  prizePool: number;

  @OneToMany(() => Word, (word) => word.game, { cascade: true })
  wordSimilarities: Word[]; 

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date; 

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

}