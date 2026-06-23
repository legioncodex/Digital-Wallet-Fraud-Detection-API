import { PartialType } from '@nestjs/mapped-types';
import { CreateTransferLimitDto } from './create-transfer-limit.dto';

export class UpdateTransferLimitDto extends PartialType(CreateTransferLimitDto) {}
