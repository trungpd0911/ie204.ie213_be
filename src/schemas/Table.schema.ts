import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Table {
	@Prop({ required: true, type: String })
	tableFloor: string;

	@Prop({ required: true, type: String })
	tablePosition: string;

	@Prop({ required: true, type: String })
	tableStatus: string;

	@Prop({
		required: false,
		type: {
			userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
			username: String,
			bookingTime: Date,
		},
	})
	user: {
		userId: { type: mongoose.Schema.Types.ObjectId; ref: 'User' };
		username: string;
		bookingTime: Date;
	};
}

export const TableSchema = SchemaFactory.createForClass(Table);
