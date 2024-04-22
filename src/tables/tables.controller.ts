import {
	Body,
	Controller,
	Get,
	Post,
	Request,
	UseGuards,
} from '@nestjs/common';
import { CreateTableDto } from './dto/CreateTable.dto';
import { TablesService } from './tables.service';
import { RoleGuard } from '../guards/role.guard';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CustomSuccessfulApiResponse } from '../global/api-responses';

@Controller('tables')
@ApiTags('Tables')
export class TablesController {
	constructor(private tablesService: TablesService) {}

	@CustomSuccessfulApiResponse('Create table successfully', 201, null)
	@ApiBearerAuth()
	@UseGuards(new RoleGuard(['admin']))
	@UseGuards(AuthGuard)
	@Post('/')
	async createTable(@Body() createTableDto: CreateTableDto) {
		return this.tablesService.createTable(createTableDto);
	}

	@CustomSuccessfulApiResponse('Get all tables successfully', 200, [
		{
			_id: 'id',
			tableFloor: 'Tầng 1',
			tablePosition: 'A1',
			tableStatus: 'Available',
			users: [],
			createdAt: '',
			updatedAt: '',
			__v: 0,
		},
	])
	@Get('/all')
	async getAllTables() {
		return this.tablesService.getAllTables();
	}

	@CustomSuccessfulApiResponse('Get user table successfully', 200, [
		{
			_id: 'id',
			tableFloor: 'Tầng 1',
			tablePosition: 'A1',
			tableStatus: 'Available',
			users: [],
			createdAt: '',
			updatedAt: '',
			__v: 0,
		},
	])
	@ApiBearerAuth()
	@UseGuards(AuthGuard)
	@Get('/user')
	async getUserTable(@Request() req) {
		const userId = req.currentUser._id;
		return this.tablesService.getUserTable(userId);
	}
}
