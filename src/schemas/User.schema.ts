import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Table } from "./Table.schema";
import { TableBooking } from "./TableBooking.schema";

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
    phone_number: string;

    @Prop({ default: false })
    isAdmin: boolean;

    @Prop({
        type: [{ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TableBooking' }] }]
    })
    tables: TableBooking[];
}

export const UserSchema = SchemaFactory.createForClass(User); 