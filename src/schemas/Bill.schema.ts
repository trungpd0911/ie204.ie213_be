import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Discount } from './Discount.schema';
import { User } from './User.schema';

@Schema({ timestamps: true })
export class Bill {
	@Prop({ required: true })
	totalMoney: number;

	@Prop({ required: true })
	billPayed: boolean;

	@Prop({
		required: false,
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Discount',
	})
	discountId: Discount;

	@Prop({ required: true, type: Date })
	billDate: Date;

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
	userId: User;

	@Prop({
		required: true,
		type: [
			{
				dishId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish' },
				dishAmount: Number,
			},
		],
	})
	billDishes: {
		dishId: mongoose.Schema.Types.ObjectId;
		dishAmount: number;
	}[];
}

export const BillSchema = SchemaFactory.createForClass(Bill);
