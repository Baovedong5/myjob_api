import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { InjectModel } from '@nestjs/mongoose';
import { City, CityDocument } from './schemas/city.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class CitiesService {
  constructor(
    @InjectModel(City.name)
    private cityModel: SoftDeleteModel<CityDocument>,
  ) {}

  async create(createCityDto: CreateCityDto) {
    const { name } = createCityDto;

    const checkCity = await this.cityModel.findOne({ name }).exec();

    if (checkCity) {
      throw new BadRequestException('City is already existed');
    }

    const newCity = await this.cityModel.create({ name });

    return newCity;
  }

  async findAll(page: number, limit: number, qs: string) {
    const { filter, sort } = aqp(qs);

    delete filter.page;
    delete filter.limit;

    let offset = (page - 1) * limit;
    let defaultLimit = limit ? limit : 10;

    const totalItems = (await this.cityModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.cityModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .exec();

    return {
      meta: {
        current: page,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid city id');
    }

    const checkCity = await this.cityModel.findOne({ _id: id }).exec();

    if (!checkCity) {
      throw new BadRequestException('City not found');
    }

    return checkCity;
  }

  async update(id: string, updateCityDto: UpdateCityDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid city id');
    }

    const { name } = updateCityDto;

    const checkCity = await this.cityModel.findOne({ _id: id }).exec();

    if (!checkCity) {
      throw new BadRequestException('City not found');
    }

    //check name is existed in database ?
    if (name && name !== checkCity.name) {
      const checkName = await this.cityModel.findOne({
        name,
        _id: { $ne: id },
      });

      if (checkName) {
        throw new BadRequestException('The name of city is existed');
      }
    }

    const updated = await this.cityModel
      .findByIdAndUpdate(id, { name }, { new: true })
      .exec();

    return updated;
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid city id');
    }

    const checkCity = await this.cityModel.findOne({ _id: id }).exec();

    if (!checkCity) {
      throw new BadRequestException('City not found');
    }

    const deleted = await this.cityModel.delete({ _id: id }).exec();

    return deleted;
  }
}
