import { Module } from '@nestjs/common';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Bill, BillSchema } from '../schemas/Bill.schema';
import { Dish, DishSchema } from '../schemas/Dish.schema';
import { Discount, DiscountSchema } from '../schemas/Discount.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Bill.name,
				schema: BillSchema,
			},
			{
				name: Dish.name,
				schema: DishSchema,
			},

			{
				name: Discount.name,
				schema: DiscountSchema,
			},
		]),
	],
	controllers: [BillController],
	providers: [BillService],
})
export class BillModule {}
