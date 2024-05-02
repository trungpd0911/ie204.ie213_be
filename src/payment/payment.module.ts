import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { BillModule } from '../bills/bill.module';

@Module({
	imports: [BillModule],
	controllers: [PaymentController],
	providers: [PaymentService],
})
export class PaymentModule {}
