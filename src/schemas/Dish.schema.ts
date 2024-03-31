import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Menu } from './Menu.schema';

@Schema({ timestamps: true })
export class Dish {
	@Prop({ required: true })
	dishName: string;

	@Prop({ required: true })
	dishPrice: number;

	@Prop({ required: true })
	dishDescription: string;

	@Prop({ required: true, default: 0 })
	totalOrder: number;

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Menu' })
	menuId: Menu;

	@Prop({
		required: false,
		type: [
			{
				link: String,
				id: String,
			},
		],
	})
	dishImages: {
		link: string;
		id: string;
	}[];
}

export const DishSchema = SchemaFactory.createForClass(Dish);
