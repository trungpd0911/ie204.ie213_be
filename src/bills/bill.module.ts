import { Module } from '@nestjs/common';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Bill, BillSchema } from '../schemas/Bill.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Bill.name,
        schema: BillSchema,
      }
    ])
  ],
  controllers: [BillController],
  providers: [BillService]
})
export class BillModule { }
