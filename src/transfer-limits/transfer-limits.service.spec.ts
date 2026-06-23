import { Test, TestingModule } from '@nestjs/testing';
import { TransferLimitsService } from './transfer-limits.service';

describe('TransferLimitsService', () => {
  let service: TransferLimitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransferLimitsService],
    }).compile();

    service = module.get<TransferLimitsService>(TransferLimitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
