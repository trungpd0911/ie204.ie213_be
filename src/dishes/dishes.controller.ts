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
} from '@nestjs/common';
import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryResponse } from 'src/cloudinary/cloudinary-response';
import UpdateDishDto from './dto/update-dish.dto';

@Controller('dishes')
export class DishesController {
	constructor(
		private readonly dishesService: DishesService,
		private cloudinaryService: CloudinaryService,
	) {}

	// Admin role
	@Post('/')
	@UseInterceptors(FilesInterceptor('images'))
	async createDish(
		@Body() createDishDto: CreateDishDto,
		@UploadedFiles() dishImages: Express.Multer.File[],
		@Res() response: Response,
	) {
		// Cloudinary Response contains: image's url, ...
		let savedImages: CloudinaryResponse[] = [];
		if (dishImages) {
			savedImages =
				await this.cloudinaryService.uploadDishImages(dishImages);
		}

		return await this.dishesService.createDish(savedImages, createDishDto);
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

	@Get('/:id')
	async getDishById(@Param('id') id: string) {
		return await this.dishesService.getDishById(id);
	}

	@Get('/filter')
	async getDishesByPriceAndMenuName() {}

	@Get('/search')
	async searchDishesByName() {}

	@Get('/comments/:dishId')
	async getAllCommentsOfDish(@Param('dishId') dishId: string) {}

	@Get('/relative/:id')
	async getSomeRelativeDishes(@Param('id') id: string) {}
}
