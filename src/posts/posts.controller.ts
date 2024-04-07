import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Req,
	Request,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/CreatePost.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { responseData, responseError } from '../global/globalClass';
import { RoleGuard } from '../guards/role.guard';
import {
	invalidIdResponse,
	permissionErrorResponse,
	serverErrorResponse,
	tokenErrorResponse,
} from '../global/api-responses';

@ApiTags('posts')
@Controller('posts')
@serverErrorResponse
export class PostsController {
	constructor(private postsService: PostsService) { }

	@ApiResponse({
		status: 200,
		description: 'Get all post successfully',
		schema: {
			example: new responseData(
				[
					{
						"_id": "id",
						"title": "Test",
						"header": "Test",
						"description": "Testing",
						"keywords": [
							"test",
							"Testing"
						],
						"content": "<h2><strong>Hello from testing</strong></h2>",
						"authorId": "userId",
						"blogImages": [
							{
								"url": "url",
								"publicId": "publicId",
								"_id": "id of image"
							}
						],
						"slugName": "test-6610be1d8aedf27056a8f75f",
						"createdAt": "2024-04-06T03:14:37.678Z",
						"updatedAt": "2024-04-06T03:14:37.678Z",
						"__v": 0
					}
				],
				200,
				'Get all post successfully',
			),
		},
	})
	@Get('/')
	async getAllPosts() {
		return await this.postsService.getAllPosts();
	}

	@ApiResponse({
		status: 200,
		description: 'Get post by id successfully',
		schema: {
			example: new responseData(
				{
					"_id": "id",
					"title": "Test",
					"header": "Test",
					"description": "Testing",
					"keywords": [
						"test",
						"Testing"
					],
					"content": "<h2><strong>Hello from testing</strong></h2>",
					"authorId": "userId",
					"blogImages": [
						{
							"url": "url",
							"publicId": "publicId",
							"_id": "id of image"
						}
					],
					"slugName": "test-6610be1d8aedf27056a8f75f",
					"createdAt": "2024-04-06T03:14:37.678Z",
					"updatedAt": "2024-04-06T03:14:37.678Z",
					"__v": 0
				},
				200,
				'Get post by id successfully',
			),
		},
	})
	@ApiResponse({
		status: 404,
		description: 'Post not found',
		schema: {
			example: new responseError(404, 'Post not found'),
		},
	})
	@invalidIdResponse
	@Get('/:id')
	async getPostById(@Param('id') id: string) {
		return await this.postsService.getPostById(id);
	}

	@ApiResponse({
		status: 200,
		description: 'Get post by id successfully',
		schema: {
			example: new responseData(
				{
					"_id": "id",
					"title": "Test",
					"header": "Test",
					"description": "Testing",
					"keywords": [
						"test",
						"Testing"
					],
					"content": "<h2><strong>Hello from testing</strong></h2>",
					"authorId": "userId",
					"blogImages": [
						{
							"url": "url",
							"publicId": "publicId",
							"_id": "id of image"
						}
					],
					"slugName": "test-6610be1d8aedf27056a8f75f",
					"createdAt": "2024-04-06T03:14:37.678Z",
					"updatedAt": "2024-04-06T03:14:37.678Z",
					"__v": 0
				},
				200,
				'Get post by slug successfully',
			),
		},
	})
	@ApiResponse({
		status: 404,
		description: 'Post not found',
		schema: {
			example: new responseError(404, 'Post not found'),
		},
	})
	@Get('/slug/:slugName')
	async getPostBySlug(@Param('slugName') slugName: string) {
		return await this.postsService.getPostBySlug(slugName);
	}

	@ApiResponse({
		status: 201,
		description: 'Create post successfully',
		schema: {
			example: new responseData(null, 201, 'Create post successfully'),
		},
	})
	@permissionErrorResponse
	@tokenErrorResponse
	@ApiBearerAuth()
	@Post('/')
	@UseGuards(new RoleGuard(['admin']))
	@UseGuards(AuthGuard)
	async createPost(@Request() req, @Body() createPostDto: CreatePostDto) {
		const userId = req.currentUser._id;
		return await this.postsService.createPost(createPostDto, userId);
	}
}
