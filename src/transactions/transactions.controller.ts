import { Controller, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard) // Protects all routes in this controller
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('transfer')
  transfer(
    @Request() req,
    @Body('receiverWalletId') receiverWalletId: string,
    @Body('amount') amount: number,
  ) {
    // req.user.sub is automatically extracted from the Sender's JWT token
    return this.transactionsService.transferFunds(
      req.user.sub,
      receiverWalletId,
      amount,
    );
  }

  @Post(':id/reverse')
  reverseTransfer(
    @Request() req,
    @Param('id') transactionId: string, // Grabs the ID from the URL
  ) {
    // In a production app, we would add a @Roles('admin') guard here!
    // req.user.sub is the ID of the Admin making the request
    return this.transactionsService.reverseTransaction(
      transactionId,
      req.user.sub,
    );
  }
}
