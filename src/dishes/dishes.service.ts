import {
	BadRequestException,
	HttpException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { CreateDishDto } from './dto/create-dish.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Dish } from 'src/schemas/Dish.schema';
import { Model, Types } from 'mongoose';
import { responseData } from 'src/global/globalClass';
import { CloudinaryResponse } from 'src/cloudinary/cloudinary-response';
import UpdateDishDto from './dto/update-dish.dto';
import { configSlug } from '../helper/slug.helper';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class DishesService {
	constructor(
		@InjectModel(Dish.name) private dishModel: Model<Dish>,
		private cloudinaryService: CloudinaryService,
	) { }

	async createDish(
		dishImages: Express.Multer.File[],
		createDishDto: CreateDishDto,
	) {
		try {
			// Check if the dish name existed
			const isExisted = await this.dishModel.findOne({
				dishName: createDishDto.dishName,
			});
			if (isExisted) {
				throw new HttpException(
					'This dish name has already existed',
					400,
				);
			}

			// Create dish images in cloudinary
			let savedImages: CloudinaryResponse[] = [];
			if (dishImages) {
				savedImages =
					await this.cloudinaryService.uploadDishImages(dishImages);
			}

			// Get image dish files array
			const imageFileUrls = savedImages.map((image) => ({
				link: image.url,
				id: image.public_id,
			}));

			// Create dish
			const newDish = new this.dishModel({
				...createDishDto,
				dishImages: imageFileUrls,
			});

			// Create slugname of dish
			newDish.slugName =
				configSlug.convertToSlug(newDish.dishName) + '-' + newDish._id + '.html';
			const createdDish = await newDish.save();

			// Success response
			return new responseData(
				createdDish,
				201,
				'Dish created successfully',
			);
		} catch (e) {
			throw new HttpException(e, 500);
		}
	}

	async getAllDishes() {
		try {
			const dishes = await this.dishModel.find();

			if (dishes.length == 0) {
				throw new NotFoundException('No dish found');
			}
			return new responseData(dishes, 200, 'Get all dishes successfully');
		} catch (e) {
			throw new HttpException(e, 500);
		}
	}

	async getDishById(id: string) {
		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException('Invalid id');
		}

		try {
			const dish = await this.dishModel.findById(id);

			// Check if dish exists
			if (!dish) {
				throw new NotFoundException('Dish not found');
			}

			return new responseData(dish, 200, 'Get dish by id successfully');
		} catch (e) {
			throw new InternalServerErrorException(e);
		}
	}

	async updateDishById(id: string, updateDishDto: UpdateDishDto) {
		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException('Invalid id');
		}

		try {
			const dish = await this.dishModel.findById(id);
			if (dish == null) {
				throw new NotFoundException('Dish not found');
			}

			const updatedDish = await this.dishModel.findByIdAndUpdate(
				id,
				updateDishDto,
				{
					new: true,
				},
			);
			return new responseData(
				updatedDish,
				HttpStatus.OK,
				'Dish is updated successfully',
			);
		} catch (e) {
			throw new InternalServerErrorException(e);
		}
	}

	async removeDishById(id: string) {
		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException('Invalid id');
		}

		try {
			const dish = await this.dishModel.findById(id);
			if (dish == null) {
				throw new NotFoundException('Dish not found');
			}

			// Remove all images of the dish
			for (const image of dish.dishImages) {
				try {
					console.log(image.id);
					await this.cloudinaryService.deleteFile(image.id);
				} catch (e) {
					console.log(e);
				}
			}

			// Remove dish
			await this.dishModel.deleteOne({ _id: id });
			return new responseData(
				null,
				HttpStatus.OK,
				'Dish is deleted successfully',
			);
		} catch (e) {
			throw new InternalServerErrorException(e);
		}
	}

	async searchDishesByName(keyword: string) {
		if (keyword == null || keyword == undefined) {
			throw new BadRequestException('Invalid keyword parameter');
		}

		try {
			// Ignore case sensitive
			const dishes = await this.dishModel.find({
				dishName: { $regex: '.*' + keyword + '.*' },
			});

			if (dishes === null || dishes.length === 0) {
				throw new NotFoundException('No dishes found');
			}

			return new responseData(
				dishes,
				HttpStatus.OK,
				'Search dishes by name successfully',
			);
		} catch (e) {
			throw new InternalServerErrorException(e);
		}
	}

	async getAllDishesWithPagination(page: number, perPage: number) {
		// Validate request parameters
		if (!page || !perPage || page < 1 || perPage < 1) {
			throw new BadRequestException(
				'Invalid params: page and perPage must be >= 1',
			);
		}

		try {
			// Find with pagination
			const dishes = await this.dishModel
				.find()
				.skip(perPage * (page - 1))
				.limit(perPage);

			if (dishes.length == 0) {
				throw new NotFoundException('No dish found');
			}

			// Check if this is the last page
			const totalDishes = await this.dishModel.countDocuments();
			const totalPages = Math.ceil(totalDishes / perPage);
			const isLastPage = page >= totalPages;

			const data = {
				dishes: dishes,
				isLastPage: isLastPage,
			};

			return new responseData(
				data,
				200,
				'Get all dishes with pagination successfully',
			);
		} catch (e) {
			throw new HttpException(e, 500);
		}
	}

	async getDishesByPriceAndMenuIdWithPagination(
		minPrice: number,
		maxPrice: number,
		menuId: string,
		page: number,
		perPage: number,
	) {
		// Check request params
		if (minPrice && maxPrice && minPrice > maxPrice) {
			throw new BadRequestException(
				'Invalid params: Min price must be greater than max price',
			);
		}

		if (!page || !perPage || page < 1 || perPage < 1) {
			throw new BadRequestException(
				'Invalid params: page and perPage must be >= 1',
			);
		}

		try {
			// Build filter using price range and menu ID
			const DEFAULT_MAX_PRICE = 1000000000;
			const DAFAULT_MIN_PRICE = 0;

			const filter = {
				dishPrice: {
					$lte: maxPrice || DEFAULT_MAX_PRICE,
					$gte: minPrice || DAFAULT_MIN_PRICE,
				},
			};

			if (menuId) {
				Object.assign(filter, { menuId: menuId });
			}

			// Search result
			const dishes = await this.dishModel
				.find(filter)
				.skip(perPage * (page - 1))
				.limit(perPage);

			if (dishes === null || dishes.length === 0) {
				throw new NotFoundException('No dishes found');
			}

			// Check if this is the last page
			const totalDishes = await this.dishModel.countDocuments();
			const totalPages = Math.ceil(totalDishes / perPage);
			const isLastPage = page >= totalPages;

			const data = {
				dishes: dishes,
				isLastPage: isLastPage,
			};

			return new responseData(
				data,
				HttpStatus.OK,
				'Filter dishes by price and memu ID successfully',
			);
		} catch (e) {
			throw new InternalServerErrorException(e);
		}
	}

	// STRATEGY: Random a number of dishes in the same menu
	async getSomeRelativeDishes(id: string, number: number) {
		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException('Invalid id');
		}

		if (number <= 0) {
			throw new BadRequestException('Invalid number parameter');
		}

		try {
			const requestedDish = await this.dishModel.findById(id);
			if (!requestedDish) {
				throw new NotFoundException('Dish not found');
			}

			// Get random dishes
			const menuId = requestedDish.menuId;
			const randomDishes = await this.dishModel.aggregate([
				{ $match: { menuId: menuId } },
				{ $sample: { size: number } },
			]);

			return new responseData(
				randomDishes,
				HttpStatus.OK,
				'Get some relative dishes successfully',
			);
		} catch (e) {
			throw new InternalServerErrorException(e);
		}
	}
}
