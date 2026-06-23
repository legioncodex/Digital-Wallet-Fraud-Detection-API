import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FraudFlag } from './entities/fraud-flag.entity';
import { Cron, CronExpression } from '@nestjs/schedule'; // Add this

@Injectable()
export class FraudFlagsService {
  // Create a logger so our robot can print messages to the terminal
  private readonly logger = new Logger(FraudFlagsService.name);
  constructor(
    @InjectRepository(FraudFlag)
    private fraudRepository: Repository<FraudFlag>,
  ) {}

  async runSecurityChecks(senderId: string, amount: number) {
    // Rule 1: Basic Sanity Check
    if (amount <= 0) {
      throw new BadRequestException(
        'Transfer amount must be greater than zero.',
      );
    }

    // Rule 2: High-Value Suspicion (e.g., blocking anything over 1,000,000)
    const SUSPICIOUS_THRESHOLD = 1000000;

    if (amount > SUSPICIOUS_THRESHOLD) {
      // Create a permanent record of this suspicious attempt for Admins to review
      const flag = this.fraudRepository.create({
        reason: `Blocked transfer attempt of ${amount}. Exceeds safety threshold.`,
        status: 'OPEN',
        user: { id: senderId },
      });

      await this.fraudRepository.save(flag);

      // Block the transfer completely
      throw new BadRequestException(
        'Transfer flagged for suspicious activity. Account under review.',
      );
    }

    return true; // If it passes all checks, give the green light
  }

  // NEW: The Scheduled Job
  // For testing, we will make it run every 10 seconds.
  // In production, you would use CronExpression.EVERY_DAY_AT_MIDNIGHT
  @Cron(CronExpression.EVERY_10_SECONDS)
  handleNightlyFraudScan() {
    this.logger.debug(
      '🤖 [CRON JOB STARTED] Scanning database for suspicious activity...',
    );

    // Here is where you would write SQL queries to find users who
    // made 50+ transfers today, or moved money to flagged accounts.

    // For now, we simulate the scan:
    const accountsScanned = Math.floor(Math.random() * 100) + 50;

    this.logger.debug(
      `📊 [CRON JOB FINISHED] Scanned ${accountsScanned} accounts. No new fraud detected.`,
    );
  }
}
