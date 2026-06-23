import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransferLimitsService } from './transfer-limits.service';
import { CreateTransferLimitDto } from './dto/create-transfer-limit.dto';
import { UpdateTransferLimitDto } from './dto/update-transfer-limit.dto';

@Controller('transfer-limits')
export class TransferLimitsController {
  constructor(private readonly transferLimitsService: TransferLimitsService) {}

  @Post()
  create(@Body() createTransferLimitDto: CreateTransferLimitDto) {
    return this.transferLimitsService.create(createTransferLimitDto);
  }

  @Get()
  findAll() {
    return this.transferLimitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transferLimitsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransferLimitDto: UpdateTransferLimitDto) {
    return this.transferLimitsService.update(+id, updateTransferLimitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transferLimitsService.remove(+id);
  }
}
