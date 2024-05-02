import {
	BadRequestException,
	ForbiddenException,
	HttpException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { responseData, responseError } from '../global/globalClass';
import { Bill } from '../schemas/Bill.schema';
import { Dish } from '../schemas/Dish.schema';
import { Discount } from '../schemas/Discount.schema';

@Injectable()
export class BillService {
	constructor(
		@InjectModel(Bill.name) private billModel: Model<Bill>,
		@InjectModel(Dish.name) private dishModel: Model<Dish>,
		@InjectModel(Discount.name) private discountModel: Model<Discount>,
	) {}

	async getAllBills() {
		try {
			// select username, id from users
			const allBills = await this.billModel
				.find()
				.populate('user', 'username');
			return new responseData(
				allBills,
				200,
				'get all bills successfully',
			);
		} catch (error) {
			if (error instanceof InternalServerErrorException) {
				throw new InternalServerErrorException(error);
			}
			throw error;
		}
	}

	async addDishToCart(userId, dishId) {
		// check if dishId is type of ObjectId
		if (!dishId || !mongoose.Types.ObjectId.isValid(dishId)) {
			throw new BadRequestException('dishId is not valid');
		}

		try {
			let unpaidBill = await this.billModel.findOne({
				user: userId,
				billPayed: false,
			});
			if (!unpaidBill) {
				unpaidBill = await this.billModel.create({
					user: userId,
					billDate: Date.now(),
					totalMoney: 0,
					billPayed: false,
				});
				// add dish to bill
				unpaidBill.billDishes.push({ dishId, dishAmount: 1 });
			} else {
				// check if dish is already in the bill
				const dishExist = unpaidBill.billDishes.find(
					(dish) => dish.dishId == dishId,
				);
				if (dishExist) {
					dishExist.dishAmount += 1;
				} else {
					unpaidBill.billDishes.push({ dishId, dishAmount: 1 });
				}
			}
			// plus dish price to totalMoney
			const dishPrice = await this.dishModel.findById(dishId);
			unpaidBill.totalMoney += dishPrice.dishPrice;
			await unpaidBill.save();
			return new responseData(null, 200, 'add dish to cart successfully');
		} catch (error) {
			if (error instanceof InternalServerErrorException) {
				throw new InternalServerErrorException(error);
			}
			throw error;
		}
	}

	async subtractDishFromCart(userId, dishId) {
		// check if dishId is type of ObjectId
		if (!dishId || !mongoose.Types.ObjectId.isValid(dishId)) {
			throw new BadRequestException('dishId is not valid');
		}

		try {
			const unpaidBill = await this.billModel.findOne({
				user: userId,
				billPayed: false,
			});
			if (!unpaidBill) {
				throw new NotFoundException('bill is not exist');
			} else {
				// check if dish is already in the bill
				const dishExist = unpaidBill.billDishes.find(
					(dish) => dish.dishId == dishId,
				);
				if (!dishExist) {
					throw new NotFoundException(
						'dish is not exist in the bill',
					);
				} else {
					if (dishExist.dishAmount > 1) {
						dishExist.dishAmount -= 1;
					} else {
						// remove dish from bill if dishAmount = 1
						unpaidBill.billDishes = unpaidBill.billDishes.filter(
							(dish) => dish.dishId != dishId,
						);
					}
				}
			}
			// minus dish price to totalMoney
			const dishPrice = await this.dishModel.findById(dishId);
			unpaidBill.totalMoney -= dishPrice.dishPrice;
			await unpaidBill.save();
			return new responseData(
				null,
				200,
				'subtract dish from cart successfully',
			);
		} catch (error) {
			if (error instanceof InternalServerErrorException) {
				throw new InternalServerErrorException(error);
			}
			throw error;
		}
	}

	async removeDishFromCart(userId, dishId) {
		// check if dishId is type of ObjectId
		if (!dishId || !mongoose.Types.ObjectId.isValid(dishId)) {
			throw new BadRequestException('dishId is not valid');
		}

		try {
			const unpaidBill = await this.billModel.findOne({
				user: userId,
				billPayed: false,
			});
			if (!unpaidBill) {
				throw new NotFoundException('bill is not exist');
			} else {
				// check if dish is already in the bill
				const dishExist = unpaidBill.billDishes.find(
					(dish) => dish.dishId == dishId,
				);
				if (!dishExist) {
					throw new NotFoundException(
						'dish is not exist in the bill',
					);
				} else {
					const dishPrice = await this.dishModel.findById(dishId);
					// update totalMoney
					unpaidBill.totalMoney -=
						dishPrice.dishPrice * dishExist.dishAmount;
					// remove dish from bill
					unpaidBill.billDishes = unpaidBill.billDishes.filter(
						(dish) => dish.dishId != dishId,
					);
				}
			}
			await unpaidBill.save();
			return new responseData(
				null,
				200,
				'remove dish from cart successfully',
			);
		} catch (error) {
			if (error instanceof InternalServerErrorException) {
				throw new InternalServerErrorException(error);
			}
			throw error;
		}
	}

	async resetCart(userId) {
		try {
			const unpaidBill = await this.billModel.findOne({
				user: userId,
				billPayed: false,
			});
			if (!unpaidBill) {
				throw new NotFoundException('bill is not exist');
			} else {
				unpaidBill.totalMoney = 0;
				unpaidBill.billDishes = [];
			}
			await unpaidBill.save();
			return new responseData(null, 200, 'reset cart successfully');
		} catch (error) {
			if (error instanceof InternalServerErrorException) {
				throw new InternalServerErrorException(error);
			}
			throw error;
		}
	}

	async getAllDishesInCart(userId: string) {
		try {
			const unpaidBill = await this.billModel
				.findOne({ user: userId, billPayed: false })
				.populate('billDishes.dishId');
			if (!unpaidBill) {
				return new responseData([], 200, 'cart is empty');
			}
			const allDishes = unpaidBill.billDishes;
			// get all dishes and the count of each dish in the bill from dishModel
			const dishes = await Promise.all(
				allDishes.map(async (dish) => {
					// only select dishName, dishPrice, dishImages, _id from dishModel
					const dishDetail = await this.dishModel.findById(
						dish.dishId,
						'dishName dishPrice dishImages',
					);
					return {
						...dishDetail.toObject(),
						dishAmount: dish.dishAmount,
					};
				}),
			);
			return new responseData(
				dishes,
				200,
				'get all dishes in cart successfully',
			);
		} catch (error) {
			if (error instanceof InternalServerErrorException) {
				throw new InternalServerErrorException(error);
			}
			throw error;
		}
	}

	async getAllDishesInBill(billId: string, userId: string) {
		if (
			!billId ||
			!mongoose.Types.ObjectId.isValid(billId) ||
			!userId ||
			!mongoose.Types.ObjectId.isValid(userId)
		) {
			throw new BadRequestException('billId is not valid');
		}
		try {
			const paidBill = await this.billModel.findById(billId).findOne({
				billPayed: true,
			});
			if (!paidBill) {
				throw new NotFoundException('bill is not exist');
			}
			if (paidBill.user.toString() !== userId.toString()) {
				throw new ForbiddenException(
					'you are not allowed to view this bill',
				);
			}
			const allDishes = paidBill.billDishes;
			// get all dishes and the count of each dish in the bill from dishModel
			const dishes = await Promise.all(
				allDishes.map(async (dish) => {
					// only select dishName, dishPrice, dishImages, _id from dishModel
					const dishDetail = await this.dishModel
						.findById(dish.dishId)
						.select('dishName dishPrice dishImages');
					if (!dishDetail) {
						throw new NotFoundException('dish is not exist');
					}
					return {
						...dishDetail.toObject(),
						dishAmount: dish.dishAmount,
					};
				}),
			);
			return new responseData(
				dishes,
				200,
				'get all dishes in bill successfully',
			);
		} catch (error) {
			if (error instanceof InternalServerErrorException) {
				throw new InternalServerErrorException(error);
			}
			throw error;
		}
	}

	async getAllBillOfUser(userId: string) {
		if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
			throw new BadRequestException('userId is not valid');
		}
		try {
			const allBills = await this.billModel.find({
				user: userId,
				billPayed: true,
			});
			return new responseData(
				allBills,
				200,
				'get all bill of user successfully',
			);
		} catch (error) {
			if (error instanceof InternalServerErrorException) {
				throw new InternalServerErrorException(error);
			}
			throw error;
		}
	}

	async adminCheckoutBill(billId: string, discountId: string) {
		if (!billId || !mongoose.Types.ObjectId.isValid(billId)) {
			throw new BadRequestException('billId is not valid');
		}
		if (discountId && !mongoose.Types.ObjectId.isValid(discountId)) {
			throw new BadRequestException('discountId is not valid');
		}
		try {
			const unpaidBill = await this.billModel.findById(billId).findOne({
				billPayed: false,
			});
			if (!unpaidBill) {
				throw new NotFoundException('bill is not exist');
			}
			if (discountId) {
				const discountExist =
					await this.discountModel.findById(discountId);
				if (!discountExist) {
					throw new NotFoundException('discount is not exist');
				}
				const currentDate = new Date();
				if (discountExist.endDay < currentDate) {
					throw new UnauthorizedException('discount is expired');
				}
				const userUsedDiscount = discountExist.users.find(
					(user) =>
						user.userId.toString() == unpaidBill.user.toString() &&
						user.used == false,
				);
				if (!userUsedDiscount) {
					throw new UnauthorizedException(
						'discount is not available for this user',
					);
				}
				unpaidBill.totalMoney =
					unpaidBill.totalMoney *
					(1 - discountExist.discountPercent / 100);
				userUsedDiscount.used = true;
			}
			// if don't have discount
			unpaidBill.billPayed = true;
			await unpaidBill.save();
			return new responseData(
				null,
				200,
				'admin checkout bill successfully',
			);
		} catch (error) {
			if (error instanceof InternalServerErrorException) {
				throw new InternalServerErrorException(error);
			}
			throw error;
		}
	}

	async checkoutBill(userId: string, discountId: string) {
		try {
			const unpaidBill = await this.billModel.findOne({
				user: userId,
				billPayed: false,
			});
			if (!unpaidBill) {
				throw new NotFoundException('bill is not exist');
			}
			if (discountId) {
				// check if discountId is valid
				if (mongoose.Types.ObjectId.isValid(discountId)) {
					throw new BadRequestException('discountId is not valid');
				}
				const discountExist =
					await this.discountModel.findById(discountId);
				if (!discountExist) {
					throw new NotFoundException('discount is not exist');
				}
				// check if discount is expired
				const currentDate = new Date();
				if (discountExist.endDay < currentDate) {
					throw new BadRequestException('discount is expired');
				}
				// check if discount is used
				const userUsedDiscount = discountExist.users.find(
					(user) =>
						user.userId.toString() == userId && user.used == false,
				);
				if (!userUsedDiscount) {
					throw new NotFoundException(
						'discount is not available for this user',
					);
				}
				unpaidBill.totalMoney =
					unpaidBill.totalMoney *
					(1 - discountExist.discountPercent / 100);
				userUsedDiscount.used = true;
				unpaidBill.billPayed = true;
			}
			// if don't have discount
			unpaidBill.billPayed = true;
			await unpaidBill.save();
			return new responseData(null, 200, 'checkout bill successfully');
		} catch (error) {
			if (error instanceof InternalServerErrorException) {
				throw new InternalServerErrorException(error);
			}
			throw error;
		}
	}

	async checkoutBillImmediately(
		userId: string,
		dishId: string,
		amount: number,
		discountId: string,
	) {
		if (!dishId || !mongoose.Types.ObjectId.isValid(dishId)) {
			throw new BadRequestException('dishId is not valid');
		}
		if (!amount || amount < 1) {
			throw new BadRequestException('amount is not valid');
		}
		try {
			const dishExist = await this.dishModel.findById(dishId);
			if (!dishExist) {
				throw new NotFoundException('dish is not exist');
			}
			let totalMoney = dishExist.dishPrice * amount;
			if (discountId) {
				const discountExist =
					await this.discountModel.findById(discountId);
				if (!discountExist) {
					throw new NotFoundException('discount is not exist');
				}
				const currentDate = new Date();
				if (discountExist.endDay < currentDate) {
					throw new UnauthorizedException('discount is expired');
				}
				const userUsedDiscount = discountExist.users.find(
					(user) =>
						user.userId.toString() == userId && user.used == false,
				);
				if (!userUsedDiscount) {
					throw new UnauthorizedException(
						'discount is not available for this user',
					);
				}
				totalMoney =
					totalMoney * (1 - discountExist.discountPercent / 100);
				userUsedDiscount.used = true;
			}
			const newBill = await this.billModel.create({
				user: userId,
				billDate: Date.now(),
				totalMoney,
				billPayed: true,
				billDishes: [{ dishId, dishAmount: amount }],
			});
			await newBill.save();
			return new responseData(
				null,
				200,
				'checkout bill immediately successfully',
			);
		} catch (error) {
			if (error instanceof InternalServerErrorException) {
				throw new InternalServerErrorException(error);
			}
			throw error;
		}
	}
}
