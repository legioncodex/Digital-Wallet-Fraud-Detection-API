import { Injectable } from '@nestjs/common';
import { CreateTransferLimitDto } from './dto/create-transfer-limit.dto';
import { UpdateTransferLimitDto } from './dto/update-transfer-limit.dto';

@Injectable()
export class TransferLimitsService {
  create(createTransferLimitDto: CreateTransferLimitDto) {
    return 'This action adds a new transferLimit';
  }

  findAll() {
    return `This action returns all transferLimits`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transferLimit`;
  }

  update(id: number, updateTransferLimitDto: UpdateTransferLimitDto) {
    return `This action updates a #${id} transferLimit`;
  }

  remove(id: number) {
    return `This action removes a #${id} transferLimit`;
  }
}
