import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Menu {
	@Prop({ required: true })
	menuName: string;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
