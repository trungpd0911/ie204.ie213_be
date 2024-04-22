import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
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
	CustomSuccessfulApiResponse,
	invalidIdResponse,
	permissionErrorResponse,
	tokenErrorResponse,
} from '../global/api-responses';
import { UpdatePostDto } from './dto/UpdatePost.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
	constructor(private postsService: PostsService) {}

	@ApiResponse({
		status: 200,
		description: 'Get all post successfully',
		schema: {
			example: new responseData(
				[
					{
						_id: 'id',
						title: 'Test',
						header: 'Test',
						description: 'Testing',
						keywords: ['test', 'Testing'],
						content: '<h2><strong>Hello from testing</strong></h2>',
						authorId: 'userId',
						blogImages: [
							{
								url: 'url',
								publicId: 'publicId',
								_id: 'id of image',
							},
						],
						thumbnailImage: 'url',
						slugName: 'test-6610be1d8aedf27056a8f75f',
						createdAt: '2024-04-06T03:14:37.678Z',
						updatedAt: '2024-04-06T03:14:37.678Z',
						__v: 0,
					},
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
					_id: 'id',
					title: 'Test',
					header: 'Test',
					description: 'Testing',
					keywords: ['test', 'Testing'],
					content: '<h2><strong>Hello from testing</strong></h2>',
					authorId: 'userId',
					blogImages: [
						{
							url: 'url',
							publicId: 'publicId',
							_id: 'id of image',
						},
					],
					thumbnailImage: 'url',
					slugName: 'test-6610be1d8aedf27056a8f75f',
					createdAt: '2024-04-06T03:14:37.678Z',
					updatedAt: '2024-04-06T03:14:37.678Z',
					__v: 0,
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
					_id: 'id',
					title: 'Test',
					header: 'Test',
					description: 'Testing',
					keywords: ['test', 'Testing'],
					content: '<h2><strong>Hello from testing</strong></h2>',
					authorId: 'userId',
					blogImages: [
						{
							url: 'url',
							publicId: 'publicId',
							_id: 'id of image',
						},
					],
					thumbnailImage: 'url',
					slugName: 'test-6610be1d8aedf27056a8f75f',
					createdAt: '2024-04-06T03:14:37.678Z',
					updatedAt: '2024-04-06T03:14:37.678Z',
					__v: 0,
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
	@ApiBearerAuth()
	@UseGuards(new RoleGuard(['admin']))
	@UseGuards(AuthGuard)
	async createPost(@Request() req, @Body() createPostDto: CreatePostDto) {
		const userId = req.currentUser._id;
		return await this.postsService.createPost(createPostDto, userId);
	}

	@tokenErrorResponse
	@permissionErrorResponse
	@CustomSuccessfulApiResponse('Update post successfully', 200, null)
	@invalidIdResponse
	@ApiBearerAuth()
	@UseGuards(new RoleGuard(['admin']))
	@UseGuards(AuthGuard)
	@Put('/:id')
	async updatePost(
		@Param('id') id: string,
		@Body() updatePostDto: UpdatePostDto,
	) {
		return await this.postsService.updatePost(id, updatePostDto);
	}

	@tokenErrorResponse
	@permissionErrorResponse
	@CustomSuccessfulApiResponse('Delete post successfully', 200, null)
	@invalidIdResponse
	@ApiBearerAuth()
	@UseGuards(new RoleGuard(['admin']))
	@UseGuards(AuthGuard)
	@Delete('/:id')
	async deletePost(@Param('id') id: string) {
		return await this.postsService.deletePost(id);
	}
}
