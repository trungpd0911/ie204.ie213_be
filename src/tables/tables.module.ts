import { Module } from '@nestjs/common';
import { tableGateway } from './tables.gateway';
import { TablesController } from './tables.controller';
import { TablesService } from './tables.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Table, TableSchema } from '../schemas/Table.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Table.name,
				schema: TableSchema,
			},
		]),
	],
	providers: [tableGateway, TablesService],
	controllers: [TablesController],
})
export class TablesModule {}
