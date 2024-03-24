import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "./User.schema";
import { Table } from "./Table.schema";

@Schema({ timestamps: true })
export class TableBooking {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: User;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Table' })
    tableId: Table;

    @Prop({ required: true, type: Date })
    bookingTime: Date;
}

export const TableBookingSchema = SchemaFactory.createForClass(TableBooking);