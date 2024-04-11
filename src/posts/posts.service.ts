import {
	HttpException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from '../schemas/Post.schema';
import { CreatePostDto } from './dto/CreatePost.dto';
import { configSlug } from '../helper/slug.helper';
import { responseData } from '../global/globalClass';

@Injectable()
export class PostsService {
	constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

	async getAllPosts() {
		try {
			const allPost = await this.postModel.find();
			// .populate('authorId', 'username');
			return new responseData(allPost, 200, 'Get all post successfully');
		} catch (error) {
			throw new InternalServerErrorException(error);
		}
	}

	async getPostById(id: string) {
		try {
			if (!Types.ObjectId.isValid(id)) {
				throw new HttpException('Invalid id', 400);
			}
			const post = await this.postModel.findById(id);
			// .populate('authorId', 'username');
			if (!post) {
				throw new HttpException('Post not found', 404);
			}
			return new responseData(post, 200, 'Get post by id successfully');
		} catch (error) {
			throw new InternalServerErrorException(error);
		}
	}

	async getPostBySlug(slug: string) {
		try {
			const postBySlug = await this.postModel.findOne({
				slugName: slug,
			});
			if (!postBySlug) {
				throw new HttpException('Post not found', 404);
			}
			return new responseData(
				postBySlug,
				200,
				'Get post by slug successfully',
			);
		} catch (error) {
			console.log(error);
			throw new InternalServerErrorException(error);
		}
	}

	async createPost(createPostDto: CreatePostDto, userId: string) {
		try {
			const newPost = new this.postModel({
				authorId: userId,
				content: createPostDto.content,
				description: createPostDto.description,
				header: createPostDto.header,
				keywords: createPostDto.keywords,
				title: createPostDto.title,
				blogImages: createPostDto.blogImages,
			});
			const slugName =
				configSlug.convertToSlug(createPostDto.title) +
				'-' +
				newPost._id +
				'.html';
			newPost.slugName = slugName;
			await newPost.save();
			return new responseData(null, 201, 'Post created successfully');
		} catch (error) {
			throw new InternalServerErrorException(error);
		}
	}

	async uploadImages(cloudImages: object, blogId: string) {
		try {
		} catch (error) {
			throw new InternalServerErrorException(error);
		}
	}
}
