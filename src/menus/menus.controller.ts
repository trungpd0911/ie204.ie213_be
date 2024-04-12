import { Controller, Get, HttpStatus } from '@nestjs/common';
import { MenusService } from './menus.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
	CustomInternalServerErrorApiResponse,
	CustomSuccessfulApiResponse,
	serverErrorResponse,
} from 'src/global/api-responses';
import { responseData } from 'src/global/globalClass';

@ApiTags('menus')
@Controller('/menus')
@serverErrorResponse
export class MenusController {
	constructor(private readonly menusService: MenusService) {}

	@ApiOperation({ summary: '[NO AUTH] Get all  menus' })
	@CustomSuccessfulApiResponse('Get all menus successfully', HttpStatus.OK, [
		{
			_id: '6608301dc11b247adbd84f28',
			menuName: 'Thực đơn chính',
		},
		{
			_id: '66083088c11b247adbd84f29',
			menuName: 'Tráng miệng',
		},
		{
			_id: '66083097c11b247adbd84f2a',
			menuName: 'Thức uống',
		},
	])
	@CustomInternalServerErrorApiResponse('Internal server error')
	@Get('/')
	getAllMenus() {
		return this.menusService.getAllMenus();
	}
}
