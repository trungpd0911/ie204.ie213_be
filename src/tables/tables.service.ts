import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Table } from '../schemas/Table.schema';
import { Model, Types } from 'mongoose';
import { CreateTableDto } from './dto/CreateTable.dto';
import { responseData, responseError } from '../global/globalClass';
import { UsersService } from '../users/users.service';

@Injectable()
export class TablesService {
	constructor(
		@InjectModel(Table.name) private tableModel: Model<Table>,
		private usersService: UsersService,
	) {}

	async createTable(createTableDto: CreateTableDto) {
		try {
			const createdTable = new this.tableModel(createTableDto);
			await createdTable.save();
			return new responseData(null, 201, 'Create table successfully');
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	async getAllTables() {
		try {
			const allTables = await this.tableModel.find().exec();
			return new responseData(
				allTables,
				200,
				'Get all tables successfully',
			);
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	async getUserTable(userId: string) {
		try {
			const userTable = await this.tableModel
				.find({ users: userId })
				.exec();
			return new responseData(
				userTable,
				200,
				'Get user table successfully',
			);
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	async bookTable(tableId: string, bookingTime: Date, userId: string) {
		if (
			!Types.ObjectId.isValid(tableId) ||
			!Types.ObjectId.isValid(userId)
		) {
			return {
				toClient: {
					message: 'Invalid tableId or userId',
				},
				broadcast: null,
			};
		}

		const table = await this.tableModel.findById(tableId);
		if (!table) {
			return {
				toClient: {
					message: 'Table not found',
				},
				broadcast: null,
			};
		}
		if (table.user) {
			return {
				toClient: {
					message: 'Table is already booked',
				},
				broadcast: null,
			};
		}
		await this.tableModel.findByIdAndUpdate(tableId, {
			tableStatus: 'Occupied',
			user: {
				userId: userId,
				bookingTime: bookingTime,
			},
		});
		return {
			toClient: {
				message: 'Book table successfully',
				tableId: tableId,
			},
			broadcast: {
				message: 'Book table successfully',
				tableId: tableId,
			},
		};
	}

	async cancelTable(tableId: string, userId: string) {
		if (
			!Types.ObjectId.isValid(tableId) ||
			!Types.ObjectId.isValid(userId)
		) {
			return {
				toClient: {
					message: 'Invalid tableId or userId',
				},
				broadcast: null,
			};
		}

		const table = await this.tableModel.findById(tableId);
		if (!table) {
			return {
				toClient: {
					message: 'Table not found',
				},
				broadcast: null,
			};
		}

		if (!table.user) {
			return {
				toClient: {
					message: 'Table is already available',
				},
				broadcast: null,
			};
		}

		if (table.user.userId.toString() !== userId) {
			return {
				toClient: {
					message: "you don't have permission to cancel this table",
				},
				broadcast: null,
			};
		}

		await this.tableModel.findByIdAndUpdate(tableId, {
			tableStatus: 'Available',
			user: null,
		});
		return {
			toClient: {
				message: 'Cancel table successfully',
				tableId: tableId,
			},
			broadcast: {
				message: 'Cancel table successfully',
				tableId: tableId,
			},
		};
	}
}
