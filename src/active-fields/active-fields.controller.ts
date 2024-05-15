import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ActiveFieldsService } from './active-fields.service';
import { ResponseMessage } from 'src/decorators/customize';
import { CreateActiveFieldDto } from './dto/create-active-field';
import { UpdateActiveFieldDto } from './dto/update-active-field';

@Controller('active-fields')
export class ActiveFieldsController {
  constructor(private readonly activeFieldsService: ActiveFieldsService) {}

  @Post()
  @ResponseMessage('Active field created successfully')
  create(@Body() createActiveFieldDto: CreateActiveFieldDto) {
    return this.activeFieldsService.create(createActiveFieldDto);
  }

  @Get()
  @ResponseMessage('List pagination active field')
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query() qs: string,
  ) {
    return this.activeFieldsService.findAll(+page, +limit, qs);
  }

  @Patch(':id')
  @ResponseMessage('Active field updated successfully')
  update(
    @Param('id') id: string,
    @Body() updateActiveFieldDto: UpdateActiveFieldDto,
  ) {
    return this.activeFieldsService.update(id, updateActiveFieldDto);
  }
}
