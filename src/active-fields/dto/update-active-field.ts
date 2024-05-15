import { PartialType } from '@nestjs/mapped-types';
import { CreateActiveFieldDto } from './create-active-field';

export class UpdateActiveFieldDto extends PartialType(CreateActiveFieldDto) {}
