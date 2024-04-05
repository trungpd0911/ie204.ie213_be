import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './User.schema';

@Schema({ timestamps: true })
export class Post {
	@Prop({ required: true, type: String, unique: true })
	title: string;

	@Prop({ required: true, type: String })
	header: string;

	@Prop({ required: true, type: String })
	description: string;

	@Prop({ required: true, type: [{ type: String }] })
	keywords: string[];

	@Prop({ required: true, type: String })
	content: string;

	@Prop({ required: true, type: String })
	slugName: string;

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
	authorId: User;

	@Prop({
		required: false,
		type: [
			{
				url: String,
				publicId: String,
			},
		],
	})
	blogImages: {
		url: string;
		publicId: string;
	}[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
