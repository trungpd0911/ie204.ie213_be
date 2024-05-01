import {
	BadRequestException,
	HttpException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	Request,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { responseData, responseError } from '../global/globalClass';
import { User } from '../schemas/User.schema';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AuthService } from '../auth/auth.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Response } from 'express';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name) private userModel: Model<User>,
		private cloudinaryService: CloudinaryService,
		private authService: AuthService,
		private mailerService: MailerService,
	) {}

	async findUserByEmail(email: string) {
		try {
			const user = await this.userModel
				.findOne({ email })
				.select('-password');
			return user;
		} catch (error) {
			if (error instanceof InternalServerErrorException) {
				console.log(error);
			}
			throw error;
		}
	}

	async findUserById(id: string) {
		try {
			const user = await this.userModel.findById(id).select('-password');
			return user;
		} catch (error) {
			throw error;
		}
	}

	async getAllUsers() {
		try {
			const users = await this.userModel.find().select('-password -role');
			return new responseData(users, 200, 'get all users successfully');
		} catch (error) {
			if (error instanceof InternalServerErrorException) {
				console.log(error);
			}
			throw error;
		}
	}

	async getUserById(id: string) {
		try {
			if (!Types.ObjectId.isValid(id)) {
				return new HttpException('Invalid id', 400);
			}
			const user = await this.userModel
				.findById(id)
				.select('-password -role');
			if (!user) {
				throw new NotFoundException('User not found');
			}
			return new responseData(user, 200, 'get user by id successfully');
		} catch (error) {
			if (error instanceof InternalServerErrorException) {
				console.log(error);
			}
			throw error;
		}
	}

	async updateUser(userId, id: string, updateUserDto: UpdateUserDto) {
		try {
			if (!Types.ObjectId.isValid(id)) {
				throw new BadRequestException('Invalid id');
			}
			if (userId != id) {
				throw new UnauthorizedException('Permission denied');
			}
			const user = await this.userModel.findById(id);
			if (!user) {
				throw new NotFoundException('User not found');
			}
			await this.userModel.findByIdAndUpdate(id, updateUserDto);
			return new responseData(null, 200, 'update user successfully');
		} catch (error) {
			if (error instanceof InternalServerErrorException) {
				console.log(error);
			}
			throw error;
		}
	}

	async changeAvatar(id: string, url: string, public_id: string) {
		try {
			console.log(id, url, public_id);

			const user = await this.userModel.findById(id);
			if (!user) {
				return new HttpException('User not found', 404);
			}
			if (
				user.avatar.link !=
				'https://res.cloudinary.com/dsygiu1h0/image/upload/v1711611594/default-avatar.webp'
			) {
				console.log(user);
				await this.cloudinaryService.deleteFile(public_id);
			}
			user.avatar.link = url;
			user.avatar.publicId = public_id;
			await user.save();
			console.log(user);
			return new responseData(null, 200, 'change avatar successfully');
		} catch (error) {
			if (error instanceof InternalServerErrorException) {
				console.log(error);
			}
			throw error;
		}
	}

	async changePassword(id: string, oldPassword: string, newPassword: string) {
		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException('Invalid id');
		}
		try {
			const user = await this.userModel.findById(id);
			if (!user) {
				throw new BadRequestException('User not found');
			}
			const checkPassword = await this.authService.comparePassword(
				oldPassword,
				user.password,
			);
			if (!checkPassword) {
				throw new BadRequestException('wrong password');
			}
			// check new password contain at least 8 characters and at least 1 letter
			const regex = /^(?=.*[A-Za-z]).+$/;
			if (newPassword.length < 8 || !regex.test(newPassword)) {
				throw new UnauthorizedException(
					'Password must contain at least 8 characters and at least 1 letter',
				);
			}
			const hashedPassword =
				await this.authService.hashPassword(newPassword);
			user.password = hashedPassword;
			await user.save();
			return new responseData(null, 200, 'change password successfully');
		} catch (error) {
			if (error instanceof InternalServerErrorException) {
				console.log(error);
			}
			throw error;
		}
	}

	async forgotPassword(email: string) {
		try {
			const user = await this.userModel.findOne({ email: email });
			if (!user) {
				throw new NotFoundException('User not found');
			}
			// random new password contains 10 characters and at least 1 letter
			const newPassword = Math.random().toString(36).slice(-10);
			await this.mailerService.sendMail({
				to: email,
				subject: 'Forgot Password',
				html: `<!DOCTYPE html>
                <html lang="en">
                
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>New Password</title>
                </head>
                
                <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
                    <table
                        style="max-width: 600px; margin: auto; background-color: rgb(250, 250, 250); padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                        <tr>
                            <td style="text-align: center;">
                                <h2 style="color: #333;">Bếp UIT</h2>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p style="color: #242424;">Hi ${user.username},</p>
                                <p style="color: #242424;">We receive your request to reset your password. Please use the following
                                    password to log in: </p>
                                <div
                                    style="font-size: 1.2em; padding: 10px; background-color: #f9f9f9; border-radius: 5px; word-wrap: break-word; overflow-wrap: break-word; color: #333; text-align: center; position: relative;">
                                    <!-- Place the generated password here -->
                                    ${newPassword}
                                    <div style="position: absolute; right: 32%; top: 28%;cursor: pointer;">
                                        <i style="font-size: 1.5em; color: #333;" class="fas fa-copy" id="copy"></i>
                                    </div>
                                </div>
                                <p style="color: #242424; margin-bottom: 10px;">If you did not request a new password, please let us
                                    know
                                    immediately by replying to
                                    this email. We recommend changing your password after logging in for security purposes.</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: center;">
                                <p style="color: #242424;">Thank you for using our services!</p>
                            </td>
                        </tr>
                    </table>
                </body>
                
                </html>`,
				// template: 'emailForgotPassword',
				// context: {
				// 	name: user.username,
				// 	newPassword: newPassword,
				// },
			});
			const hashedPassword =
				await this.authService.hashPassword(newPassword);
			user.password = hashedPassword;
			await user.save();
			return new responseData(
				null,
				200,
				'new password has been sent to your email',
			);
		} catch (error) {
			if (error instanceof InternalServerErrorException) {
				console.log(error);
			}
			throw error;
		}
	}
}
