import { Module } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { DishesController } from './dishes.controller';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Dish, DishSchema } from 'src/schemas/Dish.schema';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../global/http-exception.filter';
import { Comment, CommentSchema } from 'src/schemas/Comment.schema';
import { Menu, MenuSchema } from 'src/schemas/Menu.schema';

@Module({
	imports: [
		MulterModule.register(),
		CloudinaryModule,
		MongooseModule.forFeature([
			{
				name: Dish.name,
				schema: DishSchema,
			},
			{
				name: Comment.name,
				schema: CommentSchema,
			},
			{
				name: Menu.name,
				schema: MenuSchema,
			},
		]),
	],
	controllers: [DishesController],
	providers: [
		DishesService,
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
	],
})
export class DishesModule {}
