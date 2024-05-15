import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ActiveFieldDocument = HydratedDocument<ActiveField>;

@Schema({ timestamps: true })
export class ActiveField {
  @Prop()
  name: string;

  @Prop()
  deletedAt: Date;
}

export const ActiveFieldSchema = SchemaFactory.createForClass(ActiveField);
