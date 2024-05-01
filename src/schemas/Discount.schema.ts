import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Discount {
	@Prop({ required: true })
	discountName: string;

	@Prop({ required: true })
	discountCode: string;

	@Prop({ required: true, min: 0, max: 100 })
	discountPercent: number;

	@Prop({ required: true })
	discountDescription: string;

	@Prop({ required: true })
	startDay: Date;

	@Prop({ required: true })
	endDay: Date;

	@Prop({
		required: false,
		type: [
			{
				userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
				used: Boolean,
			},
		],
	})
	users: {
		userId: { type: mongoose.Schema.Types.ObjectId; ref: 'User' };
		used: boolean;
	}[];
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);
