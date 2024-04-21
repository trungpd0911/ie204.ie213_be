import { Module } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { DiscountsController } from './discounts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Discount, DiscountSchema } from 'src/schemas/Discount.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Discount.name,
				schema: DiscountSchema,
			},
		]),
	],
	controllers: [DiscountsController],
	providers: [DiscountsService],
})
export class DiscountsModule {}
