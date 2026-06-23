import { Test, TestingModule } from '@nestjs/testing';
import { FraudFlagsController } from './fraud-flags.controller';
import { FraudFlagsService } from './fraud-flags.service';

describe('FraudFlagsController', () => {
  let controller: FraudFlagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FraudFlagsController],
      providers: [FraudFlagsService],
    }).compile();

    controller = module.get<FraudFlagsController>(FraudFlagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
