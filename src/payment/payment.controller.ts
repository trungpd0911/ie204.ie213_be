import { Controller, Get, Post, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
	constructor(private paymentService: PaymentService) {}

	@Post('/create_payment_url')
	async createPaymentUrl(@Request() req) {
		return this.paymentService.createPaymentUrl(req);
	}

	@Get('/vnpay_return')
	async vnpayReturn(@Request() req) {
		return this.paymentService.vnpayReturn(req);
	}
}
