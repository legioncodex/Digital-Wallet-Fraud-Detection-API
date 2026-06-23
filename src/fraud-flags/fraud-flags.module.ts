import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FraudFlagsService } from './fraud-flags.service';
import { FraudFlag } from './entities/fraud-flag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FraudFlag])],
  providers: [FraudFlagsService],
  exports: [FraudFlagsService], // Crucial: We must export this so the Transfer Engine can use it!
})
export class FraudFlagsModule {}
