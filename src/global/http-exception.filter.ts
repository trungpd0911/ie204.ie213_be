import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { responseError } from './globalClass';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = exception.getStatus();
		const resData = new responseError(
			exception.getStatus(),
			exception.getResponse()['message'],
		);

		return response.status(status).json(resData);
	}
}
