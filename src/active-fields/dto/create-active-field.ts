import { IsNotEmpty, IsString } from 'class-validator';

export class CreateActiveFieldDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
