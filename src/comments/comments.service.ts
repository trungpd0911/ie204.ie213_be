import {
	BadRequestException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { responseData } from 'src/global/globalClass';
import { Comment } from 'src/schemas/Comment.schema';
import { Dish } from 'src/schemas/Dish.schema';
import ReplyCommentDto from './dto/reply-comment.dto';

@Injectable()
export class CommentsService {
	constructor(
		@InjectModel(Comment.name) private commentModel: Model<Comment>,
		@InjectModel(Dish.name) private dishModel: Model<Dish>,
	) {}

	async createComment(createCommentDto: CreateCommentDto, userId: string) {
		// Validate request
		if (!Types.ObjectId.isValid(userId)) {
			throw new BadRequestException('Invalid user id');
		}

		const { dishId } = createCommentDto;
		if (dishId == null || !Types.ObjectId.isValid(dishId)) {
			throw new BadRequestException('Invalid dish id');
		}

		const dish = await this.dishModel.findById(dishId);
		if (!dish) {
			throw new NotFoundException('Dish not found');
		}

		try {
			const comment = new this.commentModel({
				...createCommentDto,
				userId: userId,
			});

			const savedComment = await comment.save();

			return new responseData(
				savedComment,
				HttpStatus.CREATED,
				'Comment is created successfully',
			);
		} catch (e) {
			throw new InternalServerErrorException(e);
		}
	}

	async replyComment(replyCommentDto: ReplyCommentDto, userId: string) {
		// Validate request
		if (!Types.ObjectId.isValid(userId)) {
			throw new BadRequestException('Invalid user id');
		}

		const { isReplyOf } = replyCommentDto;

		if (!Types.ObjectId.isValid(isReplyOf)) {
			throw new BadRequestException('Invalid comment id');
		}

		const repliedComment = await this.commentModel.findById(isReplyOf);
		if (!repliedComment) {
			throw new NotFoundException('Replied comment not found');
		}

		try {
			const comment = new this.commentModel({
				...replyCommentDto,
				userId: userId,
				level: 1,
				dishId: repliedComment.dishId,
			});

			repliedComment.replies.push(comment._id);
			await repliedComment.save();

			const savedComment = await comment.save();

			return new responseData(
				savedComment,
				HttpStatus.CREATED,
				'Comment is replied successfully',
			);
		} catch (e) {
			throw new InternalServerErrorException(e);
		}
	}

	async getAllComments() {
		const comments = await this.commentModel
			.find({ level: 0 })
			.populate('replies');

		if (!comments || comments.length === 0) {
			throw new NotFoundException('No comments exists');
		}

		return new responseData(
			comments,
			HttpStatus.OK,
			'Get all comments successfully',
		);
	}

	async getCommentById(id: string) {
		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException('Invalid comment id');
		}

		const comment = await this.commentModel
			.findById(id)
			.populate('replies');
		if (!comment) {
			throw new NotFoundException('Comment not found');
		}

		return new responseData(
			comment,
			HttpStatus.OK,
			'Get comment by id successfully',
		);
	}

	async removeComment(id: string, userId: string) {
		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException('Invalid comment id');
		}

		if (!Types.ObjectId.isValid(userId)) {
			throw new BadRequestException('Invalid user id');
		}

		const comment = await this.commentModel.findOne({
			_id: id,
			userId: userId,
		});

		if (!comment) {
			throw new NotFoundException('Comment not found');
		}

		try {
			// Remove all their replies
			for (let replyId of comment.replies) {
				this.commentModel.deleteOne({ id: replyId });
			}

			await this.commentModel.deleteOne({ _id: id });
			return new responseData(
				null,
				HttpStatus.OK,
				'Dish is deleted successfully',
			);
		} catch (e) {
			throw new InternalServerErrorException('Internal server error');
		}
	}
}
