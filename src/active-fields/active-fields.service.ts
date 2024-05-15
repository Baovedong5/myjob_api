import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ActiveField,
  ActiveFieldDocument,
} from './schemas/active-field.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import { CreateActiveFieldDto } from './dto/create-active-field';
import aqp from 'api-query-params';
import { UpdateActiveFieldDto } from './dto/update-active-field';
import mongoose from 'mongoose';

@Injectable()
export class ActiveFieldsService {
  constructor(
    @InjectModel(ActiveField.name)
    private activeFieldModel: SoftDeleteModel<ActiveFieldDocument>,
  ) {}

  async create(createActiveFieldDto: CreateActiveFieldDto) {
    const { name } = createActiveFieldDto;

    const checkActiveField = await this.activeFieldModel
      .findOne({ name })
      .exec();

    if (checkActiveField) {
      throw new BadRequestException('Active field is already existed');
    }

    return await this.activeFieldModel.create({ name });
  }

  async findAll(page: number, limit: number, qs: string) {
    const { filter, sort } = aqp(qs);

    delete filter.page;
    delete filter.limit;

    let offset = (page - 1) * limit;
    let defaultLimit = limit ? limit : 10;

    const totalItems = (await this.activeFieldModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.activeFieldModel
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

  async update(id: string, updateActiveFieldDto: UpdateActiveFieldDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid active field id');
    }

    const checkActiveFieldName = await this.activeFieldModel
      .findOne({ _id: id })
      .exec();

    if (!checkActiveFieldName) {
      throw new BadRequestException('Active field is not existed');
    }

    if (
      updateActiveFieldDto.name &&
      updateActiveFieldDto.name !== checkActiveFieldName.name
    ) {
      const checkName = await this.activeFieldModel
        .findOne({
          name: updateActiveFieldDto.name,
          _id: { $ne: id },
        })
        .exec();

      if (checkName) {
        throw new BadRequestException('Active field name is already existed');
      }
    }

    return await this.activeFieldModel
      .findByIdAndUpdate(id, updateActiveFieldDto, { new: true })
      .exec();
  }
}
