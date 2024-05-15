import {
  IsDate,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  taxCode: string;

  @IsOptional()
  @IsDate()
  founding: Date;

  @IsNotEmpty()
  companySize: number;

  @IsMongoId()
  @IsOptional()
  fieldOfActive: string;

  @IsOptional()
  @IsString()
  website: string;

  @IsNotEmpty()
  @IsMongoId()
  city: string;

  @IsNotEmpty()
  @IsMongoId()
  district: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
