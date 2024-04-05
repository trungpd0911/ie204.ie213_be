import {
	Controller,
	HttpException,
	Post,
	Request,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import {
	permissionErrorResponse,
	tokenErrorResponse,
} from '../global/api-responses';
import { responseData, responseError } from '../global/globalClass';
import { RoleGuard } from '../guards/role.guard';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('cloudinary')
@Controller('cloudinary')
export class CloudinaryController {
	constructor(private readonly cloudinaryService: CloudinaryService) {}

	// swaggerUI
	@tokenErrorResponse
	@permissionErrorResponse
	@ApiResponse({
		status: 200,
		description: 'upload blog images successfully',
		schema: {
			example: new responseData(
				[
					{
						url: 'http://res.cloudinary.com/ddexbqgmg/image/upload/v1711943818/bepUIT-blogImages/azh9gwbwnwjdt8cvgoeo.jpg',
						public_id: 'bepUIT-blogImages/azh9gwbwnwjdt8cvgoeo',
					},
				],
				200,
				'change avatar successfully',
			),
		},
	})
	@ApiResponse({
		status: 400,
		description: 'Invalid file type',
		schema: { example: new responseError(400, 'Invalid file type') },
	})
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				blogImages: {
					type: 'array',
					items: {
						type: 'string',
						format: 'binary',
					},
				},
			},
		},
	})
	@ApiBearerAuth()
	@Post('/upload-blog-image')
	@UseGuards(new RoleGuard(['admin']))
	@UseGuards(AuthGuard)
	@UseInterceptors(FilesInterceptor('blogImages'))
	async uploadBlogImage(
		@UploadedFiles() blogImages: Express.Multer.File[],
		@Request() req,
	) {
		// check if type is .png, .jpg, .jpeg, .gif, .webp, .svg
		const exts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];
		blogImages.forEach((image) => {
			const ext = image.originalname.split('.').pop();
			console.log(ext);

			if (!exts.includes(ext)) {
				throw new HttpException('Invalid file type', 400);
			}
		});
		const responses =
			await this.cloudinaryService.uploadBlogImages(blogImages);
		// take url and public_id from each images
		const images = responses.map((res) => {
			return {
				url: res.url,
				public_id: res.public_id,
			};
		});
		return new responseData(images, 200, 'upload blog images successfully');
	}
}
