import { Module } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { DishesController } from './dishes.controller';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Dish, DishSchema } from 'src/schemas/Dish.schema';
import { NestjsFormDataModule, FormDataRequest } from 'nestjs-form-data';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../global/http-exception.filter';

@Module({
	imports: [
		MulterModule.register({
			// dest: '/dish-files-upload',
		}),
		CloudinaryModule,
		NestjsFormDataModule,
		MongooseModule.forFeature([
			{
				name: Dish.name,
				schema: DishSchema,
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
