import { Body, Controller, Get, Param, Post, Put, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { RoleGuard } from '../guards/role.guard';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { currentUser } from './decorators/currentUser.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { responseData, responseError } from 'src/global/globalClass';
import { updateUserDto } from './dto/updateUser.dto';
import { invalidIdResponse, permissionErrorResponse, serverErrorResponse, tokenErrorResponse } from 'src/global/api-responses';

// swagger
@ApiBearerAuth()
@ApiTags('users')
// controller
@Controller('users')
@serverErrorResponse
export class UsersController {
	constructor(
		private userService: UsersService,
		private cloudinaryService: CloudinaryService
	) { }

	@Get()
	@ApiResponse({
		status: 200, description: 'get all users successfully', schema: {
			example: new responseData([{
				"_id": "6604e19d8298d9a32762005b",
				"username": "trungphan",
				"email": "trungphan@gmail.com",
				"tables": [],
				"discounts": [],
				"createdAt": "2024-03-28T03:18:53.100Z",
				"updatedAt": "2024-03-28T03:18:53.100Z",
				"__v": 0
			}], 200, 'get all users successfully')
		}
	})
	@tokenErrorResponse
	@permissionErrorResponse
	@UseGuards(new RoleGuard(['admin']))
	@UseGuards(AuthGuard)
	async getAllUsers() {
		return await this.userService.getAllUsers();
	}

	@tokenErrorResponse
	@Get('/current-user')
	@UseGuards(AuthGuard)
	async getCurrentUser(@currentUser() currentUser) {
		return await currentUser;
	}

	@tokenErrorResponse
	@permissionErrorResponse
	@invalidIdResponse
	@ApiResponse({ status: 404, description: "User not found", schema: { example: new responseError(404, "User not found") } })
	@ApiResponse({
		status: 200, description: "get user by id successfully", schema: {
			example: new responseData({
				"_id": "",
				"username": "",
				"email": "",
				"password": "",
				"role": "user",
				"avatar": {
					"link": "",
					"publicId": "",
					"_id": ""
				},
				"tables": [],
				"discounts": [],
				"createdAt": "",
				"updatedAt": "",
				"__v": 0
			}, 200, "get user by id successfully")
		}
	})
	@Get(':id')
	@UseGuards(new RoleGuard(['admin']))
	@UseGuards(AuthGuard)
	async getUserById(@Param('id') id: string) {
		return await this.userService.getUserById(id);
	}

	@invalidIdResponse
	@tokenErrorResponse
	@ApiResponse({ status: 404, description: "User not found", schema: { example: new responseError(404, "User not found") } })
	@ApiResponse({ status: 200, description: "update user successfully", schema: { example: new responseData(null, 200, 'update user successfully') } })
	@Put(':id')
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor('avatar'))
	async updateUser(
		@Param('id') id: string,
		@Body() updateUserDto: updateUserDto
	) {
		return this.userService.updateUser(id, updateUserDto);
	}

	@tokenErrorResponse
	@ApiResponse({ status: 200, description: "change avatar successfully", schema: { example: new responseData(null, 200, 'change avatar successfully') } })
	@ApiResponse({ status: 404, description: "User not found", schema: { example: new responseError(404, "User not found") } })
	@Post('/change-avatar')
	@UseGuards(AuthGuard)
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@UseInterceptors(FileInterceptor('file'))
	async uploadAvatar(
		@UploadedFile() avatar: Express.Multer.File,
		@Request() req
	) {
		const uploadFile = await this.cloudinaryService.uploadAvatar(avatar);
		return await this.userService.changeAvatar(req.currentUser._id, uploadFile.url, uploadFile.public_id);
	}


}
