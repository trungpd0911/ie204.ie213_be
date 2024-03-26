import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	ParseUUIDPipe,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('posts')
export class PostsController {
	constructor(private postsService: PostsService) {}

	@Get('/')
	async getAllPosts() {
		return await this.postsService.getAllPosts();
	}

	@Get('/:id')
	async getPostById(@Param('id') id: string) {
		id = id.toString();
		return await this.postsService.getPostById(id);
	}

	@Post('/')
	@UseGuards(AuthGuard)
	async createPost(@Req() req, @Body() createPostDto: CreatePostDto) {
		const userId = req.currentUser._id;
		return await this.postsService.createPost(createPostDto, userId);
	}
}
