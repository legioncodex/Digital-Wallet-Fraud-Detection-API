import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('wallets')
@UseGuards(JwtAuthGuard) // Every route in this file is now locked down!
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  createWallet(@Request() req, @Body('currency') currency: string) {
    // req.user.sub is the user's ID we packed into the JWT token during login
    return this.walletsService.createWallet(req.user.sub, currency);
  }

  @Get()
  getMyWallets(@Request() req) {
    return this.walletsService.getUserWallets(req.user.sub);
  }

  @Post('deposit')
  deposit(@Request() req, @Body('amount') amount: number) {
    // req.user.sub is the ID from the logged-in user's token
    return this.walletsService.depositFunds(req.user.sub, amount);
  }
}
