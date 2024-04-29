import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Put,
	Req,
	Request,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RoleGuard } from '../guards/role.guard';
import { AuthGuard } from '../guards/auth.guard';
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { currentUser } from './decorators/currentUser.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { responseData, responseError } from '../global/globalClass';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import {
	CustomApiResponse,
	CustomBadRequestApiResponse,
	CustomForbidenrrorApiResponse,
	CustomNotFoundApiResponse,
	CustomSuccessfulApiResponse,
	invalidIdResponse,
	permissionErrorResponse,
	tokenErrorResponse,
} from '../global/api-responses';
import { changePasswordDto } from './dto/ChangePassword.dto';

// swagger
@ApiTags('users')
// controller
@Controller('users')
export class UsersController {
	constructor(
		private userService: UsersService,
		private cloudinaryService: CloudinaryService,
	) {}

	@ApiBearerAuth()
	@Get()
	@ApiResponse({
		status: 200,
		description: 'get all users successfully',
		schema: {
			example: new responseData(
				[
					{
						_id: '6604e19d8298d9a32762005b',
						username: 'trungphan',
						email: 'trungphan@gmail.com',
						tables: [],
						discounts: [],
						createdAt: '2024-03-28T03:18:53.100Z',
						updatedAt: '2024-03-28T03:18:53.100Z',
						__v: 0,
					},
				],
				200,
				'get all users successfully',
			),
		},
	})
	@tokenErrorResponse
	@permissionErrorResponse
	@UseGuards(new RoleGuard(['admin']))
	@UseGuards(AuthGuard)
	async getAllUsers() {
		return await this.userService.getAllUsers();
	}

	@ApiBearerAuth()
	@CustomSuccessfulApiResponse('get current user successfully', 200, {
		_id: '',
		username: 'trungphan',
		email: 'trungphan@gmail.com',
		role: 'admin',
		avatar: {
			link: 'http://res.cloudinary.com/dsygiu1h0/image/upload/v1711636668/bepUIT-avatar/hbxuxa9fskaizke9jt2l.png',
			publicId: '',
			_id: '',
		},
		tables: [],
		discounts: [],
		createdAt: '',
		updatedAt: '',
		__v: 0,
	})
	@tokenErrorResponse
	@Get('/current-user')
	@UseGuards(AuthGuard)
	async getCurrentUser(@currentUser() currentUser) {
		const user = await currentUser;
		return new responseData(user, 200, 'get current user successfully');
	}

	@ApiBearerAuth()
	@tokenErrorResponse
	@permissionErrorResponse
	@invalidIdResponse
	@ApiResponse({
		status: 404,
		description: 'User not found',
		schema: { example: new responseError(404, 'User not found') },
	})
	@ApiResponse({
		status: 200,
		description: 'get user by id successfully',
		schema: {
			example: new responseData(
				{
					_id: '',
					username: '',
					email: '',
					password: '',
					role: 'user',
					avatar: {
						link: '',
						publicId: '',
						_id: '',
					},
					tables: [],
					discounts: [],
					createdAt: '',
					updatedAt: '',
					__v: 0,
				},
				200,
				'get user by id successfully',
			),
		},
	})
	@Get(':id')
	@UseGuards(new RoleGuard(['admin']))
	@UseGuards(AuthGuard)
	async getUserById(@Param('id') id: string) {
		return await this.userService.getUserById(id);
	}

	@ApiBearerAuth()
	@invalidIdResponse
	@tokenErrorResponse
	@permissionErrorResponse
	@ApiResponse({
		status: 404,
		description: 'User not found',
		schema: { example: new responseError(404, 'User not found') },
	})
	@ApiResponse({
		status: 200,
		description: 'update user successfully',
		schema: {
			example: new responseData(null, 200, 'update user successfully'),
		},
	})
	@Put(':id')
	@UseGuards(AuthGuard)
	async updateUser(
		@Request() req,
		@Param('id') id: string,
		@Body() updateUserDto: UpdateUserDto,
	) {
		const userId = req.currentUser._id;
		return this.userService.updateUser(userId, id, updateUserDto);
	}

	@ApiBearerAuth()
	@tokenErrorResponse
	@ApiResponse({
		status: 200,
		description: 'change avatar successfully',
		schema: {
			example: new responseData(null, 200, 'change avatar successfully'),
		},
	})
	@ApiResponse({
		status: 404,
		description: 'User not found',
		schema: { example: new responseError(404, 'User not found') },
	})
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
	@Post('/change-avatar')
	@UseGuards(AuthGuard)
	@UseInterceptors(FileInterceptor('file'))
	async uploadAvatar(
		@UploadedFile() avatar: Express.Multer.File,
		@Request() req,
	) {
		const uploadFile = await this.cloudinaryService.uploadAvatar(avatar);
		return await this.userService.changeAvatar(
			req.currentUser._id,
			uploadFile.url,
			uploadFile.public_id,
		);
	}

	@ApiBearerAuth()
	@CustomSuccessfulApiResponse('change password successfully', 200, null)
	@tokenErrorResponse
	@CustomBadRequestApiResponse('wrong password')
	@CustomForbidenrrorApiResponse(
		'Password must contain at least 8 characters and at least 1 letter',
	)
	@UseGuards(AuthGuard)
	@Post('/change-password')
	async changePassword(
		@Request() req,
		@Body() changePasswordDto: changePasswordDto,
	) {
		return await this.userService.changePassword(
			req.currentUser._id,
			changePasswordDto.oldPassword,
			changePasswordDto.newPassword,
		);
	}

	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				email: {
					type: 'string',
				},
			},
		},
	})
	@CustomSuccessfulApiResponse(
		'new password has been sent to your email',
		200,
		null,
	)
	@CustomNotFoundApiResponse('User not found')
	@Post('/forgot-password')
	async forgotPassword(@Body('email') email: string) {
		return await this.userService.forgotPassword(email);
	}
}
