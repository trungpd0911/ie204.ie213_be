import {
	Controller,
	Get,
	Post,
	Redirect,
	Request,
	Res,
	UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import {
	CustomApiResponse,
	CustomSuccessfulApiResponse,
} from '../global/api-responses';
import { AuthGuard } from '../guards/auth.guard';

@Controller('payment')
@ApiTags('payment')
export class PaymentController {
	constructor(private paymentService: PaymentService) {}

	@CustomSuccessfulApiResponse('success', 200, 'http://sandbox.vnpayment.vn/')
	@Post('/create_payment_url')
	@UseGuards(AuthGuard)
	async createPaymentUrl(@Request() req) {
		return this.paymentService.createPaymentUrl(req);
	}

	@Get('/vnpay_return')
	async vnpayReturn(@Request() req, @Res() res: Response) {
		await this.paymentService.vnpayReturn(req);
		res.send(
			'<h1 style="margin-top:150px;color:#15da46;"><center>Thanh toán thành công !</center></h1>',
		);
	}
}
