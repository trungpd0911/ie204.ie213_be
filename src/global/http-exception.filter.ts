import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { responseError } from './globalClass';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		console.log('This is exception handler');
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		// const request = ctx.getRequest<Request>();
		const status = exception.getStatus();
		const resData = new responseError(
			exception.getStatus(),
			exception.getResponse().toString(),
		);

		return response.status(status).json(resData);
	}
}
