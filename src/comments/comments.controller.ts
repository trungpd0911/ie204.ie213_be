import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Request,
	UseGuards,
	HttpStatus,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import ReplyCommentDto from './dto/reply-comment.dto';
import {
	CustomBadRequestApiResponse,
	CustomForbidenrrorApiResponse,
	CustomInternalServerErrorApiResponse,
	CustomNotFoundApiResponse,
	CustomSuccessfulApiResponse,
	CustomUnauthorizedApiResponse,
} from 'src/global/api-responses';
import { RoleGuard } from 'src/guards/role.guard';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
	constructor(private readonly commentsService: CommentsService) {}

	// User role
	// Swagger's decorators
	@ApiOperation({ summary: '[ADMIN, USER] Create a comment' })
	@CustomSuccessfulApiResponse(
		'Dish is created successfully111',
		HttpStatus.OK,
		{
			_id: '660fdc7b70dc7fb614ceaa4b',
			dishName: 'Tra sua do vai lin',
			dishPrice: 20000,
			dishDescription: 'Khong co gi ngon',
			totalOrder: 0,
			menuId: '66083097c11b247adbd84f2a',
			rating: 5,
			dishImages: [
				{
					link: 'http://res.cloudinary.com/ddexbqgmg/image/upload/v1712315515/bepUIT-dishImages/lmskq9koz19kmvcz2uyt.jpg',
					id: 'bepUIT-dishImages/lmskq9koz19kmvcz2uyt',
					_id: '660fdc7b70dc7fb614ceaa4c',
				},
				{
					link: 'http://res.cloudinary.com/ddexbqgmg/image/upload/v1712315515/bepUIT-dishImages/iwuxrcc5wtgzjkasl7v3.jpg',
					id: 'bepUIT-dishImages/iwuxrcc5wtgzjkasl7v3',
					_id: '660fdc7b70dc7fb614ceaa4d',
				},
			],
			slugName:
				'tra-sua-tran-chau-duong-den-nhieu-duong-den-660fdc7b70dc7fb614ceaa4b',
			createdAt: '2024-04-05T11:11:55.702Z',
			updatedAt: '2024-04-05T14:24:40.127Z',
			__v: 0,
		},
	)
	@CustomBadRequestApiResponse('Invalid user id')
	@CustomInternalServerErrorApiResponse('Internal server error')
	@CustomUnauthorizedApiResponse('Invalid token or expired')
	// Auth's decorators
	@UseGuards(new RoleGuard(['user', 'admin']))
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	// Controller's decorators
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

	// Swagger's decorators
	@ApiOperation({ summary: '[ADMIN, USER] Reply a comment' })
	@CustomSuccessfulApiResponse(
		'Dish is created successfully111',
		HttpStatus.OK,
		{
			content: 'Toi thi thay rat ngon',
			userId: '66082c2b92de5d775491d6c5',
			dishId: '660fdc7b70dc7fb614ceaa4b',
			rating: 0,
			level: 1,
			replies: [],
			_id: '66188619c324e7a02d2daa6a',
			createdAt: '2024-04-12T00:53:45.155Z',
			updatedAt: '2024-04-12T00:53:45.155Z',
			__v: 0,
		},
	)
	@CustomBadRequestApiResponse('Invalid dish id')
	@CustomInternalServerErrorApiResponse('Internal server error')
	@CustomUnauthorizedApiResponse('Invalid token or expired')
	@CustomNotFoundApiResponse('Replied comment not found')
	// Auth's decorators
	@UseGuards(new RoleGuard(['user', 'admin']))
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	// Controller's decorators
	@Post('/reply')
	async replyComment(
		@Request() req,
		@Body() replyCommentDto: ReplyCommentDto,
	) {
		const userId = req.currentUser._id;
		return await this.commentsService.replyComment(replyCommentDto, userId);
	}

	// Swagger's decorators
	@ApiOperation({ summary: '[ADMIN, USER] Remove a comment' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'The ID of the comment want to delete',
	})
	@CustomSuccessfulApiResponse(
		'Dish is removed successfully111',
		HttpStatus.OK,
		null,
	)
	@CustomBadRequestApiResponse('Invalid comment id')
	@CustomInternalServerErrorApiResponse('Failed to remove comment')
	@CustomUnauthorizedApiResponse('Invalid token or expired')
	@CustomNotFoundApiResponse('Comment not found')
	@CustomForbidenrrorApiResponse('You are not allowed to remove this comment')
	// Auth's decorators
	@UseGuards(new RoleGuard(['user', 'admin']))
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	// Controller's decorators
	@Delete(':id')
	async removeComment(@Request() req, @Param('id') id: string) {
		const userId = req.currentUser._id;
		return await this.commentsService.removeComment(id, userId);
	}

	// No auth

	// Swagger's decorators
	@ApiOperation({ summary: '[NO AUTH] Get a comment by id' })
	@ApiParam({
		name: 'id',
		required: true,
		description: 'The ID of the comment want to get',
	})
	@CustomSuccessfulApiResponse(
		'Get comment by id succesfully',
		HttpStatus.OK,
		{
			_id: '66180b351effbd8d0ebdae56',
			content: 'Tra sua rat ngon',
			userId: '66082c2b92de5d775491d6c5',
			dishId: '660fdc7b70dc7fb614ceaa4b',
			rating: 1,
			level: 0,
			replies: [
				{
					_id: '66180b511effbd8d0ebdae5b',
					content: 'Eo ngon dau',
					userId: '66082c2b92de5d775491d6c5',
					dishId: '660fdc7b70dc7fb614ceaa4b',
					rating: 0,
					level: 1,
					replies: [],
					createdAt: '2024-04-11T16:09:53.530Z',
					updatedAt: '2024-04-11T16:09:53.530Z',
					__v: 0,
				},
				{
					_id: '66180eb80c5544c6e06c1f28',
					content: 'Toi thi thay rat ngon',
					userId: '66082c2b92de5d775491d6c5',
					dishId: '660fdc7b70dc7fb614ceaa4b',
					rating: 0,
					level: 1,
					replies: [],
					createdAt: '2024-04-11T16:24:24.918Z',
					updatedAt: '2024-04-11T16:24:24.918Z',
					__v: 0,
				},
			],
			createdAt: '2024-04-11T16:09:25.902Z',
			updatedAt: '2024-04-12T00:53:45.108Z',
			__v: 3,
		},
	)
	@CustomBadRequestApiResponse('Invalid comment id')
	@CustomInternalServerErrorApiResponse('Failed to get comment by id')
	@CustomNotFoundApiResponse('Comment not found')
	// Controller's decorators
	@Get('/id/:id')
	async getCommentById(@Param('id') id: string) {
		return this.commentsService.getCommentById(id);
	}

	// Swagger's decorators
	@ApiOperation({ summary: '[NO AUTH] Get all comments' })
	@CustomSuccessfulApiResponse(
		'Get all comments successfully',
		HttpStatus.OK,
		[
			{
				_id: '66180b351effbd8d0ebdae56',
				content: 'Tra sua rat ngon',
				userId: '66082c2b92de5d775491d6c5',
				dishId: '660fdc7b70dc7fb614ceaa4b',
				rating: 1,
				level: 0,
				replies: [
					{
						_id: '66180b511effbd8d0ebdae5b',
						content: 'Eo ngon dau',
						userId: '66082c2b92de5d775491d6c5',
						dishId: '660fdc7b70dc7fb614ceaa4b',
						rating: 0,
						level: 1,
						replies: [],
						createdAt: '2024-04-11T16:09:53.530Z',
						updatedAt: '2024-04-11T16:09:53.530Z',
						__v: 0,
					},
					{
						_id: '66180eb80c5544c6e06c1f28',
						content: 'Toi thi thay rat ngon',
						userId: '66082c2b92de5d775491d6c5',
						dishId: '660fdc7b70dc7fb614ceaa4b',
						rating: 0,
						level: 1,
						replies: [],
						createdAt: '2024-04-11T16:24:24.918Z',
						updatedAt: '2024-04-11T16:24:24.918Z',
						__v: 0,
					},
				],
				createdAt: '2024-04-11T16:09:25.902Z',
				updatedAt: '2024-04-12T00:53:45.108Z',
				__v: 3,
			},
		],
	)
	@CustomInternalServerErrorApiResponse('Failed to get all comments')
	@CustomNotFoundApiResponse('No comments exists')
	// Controller's decorators
	@Get('/')
	async getAllComments() {
		return this.commentsService.getAllComments();
	}
}
