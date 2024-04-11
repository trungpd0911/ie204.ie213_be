import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Put,
	UseInterceptors,
	UploadedFiles,
	Res,
	Query,
	UseGuards,
	HttpStatus,
} from '@nestjs/common';
import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import UpdateDishDto from './dto/update-dish.dto';
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { RoleGuard } from 'src/guards/role.guard';
import {
	CustomBadRequestApiResponse,
	CustomForbidenrrorApiResponse,
	CustomInternalServerErrorApiResponse,
	CustomNotFoundApiResponse,
	CustomSuccessfulApiResponse,
	CustomUnauthorizedApiResponse,
} from 'src/global/api-responses';
import { AuthGuard } from 'src/guards/auth.guard';

@ApiTags('dishes')
@Controller('dishes')
export class DishesController {
	constructor(private readonly dishesService: DishesService) {}

	// Admin role
	// Swagger's decorators
	@ApiOperation({ summary: '[ADMIN] Create a dish' })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				dishName: {
					type: 'string',
					example: 'Trà sữa trân châu đường đen nhiều đường đen',
				},
				dishPrice: { type: 'number', example: 20000 },
				dishDescription: {
					type: 'string',
					example: 'Khong co gi ngon',
				},
				menuId: { type: 'string', example: '66083097c11b247adbd84f2a' },
				images: {
					type: 'array',
					items: {
						type: 'string',
						format: 'binary',
					},
				},
			},
		},
	})
	@CustomSuccessfulApiResponse(
		'Dish is created successfully111',
		HttpStatus.OK,
		{
			_id: '660fdc7b70dc7fb614ceaa4b',
			dishName: 'Tra sua do vai lin',
			dishPrice: 20000,
			dishDescription: 'Khong co gi ngon',
			totalOrder: 0,
			menuId: '66083097c11b247adbd84f2a',
			rating: 5,
			dishImages: [
				{
					link: 'http://res.cloudinary.com/ddexbqgmg/image/upload/v1712315515/bepUIT-dishImages/lmskq9koz19kmvcz2uyt.jpg',
					id: 'bepUIT-dishImages/lmskq9koz19kmvcz2uyt',
					_id: '660fdc7b70dc7fb614ceaa4c',
				},
				{
					link: 'http://res.cloudinary.com/ddexbqgmg/image/upload/v1712315515/bepUIT-dishImages/iwuxrcc5wtgzjkasl7v3.jpg',
					id: 'bepUIT-dishImages/iwuxrcc5wtgzjkasl7v3',
					_id: '660fdc7b70dc7fb614ceaa4d',
				},
			],
			slugName:
				'tra-sua-tran-chau-duong-den-nhieu-duong-den-660fdc7b70dc7fb614ceaa4b',
			createdAt: '2024-04-05T11:11:55.702Z',
			updatedAt: '2024-04-05T14:24:40.127Z',
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
	@Post('/')
	@UseInterceptors(FilesInterceptor('images'))
	async createDish(
		@Body() createDishDto: CreateDishDto,
		@UploadedFiles() dishImages: Express.Multer.File[],
	) {
		return await this.dishesService.createDish(dishImages, createDishDto);
	}

	// Swagger's decorators
	@ApiOperation({ summary: '[NO AUTH] Update a dish by ID' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'The ID of the dish want to update',
	})
	@CustomSuccessfulApiResponse(
		'Dish is updated successfully',
		HttpStatus.OK,
		{
			_id: '660fdc7b70dc7fb614ceaa4b',
			dishName: 'Tra sua do vai lin',
			dishPrice: 20000,
			dishDescription: 'Khong co gi ngon',
			totalOrder: 0,
			menuId: '66083097c11b247adbd84f2a',
			rating: 5,
			dishImages: [
				{
					link: 'http://res.cloudinary.com/ddexbqgmg/image/upload/v1712315515/bepUIT-dishImages/lmskq9koz19kmvcz2uyt.jpg',
					id: 'bepUIT-dishImages/lmskq9koz19kmvcz2uyt',
					_id: '660fdc7b70dc7fb614ceaa4c',
				},
				{
					link: 'http://res.cloudinary.com/ddexbqgmg/image/upload/v1712315515/bepUIT-dishImages/iwuxrcc5wtgzjkasl7v3.jpg',
					id: 'bepUIT-dishImages/iwuxrcc5wtgzjkasl7v3',
					_id: '660fdc7b70dc7fb614ceaa4d',
				},
			],
			slugName:
				'tra-sua-tran-chau-duong-den-nhieu-duong-den-660fdc7b70dc7fb614ceaa4b',
			createdAt: '2024-04-05T11:11:55.702Z',
			updatedAt: '2024-04-05T14:24:40.127Z',
			__v: 0,
		},
	)
	@CustomForbidenrrorApiResponse('Permission denied')
	@CustomInternalServerErrorApiResponse('Internal server error')
	@CustomUnauthorizedApiResponse('Invalid token or expired')
	@CustomBadRequestApiResponse("Invalid dish's ID")
	@CustomNotFoundApiResponse('No dish found')
	// Auth's decorators
	@UseGuards(new RoleGuard(['admin']))
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	// Controller's decorators
	@Put('/:id')
	async updateDishById(
		@Param('id') id: string,
		@Body() updateDishDto: UpdateDishDto,
	) {
		return await this.dishesService.updateDishById(id, updateDishDto);
	}

	// Swagger's decorators
	@ApiOperation({ summary: '[ADMIN] Delete a dish by ID' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'The ID of the dish want to delete',
	})
	@CustomSuccessfulApiResponse(
		'Dish is deleted successfully',
		HttpStatus.OK,
		null,
	)
	@CustomForbidenrrorApiResponse('Permission denied')
	@CustomInternalServerErrorApiResponse('Internal server error')
	@CustomUnauthorizedApiResponse('Invalid token or expired')
	@CustomBadRequestApiResponse("Invalid dish's ID")
	// Auth's decorators
	@UseGuards(new RoleGuard(['admin']))
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	// Controller's decorators
	@Delete('/:id')
	async removeDishById(@Param('id') id: string) {
		return await this.dishesService.removeDishById(id);
	}

	// User role

	// Swagger decorators
	@ApiOperation({ summary: '[NO AUTH] Get all dishes' })
	@CustomSuccessfulApiResponse('Get all dishes successfully', HttpStatus.OK, [
		{
			_id: '660fdc7b70dc7fb614ceaa4b',
			dishName: 'Trà sữa trân châu đường đen nhiều đường đen',
			dishPrice: 20000,
			dishDescription: 'Khong co gi ngon',
			totalOrder: 0,
			menuId: '66083097c11b247adbd84f2a',
			rating: 5,
			dishImages: [
				{
					link: 'http://res.cloudinary.com/ddexbqgmg/image/upload/v1712315515/bepUIT-dishImages/lmskq9koz19kmvcz2uyt.jpg',
					id: 'bepUIT-dishImages/lmskq9koz19kmvcz2uyt',
					_id: '660fdc7b70dc7fb614ceaa4c',
				},
				{
					link: 'http://res.cloudinary.com/ddexbqgmg/image/upload/v1712315515/bepUIT-dishImages/iwuxrcc5wtgzjkasl7v3.jpg',
					id: 'bepUIT-dishImages/iwuxrcc5wtgzjkasl7v3',
					_id: '660fdc7b70dc7fb614ceaa4d',
				},
			],
			slugName:
				'tra-sua-tran-chau-duong-den-nhieu-duong-den-660fdc7b70dc7fb614ceaa4b',
			createdAt: '2024-04-05T11:11:55.702Z',
			updatedAt: '2024-04-05T11:11:55.702Z',
			__v: 0,
		},
	])
	@CustomInternalServerErrorApiResponse('Internal server error')
	// Controller's decorators
	@Get('/')
	async getAllDishes() {
		return await this.dishesService.getAllDishes();
	}

	// Swagger decorators
	@ApiOperation({ summary: '[NO AUTH] Get all dishes with pagination' })
	@ApiQuery({
		name: 'page',
		required: true,
		description: 'Index of requested page',
	})
	@ApiQuery({
		name: 'perPage',
		required: true,
		description: 'Number of dishes per page',
	})
	@CustomSuccessfulApiResponse(
		'Get all dishes with pagination successfully',
		HttpStatus.OK,
		{
			dishes: [
				{
					_id: '660fdc7b70dc7fb614ceaa4b',
					dishName: 'Tra sua do vai lin',
					dishPrice: 20000,
					dishDescription: 'Khong co gi ngon',
					totalOrder: 0,
					menuId: '66083097c11b247adbd84f2a',
					rating: 5,
					dishImages: [
						{
							link: 'http://res.cloudinary.com/ddexbqgmg/image/upload/v1712315515/bepUIT-dishImages/lmskq9koz19kmvcz2uyt.jpg',
							id: 'bepUIT-dishImages/lmskq9koz19kmvcz2uyt',
							_id: '660fdc7b70dc7fb614ceaa4c',
						},
						{
							link: 'http://res.cloudinary.com/ddexbqgmg/image/upload/v1712315515/bepUIT-dishImages/iwuxrcc5wtgzjkasl7v3.jpg',
							id: 'bepUIT-dishImages/iwuxrcc5wtgzjkasl7v3',
							_id: '660fdc7b70dc7fb614ceaa4d',
						},
					],
					slugName:
						'tra-sua-tran-chau-duong-den-nhieu-duong-den-660fdc7b70dc7fb614ceaa4b',
					createdAt: '2024-04-05T11:11:55.702Z',
					updatedAt: '2024-04-05T14:24:40.127Z',
					__v: 0,
				},
			],
			isLastPage: true,
		},
	)
	@CustomNotFoundApiResponse('No dish found')
	@CustomBadRequestApiResponse(
		'Invalid params: page and perPage must be >= 1',
	)
	@CustomInternalServerErrorApiResponse('Internal server error')
	// Controller's decorators
	@Get('/pagination')
	async getAllDishesWithPagination(
		@Query('page') page: number,
		@Query('perPage') perPage: number,
	) {
		return await this.dishesService.getAllDishesWithPagination(
			page,
			perPage,
		);
	}

	// Swagger decorators
	@ApiOperation({ summary: '[NO AUTH] Filter dishes by price and memu ID' })
	@ApiQuery({ name: 'minPrice', required: false, description: 'Min price' })
	@ApiQuery({ name: 'maxPrice', required: false, description: 'Max price' })
	@ApiQuery({
		name: 'menuId',
		required: false,
		description: 'ID of menus that contains the dish',
	})
	@ApiQuery({
		name: 'page',
		required: true,
		description: 'Index of requested page',
	})
	@ApiQuery({
		name: 'perPage',
		required: true,
		description: 'Number of dishes per page',
	})
	@CustomSuccessfulApiResponse(
		'Filter dishes by price and memu ID successfully',
		HttpStatus.OK,
		{
			dishes: [
				{
					_id: '660fdc7b70dc7fb614ceaa4b',
					dishName: 'Tra sua do vai lin',
					dishPrice: 20000,
					dishDescription: 'Khong co gi ngon',
					totalOrder: 0,
					menuId: '66083097c11b247adbd84f2a',
					rating: 5,
					dishImages: [
						{
							link: 'http://res.cloudinary.com/ddexbqgmg/image/upload/v1712315515/bepUIT-dishImages/lmskq9koz19kmvcz2uyt.jpg',
							id: 'bepUIT-dishImages/lmskq9koz19kmvcz2uyt',
							_id: '660fdc7b70dc7fb614ceaa4c',
						},
						{
							link: 'http://res.cloudinary.com/ddexbqgmg/image/upload/v1712315515/bepUIT-dishImages/iwuxrcc5wtgzjkasl7v3.jpg',
							id: 'bepUIT-dishImages/iwuxrcc5wtgzjkasl7v3',
							_id: '660fdc7b70dc7fb614ceaa4d',
						},
					],
					slugName:
						'tra-sua-tran-chau-duong-den-nhieu-duong-den-660fdc7b70dc7fb614ceaa4b',
					createdAt: '2024-04-05T11:11:55.702Z',
					updatedAt: '2024-04-05T14:24:40.127Z',
					__v: 0,
				},
			],
			isLastPage: true,
		},
	)
	@CustomNotFoundApiResponse('No dish found')
	@CustomBadRequestApiResponse(
		'Invalid params: page and perPage must be >= 1',
	)
	@CustomInternalServerErrorApiResponse('Internal server error')
	// Controller's decorators
	@Get('/filter')
	async getDishesByPriceAndMenuIdWithPagination(
		@Query('minPrice') minPrice: number,
		@Query('maxPrice') maxPrice: number,
		@Query('menuId') menuId: string,
		@Query('page') page: number,
		@Query('perPage') perPage: number,
	) {
		return await this.dishesService.getDishesByPriceAndMenuIdWithPagination(
			minPrice,
			maxPrice,
			menuId,
			page,
			perPage,
		);
	}

	// Swagger's decorators
	@ApiOperation({ summary: '[NO AUTH] Get dish by id' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'The ID of the dish want to find',
	})
	@CustomSuccessfulApiResponse('Get dish by id successfully', HttpStatus.OK, {
		_id: '660fdc7b70dc7fb614ceaa4b',
		dishName: 'Tra sua do vai lin',
		dishPrice: 20000,
		dishDescription: 'Khong co gi ngon',
		totalOrder: 0,
		menuId: '66083097c11b247adbd84f2a',
		rating: 5,
		dishImages: [
			{
				link: 'http://res.cloudinary.com/ddexbqgmg/image/upload/v1712315515/bepUIT-dishImages/lmskq9koz19kmvcz2uyt.jpg',
				id: 'bepUIT-dishImages/lmskq9koz19kmvcz2uyt',
				_id: '660fdc7b70dc7fb614ceaa4c',
			},
			{
				link: 'http://res.cloudinary.com/ddexbqgmg/image/upload/v1712315515/bepUIT-dishImages/iwuxrcc5wtgzjkasl7v3.jpg',
				id: 'bepUIT-dishImages/iwuxrcc5wtgzjkasl7v3',
				_id: '660fdc7b70dc7fb614ceaa4d',
			},
		],
		slugName:
			'tra-sua-tran-chau-duong-den-nhieu-duong-den-660fdc7b70dc7fb614ceaa4b',
		createdAt: '2024-04-05T11:11:55.702Z',
		updatedAt: '2024-04-05T14:24:40.127Z',
		__v: 0,
	})
	@CustomInternalServerErrorApiResponse('Internal server error')
	@CustomBadRequestApiResponse("Invalid dish's ID")
	@CustomNotFoundApiResponse('No dish found')
	// Controller's decorators
	@Get('/id/:id')
	async getDishById(@Param('id') id: string) {
		return await this.dishesService.getDishById(id);
	}

	// Swagger's decorators
	@ApiOperation({ summary: '[NO AUTH] Get dish by slugname' })
	@ApiParam({
		name: 'slug',
		required: true,
		description: 'The slug name of the dish want to find',
	})
	@CustomSuccessfulApiResponse(
		'Get dish by slug name successfully',
		HttpStatus.OK,
		{
			_id: '660fdc7b70dc7fb614ceaa4b',
			dishName: 'Tra sua do vai lin',
			dishPrice: 20000,
			dishDescription: 'Khong co gi ngon',
			totalOrder: 0,
			menuId: '66083097c11b247adbd84f2a',
			rating: 5,
			dishImages: [
				{
					link: 'http://res.cloudinary.com/ddexbqgmg/image/upload/v1712315515/bepUIT-dishImages/lmskq9koz19kmvcz2uyt.jpg',
					id: 'bepUIT-dishImages/lmskq9koz19kmvcz2uyt',
					_id: '660fdc7b70dc7fb614ceaa4c',
				},
				{
					link: 'http://res.cloudinary.com/ddexbqgmg/image/upload/v1712315515/bepUIT-dishImages/iwuxrcc5wtgzjkasl7v3.jpg',
					id: 'bepUIT-dishImages/iwuxrcc5wtgzjkasl7v3',
					_id: '660fdc7b70dc7fb614ceaa4d',
				},
			],
			slugName:
				'tra-sua-tran-chau-duong-den-nhieu-duong-den-660fdc7b70dc7fb614ceaa4b',
			createdAt: '2024-04-05T11:11:55.702Z',
			updatedAt: '2024-04-05T14:24:40.127Z',
			__v: 0,
		},
	)
	@CustomInternalServerErrorApiResponse('Internal server error')
	@CustomBadRequestApiResponse("Invalid dish's ID")
	@CustomNotFoundApiResponse('No dish found')
	// Controller's decorators
	@Get('/slug/:slug')
	async getDishBySlugName(@Param('slug') slug: string) {
		return await this.dishesService.getDishBySlugName(slug);
	}

	// Swagger's decorators
	@ApiOperation({ summary: '[NO AUTH] Search dishes by name' })
	@ApiQuery({
		name: 'keyword',
		required: true,
		description: 'Keyword used to search',
	})
	@CustomSuccessfulApiResponse(
		'Search dishes by name successfully',
		HttpStatus.OK,
		{
			dishes: [
				{
					_id: '660fdc7b70dc7fb614ceaa4b',
					dishName: 'Tra sua do vai lin',
					dishPrice: 20000,
					dishDescription: 'Khong co gi ngon',
					totalOrder: 0,
					menuId: '66083097c11b247adbd84f2a',
					rating: 5,
					dishImages: [
						{
							link: 'http://res.cloudinary.com/ddexbqgmg/image/upload/v1712315515/bepUIT-dishImages/lmskq9koz19kmvcz2uyt.jpg',
							id: 'bepUIT-dishImages/lmskq9koz19kmvcz2uyt',
							_id: '660fdc7b70dc7fb614ceaa4c',
						},
						{
							link: 'http://res.cloudinary.com/ddexbqgmg/image/upload/v1712315515/bepUIT-dishImages/iwuxrcc5wtgzjkasl7v3.jpg',
							id: 'bepUIT-dishImages/iwuxrcc5wtgzjkasl7v3',
							_id: '660fdc7b70dc7fb614ceaa4d',
						},
					],
					slugName:
						'tra-sua-tran-chau-duong-den-nhieu-duong-den-660fdc7b70dc7fb614ceaa4b',
					createdAt: '2024-04-05T11:11:55.702Z',
					updatedAt: '2024-04-05T14:24:40.127Z',
					__v: 0,
				},
			],
			isLastPage: true,
		},
	)
	@CustomNotFoundApiResponse('[NO AUTH] No dish found')
	@CustomBadRequestApiResponse(
		'Invalid params: page and perPage must be >= 1',
	)
	@CustomInternalServerErrorApiResponse('Internal server error')
	// Controllers's decorators
	@Get('/search')
	async searchDishesByName(@Query('keyword') keyword: string) {
		return await this.dishesService.searchDishesByName(keyword);
	}

	// TODO
	@ApiOperation({
		summary: 'This endpoint is currently under development',
		description:
			'Detailed information about the endpoint will be available once development is complete.',
	})
	@ApiOperation({ summary: '[NO AUTH] Get all reviews of a dish' })
	@Get('/comments/:dishId')
	async getAllCommentsOfDish(@Param('dishId') dishId: string) {
		return await this.dishesService.getAllCommentsOfDish(dishId);
	}

	// Swagger's decorators
	@ApiOperation({ summary: '[NO AUTH] Get some relative dishes' })
	@ApiParam({ name: 'id', required: true, description: 'The ID of the dish' })
	@ApiQuery({
		name: 'number',
		required: true,
		description: 'Number of dishes want to get',
	})
	@CustomSuccessfulApiResponse(
		'Get some relative dishes successfully',
		HttpStatus.OK,
		{
			dishes: [
				{
					_id: '660fdc7b70dc7fb614ceaa4b',
					dishName: 'Tra sua do vai lin',
					dishPrice: 20000,
					dishDescription: 'Khong co gi ngon',
					totalOrder: 0,
					menuId: '66083097c11b247adbd84f2a',
					rating: 5,
					dishImages: [
						{
							link: 'http://res.cloudinary.com/ddexbqgmg/image/upload/v1712315515/bepUIT-dishImages/lmskq9koz19kmvcz2uyt.jpg',
							id: 'bepUIT-dishImages/lmskq9koz19kmvcz2uyt',
							_id: '660fdc7b70dc7fb614ceaa4c',
						},
						{
							link: 'http://res.cloudinary.com/ddexbqgmg/image/upload/v1712315515/bepUIT-dishImages/iwuxrcc5wtgzjkasl7v3.jpg',
							id: 'bepUIT-dishImages/iwuxrcc5wtgzjkasl7v3',
							_id: '660fdc7b70dc7fb614ceaa4d',
						},
					],
					slugName:
						'tra-sua-tran-chau-duong-den-nhieu-duong-den-660fdc7b70dc7fb614ceaa4b',
					createdAt: '2024-04-05T11:11:55.702Z',
					updatedAt: '2024-04-05T14:24:40.127Z',
					__v: 0,
				},
			],
			isLastPage: true,
		},
	)
	@CustomNotFoundApiResponse('No dish found')
	@CustomBadRequestApiResponse('Invalid number parameter')
	@CustomInternalServerErrorApiResponse('Internal server error')
	// Controllers's decorators
	@Get('/relative/:id')
	async getSomeRelativeDishes(
		@Param('id') id: string,
		@Query('number') number: number,
	) {
		return await this.dishesService.getSomeRelativeDishes(id, number);
	}
}
