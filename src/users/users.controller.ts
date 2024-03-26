import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RoleGuard } from '../guards/role.guard';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
	constructor(private userService: UsersService) { }

	@Get()
	@UseGuards(new RoleGuard(['admin']))
	@UseGuards(AuthGuard)
	async getAllUsers() {
		return await this.userService.getAllUsers();
	}
}
