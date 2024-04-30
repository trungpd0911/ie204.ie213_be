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
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BillService } from './bill.service';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { responseData, responseError } from '../global/globalClass';
import {
	CustomApiResponse,
	CustomForbidenrrorApiResponse,
	CustomNotFoundApiResponse,
	CustomSuccessfulApiResponse,
	permissionErrorResponse,
	tokenErrorResponse,
} from '../global/api-responses';

@ApiTags('bills')
@Controller('bills')
@ApiBearerAuth()
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
	@Get('/admin/all')
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

	// admin checkout bill for user when user pay bill by cash
	@CustomSuccessfulApiResponse('admin checkout bill successfully', 200, null)
	@ApiResponse({
		status: 404,
		description: 'bill is not exist',
		schema: {
			example: new responseError(404, 'bill is not exist'),
		},
	})
	@CustomApiResponse('userId is not valid', 400)
	@UseGuards(new RoleGuard(['admin']))
	@UseGuards(AuthGuard)
	@Post('/admin/checkout/:id')
	async adminCheckoutBill(
		@Body('discountId') discountId: string,
		@Param('id') id: string,
	) {
		return await this.billService.adminCheckoutBill(id, discountId);
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
	@CustomNotFoundApiResponse('there is no dish in the cart')
	@Get('/cart')
	@UseGuards(AuthGuard)
	async getDishesInCArt(@Request() req) {
		const userId = req.currentUser._id;
		return await this.billService.getAllDishesInCart(userId);
	}

	// owner user
	@CustomSuccessfulApiResponse('get all dishes in bill successfully', 200, [
		{
			_id: 'id',
			dishName: 'Bún Chả Hà Nội',
			dishPrice: 40000,
			dishImages: [
				{
					link: '',
					id: '',
					_id: '',
				},
			],
			dishAmount: 4,
		},
	])
	@CustomForbidenrrorApiResponse('you are not allowed to view this bill')
	@CustomNotFoundApiResponse('bill is not exist')
	@ApiBearerAuth()
	@UseGuards(AuthGuard)
	@Get('/order/dishes/:id')
	async getAllDishesInBill(@Request() req, @Param('id') id: string) {
		const userId = req.currentUser._id;
		return await this.billService.getAllDishesInBill(id, userId);
	}

	@ApiBearerAuth()
	@CustomSuccessfulApiResponse('get all bill of user successfully', 200, [
		{
			_id: '',
			totalMoney: 100,
			billPayed: true,
			billDate: '2024-04-30',
			user: 'id',
			billDishes: [
				{
					dishId: '661a8ea490c7de33d0c8a100',
					dishAmount: 4,
					_id: '6630c5ac2826bb14dc69e0ac',
				},
				{
					dishId: '661a8ee190c7de33d0c8a109',
					dishAmount: 2,
					_id: '6630c5c52826bb14dc69e0d9',
				},
			],
			createdAt: '',
			updatedAt: '',
			__v: 2,
		},
	])
	@UseGuards(AuthGuard)
	@Get('/order')
	async getAllBillOfUser(@Request() req) {
		const userId = req.currentUser._id;
		return await this.billService.getAllBillOfUser(userId);
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
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				dishId: {
					type: 'string',
					description: 'dishId',
				},
			},
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
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				dishId: {
					type: 'string',
					description: 'dishId',
				},
			},
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
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				dishId: {
					type: 'string',
					description: 'dishId',
				},
			},
		},
	})
	@UseGuards(AuthGuard)
	@Post('/cart/remove')
	async removeDishFromCart(@Request() req, @Body('dishId') dishId: string) {
		const userId = req.currentUser._id;
		return await this.billService.removeDishFromCart(userId, dishId);
	}
}
