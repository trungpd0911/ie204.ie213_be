import { Injectable, Redirect } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import * as qs from 'qs';
import * as crypto from 'crypto';
import { responseData } from '../global/globalClass';
import { BillService } from '../bills/bill.service';

@Injectable()
export class PaymentService {
	constructor(
		private configService: ConfigService,
		private billService: BillService,
	) {}

	private sortObject(obj: any): any {
		const sorted = {};
		const str = [];
		let key: any;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				str.push(encodeURIComponent(key));
			}
		}
		str.sort();
		for (key = 0; key < str.length; key++) {
			sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(
				/%20/g,
				'+',
			);
		}
		return sorted;
	}

	async createPaymentUrl(req: any) {
		process.env.TZ = 'Asia/Ho_Chi_Minh';

		const userId = req.currentUser._id;
		let discountId = req.body.discountId;
		if (!discountId) {
			discountId = '';
		}

		const date = new Date();
		const createDate = moment(date).format('YYYYMMDDHHmmss');

		const ipAddr =
			req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			(req.connection.socket
				? req.connection.socket.remoteAddress
				: null);

		const tmnCode = this.configService.get<string>('vnp_TmnCode');
		const secretKey = this.configService.get<string>('vnp_HashSecret');
		let vnpUrl = this.configService.get<string>('vnp_Url');
		const returnUrl = this.configService.get<string>('vnp_ReturnUrl');
		const orderId = moment(date).format('DDHHmmss');
		const bankCode = req.body.bankCode || '';
		const locale = 'vn';
		const currCode = 'VND';
		let vnp_Params = {};
		// vnp_Params['vnp_UserId'] = userId;
		// vnp_Params['vnp_DiscountId'] = discountId;
		vnp_Params['vnp_Version'] = '2.1.0';
		vnp_Params['vnp_Command'] = 'pay';
		vnp_Params['vnp_TmnCode'] = tmnCode;
		vnp_Params['vnp_Locale'] = locale;
		vnp_Params['vnp_CurrCode'] = currCode;
		vnp_Params['vnp_TxnRef'] = orderId;
		vnp_Params['vnp_OrderInfo'] =
			'ThanhtoanchomaGD:' + orderId + ' ' + userId + ' ' + discountId;
		vnp_Params['vnp_OrderType'] = 'other';
		vnp_Params['vnp_Amount'] = 1000000;
		vnp_Params['vnp_ReturnUrl'] = returnUrl;
		vnp_Params['vnp_IpAddr'] = ipAddr;
		vnp_Params['vnp_CreateDate'] = createDate;
		if (bankCode !== null && bankCode !== '') {
			vnp_Params['vnp_BankCode'] = bankCode;
		}

		vnp_Params = this.sortObject(vnp_Params);

		const signData = qs.stringify(vnp_Params, { encode: false });
		const hmac = crypto.createHmac('sha512', secretKey);
		const signed = hmac
			.update(Buffer.from(signData, 'utf-8'))
			.digest('hex');
		vnp_Params['vnp_SecureHash'] = signed;
		vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });

		return new responseData(vnpUrl, 200, 'success');
	}

	async vnpayReturn(req: any) {
		let vnp_Params = req.query;
		const userId = req.query['vnp_OrderInfo'].split(' ')[1];
		let discountId = req.query['vnp_OrderInfo'].split(' ')[2];
		const secureHash = vnp_Params['vnp_SecureHash'];

		delete vnp_Params['vnp_SecureHash'];
		delete vnp_Params['vnp_SecureHashType'];

		vnp_Params = this.sortObject(vnp_Params);

		const tmnCode = this.configService.get<string>('vnp_TmnCode');
		const secretKey = this.configService.get<string>('vnp_HashSecret');

		const signData = qs.stringify(vnp_Params, { encode: false });
		const hmac = crypto.createHmac('sha512', secretKey);
		const signed = hmac
			.update(Buffer.from(signData, 'utf-8'))
			.digest('hex');

		if (secureHash === signed) {
			if (discountId === '') discountId = null;
			await this.billService.checkoutBill(userId, discountId);

			// Check if the data in the database is valid and notify the result
			// render interface checkout success
			return {
				Redirect: 'https://bepuit.com',
			};
		} else {
			return {
				message: 'success',
			};
		}
	}
}
