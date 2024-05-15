import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { City } from 'src/cities/schemas/city.schema';
import { District } from 'src/districts/schemas/district.schema';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({ timestamps: true })
export class Company {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  taxCode: string;

  @Prop()
  founding: Date;

  @Prop()
  companySize: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'FieldOfActive' })
  fieldOfActive: string;

  @Prop()
  website: string;

  @Prop()
  logo: string;

  @Prop()
  banner: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'City' })
  city: City;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'District' })
  district: District;

  @Prop()
  address: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
