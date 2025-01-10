import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type LogDocument = HydratedDocument<Log>;
@Schema({
  collection: 'log', 
})
export class Log extends Document {

  @Prop({ type: String, required: true })
  walletAddress: string; 

  @Prop({ type: String, required: true })
  word: string; 

  @Prop({ type: Number, required: true })
  similarity: number; 

  @Prop({ type: Date, default: Date.now })
  createdAt: Date; 
}

export const LogSchema = SchemaFactory.createForClass(Log);
