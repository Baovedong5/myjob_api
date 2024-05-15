import { Module } from '@nestjs/common';
import { ActiveFieldsService } from './active-fields.service';
import { ActiveFieldsController } from './active-fields.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ActiveField, ActiveFieldSchema } from './schemas/active-field.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: ActiveField.name,
      schema: ActiveFieldSchema
    }])
  ],
  controllers: [ActiveFieldsController],
  providers: [ActiveFieldsService],
})
export class ActiveFieldsModule {}
