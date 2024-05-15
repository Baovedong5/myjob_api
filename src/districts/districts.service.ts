import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { InjectModel } from '@nestjs/mongoose';
import { District, DistrictDocument } from './schemas/district.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { City, CityDocument } from 'src/cities/schemas/city.schema';

@Injectable()
export class DistrictsService {
  constructor(
    @InjectModel(District.name)
    private districtModel: SoftDeleteModel<DistrictDocument>,

    @InjectModel(City.name)
    private cityModel: SoftDeleteModel<CityDocument>,
  ) {}

  async create(createDistrictDto: CreateDistrictDto) {
    const { city, name } = createDistrictDto;

    const checkName = await this.districtModel
      .findOne({
        name: createDistrictDto.name,
      })
      .exec();

    if (checkName) {
      throw new BadRequestException('District is already existed');
    }

    const checkCity = await this.cityModel
      .findOne({ _id: createDistrictDto.city })
      .exec();

    if (!checkCity) {
      throw new BadRequestException('City not found');
    }

    const newDistrict = await this.districtModel.create({
      name,
      city,
    });

    return newDistrict;
  }

  async findAll(page: number, limit: number, qs: string) {
    const { filter, sort } = aqp(qs);

    delete filter.page;
    delete filter.limit;

    const offset = (page - 1) * limit;
    const defaultLimit = limit ? limit : 10;

    const totalItems = (await this.districtModel.find(filter).exec()).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.districtModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate('city')
      .exec();

    return {
      meta: {
        currentPage: page,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid district id');
    }

    const checkDistrict = await this.districtModel
      .findOne({ _id: id })
      .populate('city')
      .exec();

    if (!checkDistrict) {
      throw new BadRequestException('District not found');
    }

    return checkDistrict;
  }

  async findByCity(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid city id');
    }

    const checkCity = await this.cityModel.findOne({ _id: id }).exec();

    if (!checkCity) {
      throw new BadRequestException('City not found');
    }

    return await this.districtModel.find({ city: id }).populate('city').exec();
  }

  async update(id: string, updateDistrictDto: UpdateDistrictDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid district id');
    }

    const checkName = await this.districtModel.findOne({ _id: id }).exec();

    if (!checkName) {
      throw new BadRequestException('District not found');
    }

    if (updateDistrictDto.name && updateDistrictDto.name !== checkName.name) {
      const checkName = await this.districtModel
        .findOne({
          name: updateDistrictDto.name,
          _id: { $ne: id },
        })
        .exec();

      if (checkName) {
        throw new BadRequestException('District name is already existed');
      }

      const updated = await this.districtModel
        .findByIdAndUpdate(id, { name: updateDistrictDto.name }, { new: true })
        .exec();

      return updated;
    }
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid district id');
    }

    const checkName = await this.districtModel.findOne({ _id: id }).exec();

    if (!checkName) {
      throw new BadRequestException('District not found');
    }

    return await this.districtModel.delete({ _id: id }).exec();
  }
}
