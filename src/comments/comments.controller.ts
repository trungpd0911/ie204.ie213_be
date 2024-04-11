import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Request,
	UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import ReplyCommentDto from './dto/reply-comment.dto';

@Controller('comments')
export class CommentsController {
	constructor(private readonly commentsService: CommentsService) {}

	// User role
	@UseGuards(AuthGuard)
	@Post('/new')
	async createComment(
		@Request() req,
		@Body() createCommentDto: CreateCommentDto,
	) {
		const userId = req.currentUser._id;
		return await this.commentsService.createComment(
			createCommentDto,
			userId,
		);
	}

	@UseGuards(AuthGuard)
	@Post('/reply')
	async replyComment(
		@Request() req,
		@Body() replyCommentDto: ReplyCommentDto,
	) {
		const userId = req.currentUser._id;
		return await this.commentsService.replyComment(replyCommentDto, userId);
	}

	@UseGuards(AuthGuard)
	@Delete(':id')
	async removeComment(@Request() req, @Param('id') id: string) {
		const userId = req.currentUser._id;
		return await this.commentsService.removeComment(id, userId);
	}

	// No auth
	@Get('/id/:id')
	async getCommentById(@Param('id') id: string) {
		return this.commentsService.getCommentById(id);
	}

	@Get('/')
	async getAllComments() {
		return this.commentsService.getAllComments();
	}
}
