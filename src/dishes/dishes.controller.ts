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
} from '@nestjs/common';
import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryResponse } from 'src/cloudinary/cloudinary-response';
import UpdateDishDto from './dto/update-dish.dto';

@Controller('dishes')
export class DishesController {
	constructor(private readonly dishesService: DishesService) {}

	// Admin role
	@Post('/')
	@UseInterceptors(FilesInterceptor('images'))
	async createDish(
		@Body() createDishDto: CreateDishDto,
		@UploadedFiles() dishImages: Express.Multer.File[],
	) {
		return await this.dishesService.createDish(dishImages, createDishDto);
	}

	@Put('/:id')
	async updateDishById(
		@Param('id') id: string,
		@Body() updateDishDto: UpdateDishDto,
	) {
		return await this.dishesService.updateDishById(id, updateDishDto);
	}

	@Delete('/:id')
	async removeDishById(@Param('id') id: string) {
		return await this.dishesService.removeDishById(id);
	}

	// User role
	@Get('/')
	async getAllDishes() {
		return await this.dishesService.getAllDishes();
	}

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

	@Get('/search')
	async searchDishesByName(@Query('keyword') keyword: string) {
		console.log(keyword);
		return await this.dishesService.searchDishesByName(keyword);
	}

	@Get('/comments/:dishId')
	async getAllCommentsOfDish(@Param('dishId') dishId: string) {}

	@Get('/relative/:id')
	async getSomeRelativeDishes(
		@Param('id') id: string,
		@Query('number') number: number,
	) {
		return await this.dishesService.getSomeRelativeDishes(id, number);
	}

	// Place this route at the bottom to prioritize other routes (search, filter, ...)
	@Get('/:id')
	async getDishById(@Param('id') id: string) {
		return await this.dishesService.getDishById(id);
	}
}
