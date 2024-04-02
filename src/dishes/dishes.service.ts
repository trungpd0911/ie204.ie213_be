import {
	BadRequestException,
	HttpException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { CreateDishDto } from './dto/create-dish.dto';
// import { UpdateDishDto } from './dto/update-dish.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Dish } from 'src/schemas/Dish.schema';
import { Model, Types } from 'mongoose';
import { responseData } from 'src/global/globalClass';
import { CloudinaryResponse } from 'src/cloudinary/cloudinary-response';
import UpdateDishDto from './dto/update-dish.dto';

@Injectable()
export class DishesService {
	constructor(@InjectModel(Dish.name) private dishModel: Model<Dish>) {}

	async createDish(
		images: CloudinaryResponse[],
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

			// Get image dish files array
			const imageFileUrls = images.map((image) => ({
				link: image.url,
			}));

			// Create dish and save
			const newDish = new this.dishModel({
				...createDishDto,
				dishImages: imageFileUrls,
			});
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
		try {
			// Check if id is valid
			if (!Types.ObjectId.isValid(id)) {
				throw new BadRequestException('Invalid id');
			}

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
		try {
			const dish = await this.dishModel.findById(id);
			if (dish == null) {
				throw new NotFoundException('Dish not found');
			}

			// Todo: Need to remove all images of the dish

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
}
