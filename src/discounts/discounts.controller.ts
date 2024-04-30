import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	HttpStatus,
	UseGuards,
} from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import {
	CustomBadRequestApiResponse,
	CustomForbidenrrorApiResponse,
	CustomInternalServerErrorApiResponse,
	CustomNotFoundApiResponse,
	CustomSuccessfulApiResponse,
	CustomUnauthorizedApiResponse,
} from 'src/global/api-responses';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { currentUser } from 'src/users/decorators/currentUser.decorator';

@ApiTags('discounts')
@Controller('discounts')
export class DiscountsController {
	constructor(private readonly discountsService: DiscountsService) {}

	// Admin role
	// Swagger's decorators
	@ApiOperation({ summary: '[ADMIN] Create a discount' })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				discountName: {
					type: 'string',
					example: 'Chao mung 8 thang 3',
				},
				discountCode: {
					type: 'string',
					example: '8thang3',
				},
				discountPercent: { type: 'number', example: 50 },
				discountDescription: {
					type: 'string',
					example: 'Chao mung ngay 8 thang 3',
				},
				startDay: {
					type: 'date',
					example: '2024-05-03T00:00:00+00:00',
				},
				endDay: { type: 'date', example: '2024-05-10T00:00:00+00:00' },
			},
		},
	})
	@CustomSuccessfulApiResponse(
		'Discount is created successfully',
		HttpStatus.OK,
		{
			discountName: 'Chao mung 8 thang 3',
			discountCode: '8thang3',
			discountPercent: 50,
			discountDescription: 'Chao mung ngay 8 thang 3',
			startDay: '2024-05-03T00:00:00.000Z',
			endDay: '2024-05-10T00:00:00.000Z',
			_id: '66306121a35fea6e0d875387',
			users: [],
			createdAt: '2024-04-30T03:10:25.193Z',
			updatedAt: '2024-04-30T03:10:25.193Z',
			__v: 0,
		},
	)
	@CustomForbidenrrorApiResponse('Permission denied')
	@CustomInternalServerErrorApiResponse('Internal server error')
	@CustomUnauthorizedApiResponse('Invalid token or expired')
	// Auth's decorators
	@UseGuards(new RoleGuard(['admin']))
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	// Controller's decorators
	@Post()
	async createDiscount(@Body() createDiscountDto: CreateDiscountDto) {
		return await this.discountsService.createDishcount(createDiscountDto);
	}

	// Swagger's decorators
	@ApiOperation({ summary: '[ADMIN] Get all discounts' })
	@CustomSuccessfulApiResponse(
		'Get all discounts successfully',
		HttpStatus.OK,
		[
			{
				_id: '66306121a35fea6e0d875387',
				discountName: 'Chao mung 8 thang 3',
				discountCode: '8thang3',
				discountPercent: 50,
				discountDescription: 'Chao mung ngay 8 thang 3',
				startDay: '2024-05-03T00:00:00.000Z',
				endDay: '2024-05-10T00:00:00.000Z',
				users: [],
				createdAt: '2024-04-30T03:10:25.193Z',
				updatedAt: '2024-04-30T03:10:25.193Z',
				__v: 0,
			},
		],
	)
	@CustomForbidenrrorApiResponse('Permission denied')
	@CustomInternalServerErrorApiResponse('Internal server error')
	@CustomUnauthorizedApiResponse('Invalid token or expired')
	// Auth's decorators
	@UseGuards(new RoleGuard(['admin']))
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	// Controller's decorators
	@Get()
	async getAllDiscounts() {
		return await this.discountsService.getAllDiscounts();
	}

	// Swagger's decorators
	@ApiOperation({ summary: '[ADMIN] Get discount by id' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'The ID of the discount want to find',
	})
	@CustomSuccessfulApiResponse(
		'Get discount by id successfully',
		HttpStatus.OK,
		{
			_id: '66306121a35fea6e0d875387',
			discountName: 'Chao mung 8 thang 3',
			discountCode: '8thang3',
			discountPercent: 50,
			discountDescription: 'Chao mung ngay 8 thang 3',
			startDay: '2024-05-03T00:00:00.000Z',
			endDay: '2024-05-10T00:00:00.000Z',
			users: [],
			createdAt: '2024-04-30T03:10:25.193Z',
			updatedAt: '2024-04-30T03:10:25.193Z',
			__v: 0,
		},
	)
	@CustomInternalServerErrorApiResponse('Internal server error')
	@CustomBadRequestApiResponse("Invalid discount's ID")
	@CustomNotFoundApiResponse('No discount found')
	@CustomForbidenrrorApiResponse('Permission denied')
	@CustomUnauthorizedApiResponse('Invalid token or expired')
	// Auth's decorators
	@UseGuards(new RoleGuard(['admin']))
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	// Controller's decorators
	@Get(':id')
	async getDiscountById(@Param('id') id: string) {
		return await this.discountsService.getDiscountById(id);
	}

	// Swagger's decorators
	@ApiOperation({ summary: '[ADMIN] Delete discount' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'The ID of the discount want to delete',
	})
	@CustomSuccessfulApiResponse(
		'Discount is deleted successfully',
		HttpStatus.OK,
		null,
	)
	@CustomInternalServerErrorApiResponse('Internal server error')
	@CustomBadRequestApiResponse("Invalid discount's ID")
	@CustomNotFoundApiResponse('No discount found')
	@CustomForbidenrrorApiResponse('Permission denied')
	@CustomUnauthorizedApiResponse('Invalid token or expired')
	// Auth's decorators
	@UseGuards(new RoleGuard(['admin']))
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	// Controller's decorators
	@Delete(':id')
	async removeDiscount(@Param('id') id: string) {
		return await this.discountsService.removeDiscount(id);
	}

	// Swagger's decorators
	@ApiOperation({ summary: '[ADMIN] Assign discount to all users' })
	@ApiParam({
		name: 'discount_id',
		required: true,
		description: 'The ID of the discount want to assign to all users',
	})
	@CustomSuccessfulApiResponse(
		'Assign discount to all users successfully',
		HttpStatus.OK,
		null,
	)
	@CustomInternalServerErrorApiResponse('Internal server error')
	@CustomBadRequestApiResponse("Invalid discount's ID")
	@CustomNotFoundApiResponse('No discount found')
	@CustomForbidenrrorApiResponse('Permission denied')
	@CustomUnauthorizedApiResponse('Invalid token or expired')
	// Auth's decorators
	@UseGuards(new RoleGuard(['admin']))
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	// Controller's decorators
	@Post('/assign/all/:discount_id')
	async assignDiscountsToAllUsers(@Param('discount_id') discountId: string) {
		return await this.discountsService.assignDiscountsToAllUsers(
			discountId,
		);
	}

	// Swagger's decorators
	@ApiOperation({ summary: '[ADMIN] Remove discount from all users' })
	@ApiParam({
		name: 'discount_id',
		required: true,
		description: 'The ID of the discount want to remove from all users',
	})
	@CustomSuccessfulApiResponse(
		'Remove discount from all users successfully',
		HttpStatus.OK,
		null,
	)
	@CustomInternalServerErrorApiResponse('Internal server error')
	@CustomBadRequestApiResponse("Invalid discount's ID")
	@CustomNotFoundApiResponse('No discount found')
	@CustomForbidenrrorApiResponse('Permission denied')
	@CustomUnauthorizedApiResponse('Invalid token or expired')
	// Auth's decorators
	@UseGuards(new RoleGuard(['admin']))
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	// Controller's decorators
	@Post('/remove/all/:discount_id')
	async removeDiscountFromAllUsers(@Param('discount_id') discountId: string) {
		return await this.discountsService.removeDiscountFromAllUsers(
			discountId,
		);
	}

	// @Post('/assign/top-purchase/:discount_id')
	// async assignDiscountsToTopPurchaseUsers(@Param('discount_id') discountId: string) {
	// 	return await this.discountsService.assignDiscountsToTopPurchaseUsers(discountId);
	// }

	// User Role
	// Swagger's decorators
	@ApiOperation({ summary: "[ADMIN, USER] Get all user's discounts" })
	// @ApiParam({
	// 	name: 'user_id',
	// 	required: true,
	// 	description: 'The ID of the user want to get all discounts',
	// })
	@CustomSuccessfulApiResponse(
		"Get all user's discounts successfully",
		HttpStatus.OK,
		null,
	)
	@CustomInternalServerErrorApiResponse('Internal server error')
	@CustomBadRequestApiResponse("Invalid user's ID")
	@CustomNotFoundApiResponse('User not found')
	@CustomUnauthorizedApiResponse('Invalid token or expired')
	// Auth's decorators
	@UseGuards(new RoleGuard(['admin', 'user']))
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	// Controller's decorators
	@Get('/user/:user_id')
	async getAllUsersDiscounts(@currentUser() currentUser) {
		const user = await currentUser;
		return await this.discountsService.getAllUsersDiscounts(user._id);
	}
}
