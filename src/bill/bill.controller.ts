import { Controller, Delete, Get, Param, Post, Query, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BillService } from './bill.service';

@ApiTags('bill')
@Controller('bill')
export class BillController {
    constructor(
        private billService: BillService
    ) { }

    // admin
    @Get('/all')
    async getAllBills() {
        return "all bills";
    }

    @Get('/all/username/:username')
    async getAllBillsByUsername(
        @Param('username') username: string
    ) {
        return "all bills by username";
    }

    @Get('/all/filter')
    async filterBills(
        @Query('username') username: string,
        @Query('fromDay') fromDay: string,
        @Query('toDay') toDay: string,
        @Query('billPayed') billPayed: string
    ) {
        return "filter bills";
    }

    // admin/owner user 

    // owner user
    @Get('/cart')
    async getDishesInCArt(
        @Request() req
    ) {
        return "get dishes in cart";
    }

    @Delete('/cart/reset')
    async resetCart() {
        return "reset cart"
    }

    @Post('/cart/add')
    async addDishToCart(
        @Request() req
    ) {
        return "add dish to cart"
    }

    @Post('/cart/remove')
    async removeDishFromCart(
        @Request() req
    ) {
        return "remove dish from cart"
    }
}
