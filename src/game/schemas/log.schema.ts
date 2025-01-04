import { Schema as MongooseSchema, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type LogDocument = HydratedDocument<Log>;
@Schema({
  collection: 'log', 
})
export class Log extends Document {
  @Prop({ type: String, required: true })
  gameId: string; 

  @Prop({ type: String, required: true })
  userId: string; 

  @Prop({ type: String, required: true })
  guessedWord: string; 

  @Prop({ type: Number, required: true })
  similarity: number; 

  @Prop({ type: Boolean, required: true })
  isCorrect: boolean; 

  @Prop({ type: Date, default: Date.now })
  createdAt: Date; 
}

export const LogSchema = SchemaFactory.createForClass(Log);
