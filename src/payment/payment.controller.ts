import { Controller, Get, Post, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags } from '@nestjs/swagger';
import {
	CustomApiResponse,
	CustomSuccessfulApiResponse,
} from '../global/api-responses';

@Controller('payment')
@ApiTags('payment')
export class PaymentController {
	constructor(private paymentService: PaymentService) {}

	@CustomSuccessfulApiResponse('success', 200, 'http://sandbox.vnpayment.vn/')
	@Post('/create_payment_url')
	async createPaymentUrl(@Request() req) {
		return this.paymentService.createPaymentUrl(req);
	}

	// @Get('/vnpay_return')
	// async vnpayReturn(@Request() req) {
	// 	return this.paymentService.vnpayReturn(req);
	// }
}
