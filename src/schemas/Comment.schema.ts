import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './User.schema';
import mongoose from 'mongoose';
import { Dish } from './Dish.schema';

@Schema({ timestamps: true })
export class Comment {
	@Prop({ required: true })
	content: string;

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
	userId: User;

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Dish' })
	dishId: Dish;

	@Prop({ default: 0, min: 0, max: 5 })
	rating: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
