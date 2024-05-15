import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { City } from 'src/cities/schemas/city.schema';

export type DistrictDocument = HydratedDocument<District>;

@Schema({ timestamps: true })
export class District {
  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'City' })
  city: City;

  @Prop()
  deletedAt: Date;
}

export const DistrictSchema = SchemaFactory.createForClass(District);
