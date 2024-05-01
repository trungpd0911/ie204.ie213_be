import {
	BadRequestException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Discount } from 'src/schemas/Discount.schema';
import { Model, Types } from 'mongoose';
import { responseData } from 'src/global/globalClass';
import { User } from 'src/schemas/User.schema';

@Injectable()
export class DiscountsService {
	constructor(
		@InjectModel(Discount.name) private discountModel: Model<Discount>,
		@InjectModel(User.name) private userModel: Model<User>,
	) {}
	async createDishcount(createDiscountDto: CreateDiscountDto) {
		// Validate createDiscountDto
		const { discountPercent, startDay, endDay } = createDiscountDto;
		if (discountPercent > 100 || discountPercent < 0) {
			throw new BadRequestException('Invalid discount percent');
		}

		if (startDay > endDay) {
			throw new BadRequestException('Invalid start day and end day');
		}

		const existedDiscount = await this.discountModel.findOne({
			discountName: createDiscountDto.discountName,
		});
		console.log(existedDiscount);

		if (existedDiscount) {
			throw new BadRequestException('Discount existed');
		}

		try {
			const discount = new this.discountModel(createDiscountDto);
			const savedDiscount = await discount.save();

			return new responseData(
				savedDiscount,
				HttpStatus.CREATED,
				'Discount is created successfully',
			);
		} catch (e) {
			throw new InternalServerErrorException(e);
		}
	}

	async getAllDiscounts() {
		try {
			const discounts = await this.discountModel.find();
			return new responseData(
				discounts,
				HttpStatus.OK,
				'Get all discounts successfully',
			);
		} catch (e) {
			throw new InternalServerErrorException(e);
		}
	}

	async getDiscountById(id: string) {
		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException('Invalid id');
		}

		let discount = null;
		try {
			discount = await this.discountModel.findById(id);
		} catch (e) {
			throw new InternalServerErrorException(e);
		}

		if (!discount) {
			throw new NotFoundException('Discount not found');
		}

		return new responseData(
			discount,
			HttpStatus.OK,
			'Get discount by id successfully',
		);
	}

	async removeDiscount(id: string) {
		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException('Invalid id');
		}

		const discount = await this.discountModel.findById(id);
		if (!discount) {
			throw new NotFoundException('Discount not found');
		}

		try {
			// TODO : Remove discount in user's discount list

			await this.discountModel.deleteOne({ _id: id });
			return new responseData(
				null,
				HttpStatus.OK,
				'Discount is deleted successfully',
			);
		} catch (e) {
			throw new InternalServerErrorException(e);
		}
	}

	async assignDiscountsToAllUsers(discountId: string) {
		if (!Types.ObjectId.isValid(discountId)) {
			throw new BadRequestException('Invalid discount id');
		}

		const foundDiscount = await this.discountModel.findById(discountId);
		if (!foundDiscount) {
			throw new NotFoundException('Discount not found');
		}

		// Find all users
		const users = await this.userModel.find();

		// Update each user to have the provided discount
		await Promise.all(
			users.map(async (user) => {
				const existedDiscount = user.discounts.find(
					(discount) => discount['_id'] == foundDiscount._id,
				);
				console.log('Existed discount: ', existedDiscount);

				if (!existedDiscount) {
					const newDiscountOfUser = {
						discountId: foundDiscount,
						used: false,
					};
					user.discounts.push(newDiscountOfUser);
					await user.save();
				}
			}),
		);

		return new responseData(
			null,
			HttpStatus.OK,
			'Assign discount to all users successfully',
		);
	}

	// async assignDiscountsToTopPurchaseUsers(discountId: string) {}

	async getAllUsersDiscounts(userId: string) {
		if (!Types.ObjectId.isValid(userId)) {
			throw new BadRequestException('Invalid user id');
		}

		let user = null;
		try {
			user = await this.userModel.findById(userId);
		} catch (e) {
			throw new InternalServerErrorException(e);
		}

		if (!user) {
			throw new NotFoundException('User not found');
		}

		// Get full discounts from discountIds
		const result = await Promise.all(
			user.discounts.map(async (discount) => {
				return {
					discount: await this.discountModel.findById(
						discount.discountId,
					),
					used: discount.used,
				};
			}),
		);

		return new responseData(
			result,
			HttpStatus.OK,
			"Get all user's discount successfully",
		);
	}

	async removeDiscountFromAllUsers(discountId: string) {
		if (!Types.ObjectId.isValid(discountId)) {
			throw new BadRequestException('Invalid discount id');
		}

		const foundDiscount = await this.discountModel.findById(discountId);
		if (!foundDiscount) {
			throw new NotFoundException('Discount not found');
		}

		// Find all users
		const users = await this.userModel.find();

		// Delete discount from all users
		await Promise.all(
			users.map(async (user) => {
				user.discounts = user.discounts.filter(
					(discount) =>
						discount && discount.discountId['_id'] != discountId,
				);
				await user.save();
			}),
		);

		return new responseData(
			null,
			HttpStatus.OK,
			'Remove discount from all users successfully',
		);
	}
}
