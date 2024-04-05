import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Table {
	@Prop({ required: true, type: String })
	tablePosition: string;

	@Prop({ required: true, type: String })
	tableStatus: string;

	@Prop({
		required: false,
		type: [
			{
				userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
				bookingTime: Date,
			},
		],
	})
	users: {
		userId: { type: mongoose.Schema.Types.ObjectId; ref: 'User' };
		bookingTime: Date;
	}[];
}

export const TableSchema = SchemaFactory.createForClass(Table);
