import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/schemas/Post.schema';
import { CreatePostDto } from './dto/createPost.dto';
import { configSlug } from 'src/helper/slug.helper';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>
    ) { }

    async getAllPosts() {
        return await this.postModel.find().populate('authorId', 'username email');
    }

    async createPost(createPostDto: CreatePostDto) {
        const slugName = configSlug.convertToSlug(createPostDto.title);
        
        const newPost = new this.postModel({ ...createPostDto, slugName });
        return await newPost.save();
    }
}
