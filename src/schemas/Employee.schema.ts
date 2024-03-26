import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Employee {
	@Prop({ required: true, type: String })
	employeeName: string;

	@Prop({ required: true, type: String })
	employeePossition: string;

	@Prop({ required: true, type: String })
	staffCode: string;

	@Prop({ required: true, type: Date })
	startWorkingDay: Date;

	@Prop({ required: true, type: Number })
	salary: Number;

	@Prop({ required: true, type: String })
	workShift: string;

	@Prop({ required: true, type: String })
	phoneNumber: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
