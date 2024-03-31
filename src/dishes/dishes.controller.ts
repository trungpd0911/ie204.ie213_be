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
	UseFilters,
} from '@nestjs/common';
import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryResponse } from 'src/cloudinary/cloudinary-response';
import UpdateDishDto from './dto/update-dish.dto';
import { HttpExceptionFilter } from '../global/http-exception.filter';

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

		return this.dishesService.createDish(savedImages, createDishDto);
	}

	@Put('/:id')
	updateDishById(
		@Param('id') id: string,
		@Body() updateDishDto: UpdateDishDto,
	) {
		return this.dishesService.update(+id, updateDishDto);
	}

	@Delete('/:id')
	removeDishById(@Param('id') id: string) {
		return this.dishesService.remove(+id);
	}

	// User role
	@Get('/')
	getAllDishes() {
		return this.dishesService.getAllDishes();
	}

	// @UseFilters(HttpExceptionFilter)
	@Get('/:id')
	getDishById(@Param('id') id: string) {
		return this.dishesService.getDishById(id);
	}

	@Get('/filter')
	getDishesByPriceAndMenuName() {}

	@Get('/search')
	searchDishesByName() {}

	@Get('/comments/:dishId')
	getAllCommentsOfDish(@Param('dishId') dishId: string) {}

	@Get('/relative/:id')
	getSomeRelativeDishes(@Param('id') id: string) {}
}
