import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
				.populate('userId', 'username');
			return new responseData(
				allBills,
				200,
				'get all bills successfully',
			);
		} catch (error) {
			console.log(error);
			throw new InternalServerErrorException(error);
		}
	}

	async addDishToCart(userId, dishId) {
		// check if dishId is type of ObjectId
		if (!dishId || !mongoose.Types.ObjectId.isValid(dishId)) {
			return new responseError(400, 'dishId is not valid');
		}

		try {
			let unpaidBill = await this.billModel.findOne({
				userId,
				billPayed: false,
			});
			if (!unpaidBill) {
				unpaidBill = await this.billModel.create({
					userId: userId,
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
			console.log(error);
			throw new InternalServerErrorException(error);
		}
	}

	async subtractDishFromCart(userId, dishId) {
		// check if dishId is type of ObjectId
		if (!dishId || !mongoose.Types.ObjectId.isValid(dishId)) {
			return new responseError(400, 'dishId is not valid');
		}

		try {
			const unpaidBill = await this.billModel.findOne({
				userId,
				billPayed: false,
			});
			if (!unpaidBill) {
				return new responseError(404, 'bill is not exist');
			} else {
				// check if dish is already in the bill
				const dishExist = unpaidBill.billDishes.find(
					(dish) => dish.dishId == dishId,
				);
				if (!dishExist) {
					return new responseError(
						404,
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
			console.log(error);
			throw new InternalServerErrorException(error);
		}
	}

	async removeDishFromCart(userId, dishId) {
		// check if dishId is type of ObjectId
		if (!dishId || !mongoose.Types.ObjectId.isValid(dishId)) {
			return new responseError(400, 'dishId is not valid');
		}

		try {
			const unpaidBill = await this.billModel.findOne({
				userId,
				billPayed: false,
			});
			if (!unpaidBill) {
				return new responseError(404, 'bill is not exist');
			} else {
				// check if dish is already in the bill
				const dishExist = unpaidBill.billDishes.find(
					(dish) => dish.dishId == dishId,
				);
				if (!dishExist) {
					return new responseError(
						404,
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
			console.log(error);
			throw new InternalServerErrorException(error);
		}
	}

	async resetCart(userId) {
		try {
			const unpaidBill = await this.billModel.findOne({
				userId,
				billPayed: false,
			});
			if (!unpaidBill) {
				return new responseError(404, 'bill is not exist');
			} else {
				unpaidBill.totalMoney = 0;
				unpaidBill.billDishes = [];
			}
			await unpaidBill.save();
			return new responseData(null, 200, 'reset cart successfully');
		} catch (error) {
			console.log(error);
			throw new InternalServerErrorException(error);
		}
	}

	async getAllDishesInCart(userId: string) {
		try {
			const unpaidBill = await this.billModel
				.findOne({ userId, billPayed: false })
				.populate('billDishes.dishId');
			if (!unpaidBill) {
				return new responseError(404, 'bill is not exist');
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
			console.log(error);
			throw new InternalServerErrorException(error);
		}
	}

	async checkoutBill(userId: string, discountId: string) {
		try {
			const unpaidBill = await this.billModel.findOne({
				userId,
				billPayed: false,
			});
			if (!unpaidBill) {
				return new responseError(404, 'bill is not exist');
			}
			if (discountId) {
				// check if discountId is valid
				if (mongoose.Types.ObjectId.isValid(discountId)) {
					return new responseError(400, 'discountId is not valid');
				}
				const discountExist =
					await this.discountModel.findById(discountId);
				if (!discountExist) {
					return new responseError(404, 'discount is not exist');
				}
				// check if discount is expired
				const currentDate = new Date();
				if (discountExist.endDay < currentDate) {
					return new responseError(400, 'discount is expired');
				}
				// check if discount is used
				const userUsedDiscount = discountExist.users.find(
					(user) =>
						user.userId.toString() == userId && user.used == false,
				);
				if (!userUsedDiscount) {
					return new responseError(
						400,
						'discount is not available for this user',
					);
				}
				unpaidBill.totalMoney =
					unpaidBill.totalMoney *
					(1 - discountExist.discountPercent / 100);
				userUsedDiscount.used = true;
				unpaidBill.billPayed = true;
			}
			await unpaidBill.save();
			return new responseData(null, 200, 'checkout bill successfully');
		} catch (error) {
			console.log(error);
			throw new InternalServerErrorException(error);
		}
	}
}
