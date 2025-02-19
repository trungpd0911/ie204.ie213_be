import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Discount } from './Discount.schema';

@Schema({ timestamps: true })
export class User {
	@Prop({ required: true })
	username: string;

	@Prop({ required: true, unique: true })
	email: string;

	@Prop({ required: true })
	password: string;

	@Prop({})
	gender: string;

	@Prop({})
	address: string;

	@Prop({})
	phoneNumber: string;

	@Prop({ default: 'user' })
	role: string;

	@Prop({
		required: false,
		type: [
			{
				tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
				bookingTime: Date,
			},
		],
	})
	tables: {
		tableId: { type: mongoose.Schema.Types.ObjectId; ref: 'Table' };
		bookingTime: Date;
	}[];

	@Prop({
		type: { link: String, publicId: String },
		default: {
			link: 'https://res.cloudinary.com/dsygiu1h0/image/upload/v1711611594/default-avatar.webp',
			publicId: '',
		},
	})
	avatar: { link: string; publicId: string };

	@Prop({
		required: true,
		type: [
			{
				discountId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Discount',
				},
				used: Boolean,
			},
		],
		default: [],
	})
	discounts: {
		discountId: Discount;
		used: boolean;
	}[];
}
export const UserSchema = SchemaFactory.createForClass(User);
