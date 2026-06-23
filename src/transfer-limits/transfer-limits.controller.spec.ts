import { Test, TestingModule } from '@nestjs/testing';
import { TransferLimitsController } from './transfer-limits.controller';
import { TransferLimitsService } from './transfer-limits.service';

describe('TransferLimitsController', () => {
  let controller: TransferLimitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferLimitsController],
      providers: [TransferLimitsService],
    }).compile();

    controller = module.get<TransferLimitsController>(TransferLimitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
