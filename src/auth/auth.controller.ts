import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LoginUserDto } from './dto/loginUser.dto';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { Request } from 'express';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('/register')
	async register(@Body() registerUser: RegisterUserDto) {
		return this.authService.register(registerUser);
	}

	@Post('/login')
	async login(@Body() loginUser: LoginUserDto) {
		return this.authService.login(loginUser);
	}
}
