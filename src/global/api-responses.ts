import { ApiResponse } from '@nestjs/swagger';
import { responseData, responseError } from '../global/globalClass';
import { HttpStatus } from '@nestjs/common';

export const tokenErrorResponse = ApiResponse({
	status: 401,
	description: 'Invalid token or expired',
	schema: {
		example: new responseError(403, 'Invalid token or expired'),
	},
});

export const serverErrorResponse = ApiResponse({
	status: 500,
	description: 'Internal server error',
	schema: {
		example: new responseError(500, 'Internal server error'),
	},
});

export const permissionErrorResponse = ApiResponse({
	status: 403,
	description: 'Permission denied',
	schema: {
		example: new responseError(403, 'Permission denied'),
	},
});

export const invalidIdResponse = ApiResponse({
	status: 400,
	description: 'Invalid id',
	schema: {
		example: new responseError(400, 'Invalid id'),
	},
});

// Cusome error api response

// Error
export function CustomApiResponse(message: string, status: number) {
	return ApiResponse({
		status: status,
		description: message,
		schema: {
			example: new responseError(status, message),
		},
	});
}

export function CustomBadRequestApiResponse(message: string) {
	return CustomApiResponse(message, HttpStatus.BAD_REQUEST);
}

export function CustomInternalServerErrorApiResponse(message: string) {
	return CustomApiResponse(message, HttpStatus.INTERNAL_SERVER_ERROR);
}

export function CustomForbidenrrorApiResponse(message: string) {
	return CustomApiResponse(message, HttpStatus.FORBIDDEN);
}

export function CustomUnauthorizedApiResponse(message: string) {
	return CustomApiResponse(message, HttpStatus.UNAUTHORIZED);
}

export function CustomNotFoundApiResponse(message: string) {
	return CustomApiResponse(message, HttpStatus.NOT_FOUND);
}
// Success
export function CustomSuccessfulApiResponse(
	message: string,
	status: number,
	data: any,
) {
	return ApiResponse({
		status: status,
		description: message,
		schema: {
			example: new responseData(data, status, message),
		},
	});
}
