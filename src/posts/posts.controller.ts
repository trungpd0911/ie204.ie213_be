import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { responseData, responseError } from 'src/global/globalClass';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
	constructor(private postsService: PostsService) { }

	@ApiResponse({
		status: 200, description: 'Get all post successfully', schema: {
			example: new responseData([
				{
					_id: '60f9b5b1f4b4c9d8f8f8f8f8',
					title: 'Post title',
					header: 'Post header',
					description: 'Post description',
					keywords: ['keywords[]'],
					content: 'Post content',
					createdAt: '2021-07-23T07:30:09.000Z',
					updatedAt: '2021-07-23T07:30:09.000Z'
				}
			], 200, 'Get all post successfully')
		}
	})
	@ApiResponse({
		status: 500, description: 'Internal server error', schema: {
			example: new responseError(500, 'Internal server error')
		}
	})
	@Get('/')
	async getAllPosts() {
		return await this.postsService.getAllPosts();
	}

	@ApiResponse({
		status: 200, description: 'Get post by id successfully', schema: {
			example: new responseData(
				{
					_id: '60f9b5b1f4b4c9d8f8f8f8f8',
					title: 'Post title',
					header: 'Post header',
					description: 'Post description',
					keywords: ['keywords[]'],
					content: 'Post content',
					createdAt: '2021-07-23T07:30:09.000Z',
					updatedAt: '2021-07-23T07:30:09.000Z'
				}, 200, 'Get post by id successfully')
		}
	})
	@ApiResponse({
		status: 404, description: 'Post not found', schema: {
			example: new responseError(404, 'Post not found')
		}
	})
	@ApiResponse({
		status: 400, description: 'Invalid id', schema: {
			example: new responseError(400, 'Invalid id')
		}
	})
	@ApiResponse({
		status: 500, description: 'Internal server error', schema: {
			example: new responseError(500, 'Internal server error')
		}
	})
	@Get('/:id')
	async getPostById(@Param('id') id: string) {
		return await this.postsService.getPostById(id);
	}

	@ApiResponse({
		status: 201, description: 'Create post successfully', schema: {
			example: new responseData(null, 201, 'Create post successfully')
		}
	})
	@ApiResponse({
		status: 400, description: 'Title already exist', schema: {
			example: new responseError(400, 'Title already exist')
		}
	})
	@ApiResponse({
		status: 500, description: 'Internal server error', schema: {
			example: new responseError(500, 'Internal server error')
		}
	})
	@ApiBearerAuth()
	@Post('/')
	@UseGuards(AuthGuard)
	async createPost(@Req() req, @Body() createPostDto: CreatePostDto) {
		const userId = req.currentUser._id;
		return await this.postsService.createPost(createPostDto, userId);
	}
}
