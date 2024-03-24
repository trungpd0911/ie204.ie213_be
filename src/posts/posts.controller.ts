import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) {

    }

    @Get('/')
    async getAllPosts() {
        return await this.postsService.getAllPosts();
    }

    @Post('/')
    @UseGuards(JwtAuthGuard)
    async createPost(@Req() req: Request, @Body() createPostDto: CreatePostDto) {
        console.log(req.user._id);
        const userId = req.user._id;
        // return await this.postsService.createPost(createPostDto);
    }
}
