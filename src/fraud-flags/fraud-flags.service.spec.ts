import { Test, TestingModule } from '@nestjs/testing';
import { FraudFlagsService } from './fraud-flags.service';

describe('FraudFlagsService', () => {
  let service: FraudFlagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FraudFlagsService],
    }).compile();

    service = module.get<FraudFlagsService>(FraudFlagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
