import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from '../schemas/Post.schema';
import { CreatePostDto } from './dto/createPost.dto';
import { configSlug } from '../helper/slug.helper';
import { responseData } from '../global/globalClass';

@Injectable()
export class PostsService {
	constructor(@InjectModel(Post.name) private postModel: Model<Post>) { }

	async getAllPosts() {
		try {
			const allPost = await this.postModel
				.find()
			// .populate('authorId', 'username');
			return new responseData(allPost, 200, 'Get all post successfully');
		} catch (error) {
			throw error;
		}
	}

	async getPostById(id: string) {
		try {
			if (!Types.ObjectId.isValid(id)) {
				throw new HttpException('Invalid id', 400);
			}
			const post = await this.postModel
				.findById(id)
			// .populate('authorId', 'username');
			if (!post) {
				throw new HttpException('Post not found', 404);
			}
			return new responseData(post, 200, 'Get post by id successfully');
		} catch (error) {
			throw error;
		}
	}

	async createPost(createPostDto: CreatePostDto, userId: string) {
		try {
			const checkExistTitle = await this.postModel.findOne({
				title: createPostDto.title,
			});
			if (checkExistTitle) {
				throw new HttpException('Title already exist', 400);
			}
			const slugName = configSlug.convertToSlug(createPostDto.title);
			const newPost = new this.postModel({
				...createPostDto,
				slugName,
				authorId: userId,
			});
			await newPost.save();
			return new responseData(null, 201, 'Post created successfully');
		} catch (error) {
			throw error;
		}
	}
}
