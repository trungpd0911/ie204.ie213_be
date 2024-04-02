import { HttpException, Injectable, Request } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { responseData } from '../global/globalClass';
import { User } from '../schemas/User.schema';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name) private userModel: Model<User>,
		private cloudinaryService: CloudinaryService
	) { }

	async findUserByEmail(email: string) {
		try {
			const user = await this.userModel.findOne({ email });
			return user;
		} catch (error) {
			throw new Error(error);
		}
	}

	async getAllUsers() {
		try {
			const users = await this.userModel.find().select('-password -role');
			return new responseData(users, 200, 'get all users successfully');
		} catch (error) {
			throw new Error(error);
		}
	}

	async getUserById(id: string) {
		try {
			if (!Types.ObjectId.isValid(id)) {
				return new HttpException('Invalid id', 400);
			}
			const user = await this.userModel.findById(id).select('-password -role');
			if (!user) {
				return new HttpException('User not found', 404);
			}
			return new responseData(user, 200, 'get user by id successfully');
		} catch (error) {
			throw new Error(error);
		}
	}

	async updateUser(userId, id: string, updateUserDto: UpdateUserDto) {
		try {
			if (!Types.ObjectId.isValid(id)) {
				return new HttpException('Invalid id', 400);
			}
			if (userId != id) {
				return new HttpException('Permission denied', 403);
			}
			const user = await this.userModel.findById(id);
			if (!user) {
				return new HttpException('User not found', 404);
			}
			await this.userModel.findByIdAndUpdate(id, updateUserDto);
			return new responseData(null, 200, 'update user successfully');
		} catch (error) {
			throw new Error(error);
		}
	}

	async changeAvatar(id: string, url: string, public_id: string) {
		try {
			console.log(id, url, public_id);

			const user = await this.userModel.findById(id);
			if (!user) {
				return new HttpException('User not found', 404);
			}
			if (user.avatar.link != "https://res.cloudinary.com/dsygiu1h0/image/upload/v1711611594/default-avatar.webp") {
				console.log(user);
				await this.cloudinaryService.deleteFile(public_id);
			}
			user.avatar.link = url;
			user.avatar.publicId = public_id;
			await user.save();
			console.log(user);
			return new responseData(null, 200, 'change avatar successfully');
		} catch (error) {
			throw new Error(error);
		}
	}
}
