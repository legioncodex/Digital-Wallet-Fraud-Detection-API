import { Module } from '@nestjs/common';
import { TransferLimitsService } from './transfer-limits.service';
import { TransferLimitsController } from './transfer-limits.controller';

@Module({
  controllers: [TransferLimitsController],
  providers: [TransferLimitsService],
})
export class TransferLimitsModule {}
