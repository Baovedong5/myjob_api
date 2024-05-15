import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateDistrictDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsMongoId()
  city: string;
}
