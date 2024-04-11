import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from 'src/schemas/Comment.schema';
import { Dish, DishSchema } from 'src/schemas/Dish.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Comment.name,
				schema: CommentSchema,
			},
			{
				name: Dish.name,
				schema: DishSchema,
			},
		]),
	],
	controllers: [CommentsController],
	providers: [CommentsService],
})
export class CommentsModule {}
