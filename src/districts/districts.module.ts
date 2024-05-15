import { Module } from '@nestjs/common';
import { DistrictsService } from './districts.service';
import { DistrictsController } from './districts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { District, DistrictSchema } from './schemas/district.schema';
import { City, CitySchema } from 'src/cities/schemas/city.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: District.name,
        schema: DistrictSchema,
      },
      {
        name: City.name,
        schema: CitySchema,
      },
    ]),
  ],
  controllers: [DistrictsController],
  providers: [DistrictsService],
})
export class DistrictsModule {}
