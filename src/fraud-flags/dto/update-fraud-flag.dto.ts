import { PartialType } from '@nestjs/mapped-types';
import { CreateFraudFlagDto } from './create-fraud-flag.dto';

export class UpdateFraudFlagDto extends PartialType(CreateFraudFlagDto) {}
