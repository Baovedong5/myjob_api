import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DistrictsService } from './districts.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { ResponseMessage } from 'src/decorators/customize';

@Controller('districts')
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Post()
  @ResponseMessage('District created successfully')
  create(@Body() createDistrictDto: CreateDistrictDto) {
    return this.districtsService.create(createDistrictDto);
  }

  @Get()
  @ResponseMessage('Get list of districts successfully')
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query() qs: string,
  ) {
    return this.districtsService.findAll(+page, +limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.districtsService.findOne(id);
  }

  @Get('/by-city/:id')
  findByCity(@Param('id') id: string) {
    return this.districtsService.findByCity(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDistrictDto: UpdateDistrictDto,
  ) {
    return this.districtsService.update(id, updateDistrictDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.districtsService.remove(id);
  }
}
