import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Query,
	Request,
	UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BillService } from './bill.service';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { responseData, responseError } from '../global/globalClass';
import {
	permissionErrorResponse,
	serverErrorResponse,
	tokenErrorResponse,
} from '../global/api-responses';

@ApiTags('bills')
@Controller('bills')
@serverErrorResponse
export class BillController {
	constructor(private billService: BillService) {}

	// admin
	// get all bills
	@permissionErrorResponse
	@tokenErrorResponse
	@ApiResponse({
		status: 200,
		description: 'get all bills successfully',
		schema: {
			example: new responseData(null, 200, 'get all bills successfully'),
		},
	})
	@Get('/all')
	@UseGuards(new RoleGuard(['admin']))
	@UseGuards(AuthGuard)
	async getAllBills() {
		return this.billService.getAllBills();
	}

	// @Get('/all/username/:username')
	// async getAllBillsByUsername(@Param('username') username: string) {
	// 	return 'all bills by username';
	// }

	// @Get('/all/filter')
	// async filterBills(
	// 	@Query('username') username: string,
	// 	@Query('fromDay') fromDay: string,
	// 	@Query('toDay') toDay: string,
	// 	@Query('billPayed') billPayed: string,
	// ) {
	// 	return 'filter bills';
	// }

	// owner user
	@ApiResponse({
		status: 200,
		description: 'checkout bill successfully',
		schema: {
			example: new responseData(null, 200, 'checkout bill successfully'),
		},
	})
	@ApiResponse({
		status: 404,
		description: 'bill is not exist',
		schema: {
			example: new responseError(404, 'bill is not exist'),
		},
	})
	@UseGuards(AuthGuard)
	@Post('/checkout')
	async checkoutBill(@Request() req, @Body('discountId') discountId: string) {
		const userId = req.currentUser._id;
		return await this.billService.checkoutBill(userId, discountId);
	}

	// owner user
	@ApiResponse({
		status: 200,
		description: 'get all dishes in cart successfully',
		schema: {
			example: new responseData(
				[
					{
						_id: 'id',
						dishName: 'Tra sua tra chau',
						dishPrice: 20000,
						dishImages: [
							{
								link: 'img1',
								id: 'publicId',
								_id: 'id',
							},
							{
								link: 'img2',
								id: 'publicID',
								_id: 'id',
							},
						],
						dishAmount: 6,
					},
				],
				200,
				'get all dishes in cart successfully',
			),
		},
	})
	@Get('/cart')
	@UseGuards(AuthGuard)
	async getDishesInCArt(@Request() req) {
		const userId = req.currentUser._id;
		return await this.billService.getAllDishesInCart(userId);
	}

	@ApiResponse({
		status: 200,
		description: 'reset cart successfully',
		schema: {
			example: new responseData(null, 200, 'reset cart successfully'),
		},
	})
	@ApiResponse({
		status: 404,
		description: 'bill is not exist',
		schema: {
			example: new responseError(404, 'bill is not exist'),
		},
	})
	@UseGuards(AuthGuard)
	@Delete('/cart/reset')
	async resetCart(@Request() req) {
		const userId = req.currentUser._id;
		return await this.billService.resetCart(userId);
	}

	// add dish to cart
	@ApiResponse({
		status: 200,
		description: 'add dish to cart successfully',
		schema: {
			example: new responseData(
				null,
				200,
				'add dish to cart successfully',
			),
		},
	})
	@ApiResponse({
		status: 400,
		description: 'dishId is not valid',
		schema: {
			example: new responseError(400, 'dishId is not valid'),
		},
	})
	@Post('/cart/add')
	@UseGuards(AuthGuard)
	async addDishToCart(@Request() req, @Body('dishId') dishId: string) {
		const userId = req.currentUser._id;
		return this.billService.addDishToCart(userId, dishId);
	}

	// subtract dish from cart
	@ApiResponse({
		status: 200,
		description: 'subtract dish from cart successfully',
		schema: {
			example: new responseData(
				null,
				200,
				'subtract dish from cart successfully',
			),
		},
	})
	@ApiResponse({
		status: 400,
		description: 'dishId is not valid',
		schema: {
			example: new responseError(400, 'dishId is not valid'),
		},
	})
	@ApiResponse({
		status: 404,
		description: 'bill is not exist',
		schema: {
			example: new responseError(404, 'bill is not exist'),
		},
	})
	@Post('/cart/sub')
	@UseGuards(AuthGuard)
	async subtractDishFromCart(@Request() req, @Body('dishId') dishId: string) {
		const userId = req.currentUser._id;
		return await this.billService.subtractDishFromCart(userId, dishId);
	}

	// remove dish from cart
	@ApiResponse({
		status: 200,
		description: 'remove dish from cart successfully',
		schema: {
			example: new responseData(
				null,
				200,
				'remove dish from cart successfully',
			),
		},
	})
	@ApiResponse({
		status: 400,
		description: 'dishId is not valid',
		schema: {
			example: new responseError(400, 'dishId is not valid'),
		},
	})
	@ApiResponse({
		status: 404,
		description: 'bill is not exist',
		schema: {
			example: new responseError(404, 'bill is not exist'),
		},
	})
	@UseGuards(AuthGuard)
	@Post('/cart/remove')
	async removeDishFromCart(@Request() req, @Body('dishId') dishId: string) {
		const userId = req.currentUser._id;
		return await this.billService.removeDishFromCart(userId, dishId);
	}
}
