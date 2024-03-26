import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

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

	@Prop({ required: false, type: { link: String, id: String } })
	avatar: { link: string; id: string };

	@Prop({
		required: false, type: [
			{
				discountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Discount' },
				used: Boolean,
			}
		]
	})
	discounts: {
		discountId: { type: mongoose.Schema.Types.ObjectId; ref: 'Discount' };
		used: boolean;
	}[];
}
export const UserSchema = SchemaFactory.createForClass(User);
