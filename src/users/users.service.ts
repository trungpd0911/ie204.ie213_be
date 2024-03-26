import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { responseData } from '../global/globalClass';
import { User } from '../schemas/User.schema';

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private userModel: Model<User>) { }

	async getAllUsers() {
		try {
			const users = await this.userModel.find().select('-password -role');
			return new responseData(users, 200, 'get all users successfully');
		} catch (error) {
			throw new Error(error);
		}
	}

	async findByEmail(email: string) {
		const user = await this.userModel.findOne({
			email: email,
		});
		return user;
	}
}
