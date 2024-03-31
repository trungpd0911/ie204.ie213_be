import {
	BadRequestException,
	HttpException,
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
			new HttpException(e, 500);
		}
	}

	async getAllDishes() {
		try {
			const dishes = await this.dishModel.find();
			return new responseData(dishes, 200, 'Get all dishes successfully');
		} catch (e) {
			new HttpException(e, 500);
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

	update(id: number, updateDishDto: UpdateDishDto) {
		return `This action updates a #${id} dish`;
	}

	remove(id: number) {
		return `This action removes a #${id} dish`;
	}
}
