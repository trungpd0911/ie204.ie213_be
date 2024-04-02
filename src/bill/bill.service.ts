import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bill } from '../schemas/Bill.schema';
import { Model } from 'mongoose';

@Injectable()
export class BillService {
    constructor(
        @InjectModel(Bill.name) private billModel: Model<Bill>,
    ) { }
}
