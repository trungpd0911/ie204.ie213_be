import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Table {
    @Prop({ required: true, type: String })
    tablePosition: string;

    @Prop({ required: true, type: String })
    tableStatus: string;
}

export const TableSchema = SchemaFactory.createForClass(Table);