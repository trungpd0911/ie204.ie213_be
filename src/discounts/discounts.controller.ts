import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@Controller('discounts')
export class DiscountsController {
	constructor(private readonly discountsService: DiscountsService) {}

	@Post()
	createDiscount(@Body() createDiscountDto: CreateDiscountDto) {}

	@Get()
	getAllDiscounts() {
		return this.discountsService.findAll();
	}

	@Get(':id')
	getDiscountById(@Param('id') id: string) {}

	@Delete(':id')
	remove(@Param('id') id: string) {}
}
