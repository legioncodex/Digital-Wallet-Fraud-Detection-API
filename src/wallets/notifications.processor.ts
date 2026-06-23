import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

// This decorator tells NestJS to listen to the 'notifications' queue
@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
  // This function fires automatically whenever a new sticky note enters the queue
  async process(job: Job<any, any, string>): Promise<any> {
    if (job.name === 'deposit-success') {
      console.log(
        `[BACKGROUND WORKER] Sending Push Notification to User ${job.data.userId}...`,
      );
      console.log(
        `[BACKGROUND WORKER] Message: "You deposited ₦${job.data.amount}. New Balance: ₦${job.data.newBalance}"`,
      );

      // Simulate a slow API call (like sending a real email via SendGrid)
      await new Promise((resolve) => setTimeout(resolve, 3000));

      console.log(`[BACKGROUND WORKER] ✅ Notification sent successfully!`);
    }
  }
}
