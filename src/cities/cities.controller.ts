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
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { ResponseMessage } from 'src/decorators/customize';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  @ResponseMessage('City created successfully')
  create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  @Get()
  @ResponseMessage('List pagination city')
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query() qs: string,
  ) {
    return this.citiesService.findAll(+page, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Get city by id successfully')
  findOne(@Param('id') id: string) {
    return this.citiesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('City updated successfully')
  update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.citiesService.update(id, updateCityDto);
  }

  @Delete(':id')
  @ResponseMessage('City deleted successfully')
  remove(@Param('id') id: string) {
    return this.citiesService.remove(id);
  }
}
