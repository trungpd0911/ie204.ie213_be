import { ClassSerializerInterceptor, Controller, Get, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { get } from 'http';

@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService
    ) {
    }

    @Get()
    async getAllUsers() {
        return await this.userService.getAllUsers();
    }
}
