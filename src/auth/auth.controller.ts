import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { LoginUserDto } from './dto/loginUser.dto';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { responseData, responseError } from '../global/globalClass';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@ApiResponse({
		status: 201,
		description: 'User registered successfully',
		schema: {
			example: new responseData(
				null,
				201,
				'User registered successfully',
			),
		},
	})
	@ApiResponse({
		status: 400,
		description: 'User already exist',
		schema: {
			example: new responseError(400, 'User already exist'),
		},
	})
	@Post('/register')
	async register(@Body() registerUser: RegisterUserDto) {
		return this.authService.register(registerUser);
	}

	@ApiResponse({
		status: 200,
		description: 'Login successfully',
		schema: {
			example: new responseData(
				{
					accessToken:
						'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjAyMmYxMWY5NmRiYWQwODAyYTRlYzEiLCJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsInRhYmxlcyI6W10sImNyZWF0ZWRBdCI6IjIwMjQtMDMtMjZUMDI6MTI6MzMuMzU4WiIsInVwZGF0ZWRBdCI6IjIwMjQtMDMtMjZUMDI6MTI6MzMuMzU4WiIsIl9fdiI6MCwiZGlzY291bnRzIjpbXSwiaWF0IjoxNzExNDY2NjA5LCJleHAiOjE3MTE1NTMwMDl9.JGRUFo-7029Q3xZIX92w2F4zTmLaOpATFB1Fjr5IfuA',
					refreshToken:
						'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjAyMmYxMWY5NmRiYWQwODAyYTRlYzEiLCJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsInRhYmxlcyI6W10sImNyZWF0ZWRBdCI6IjIwMjQtMDMtMjZUMDI6MTI6MzMuMzU4WiIsInVwZGF0ZWRBdCI6IjIwMjQtMDMtMjZUMDI6MTI6MzMuMzU4WiIsIl9fdiI6MCwiZGlzY291bnRzIjpbXSwiaWF0IjoxNzExNDY2OTM0LCJleHAiOjE3MTIwNzE3MzR9.x1P9XIl8cXcdFiXbcH6wKx7eIrrUH6J_IuZERB0Ffaa',
				},
				200,
				'Login successfully',
			),
		},
	})
	@ApiResponse({
		status: 400,
		description: 'wrong email or password',
		schema: {
			example: new responseError(400, 'wrong email or password'),
		},
	})
	@Post('/login')
	@HttpCode(200)
	async login(@Body() loginUser: LoginUserDto) {
		return this.authService.login(loginUser);
	}

	@ApiResponse({
		status: 200,
		description: 'Login successfully',
		schema: {
			example: new responseData(
				{
					accessToken:
						'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjAyMmYxMWY5NmRiYWQwODAyYTRlYzEiLCJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsInRhYmxlcyI6W10sImNyZWF0ZWRBdCI6IjIwMjQtMDMtMjZUMDI6MTI6MzMuMzU4WiIsInVwZGF0ZWRBdCI6IjIwMjQtMDMtMjZUMDI6MTI6MzMuMzU4WiIsIl9fdiI6MCwiZGlzY291bnRzIjpbXSwiaWF0IjoxNzExNDY2NjA5LCJleHAiOjE3MTE1NTMwMDl9.JGRUFo-7029Q3xZIX92w2F4zTmLaOpATFB1Fjr5IfuA',
					refreshToken:
						'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjAyMmYxMWY5NmRiYWQwODAyYTRlYzEiLCJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsInRhYmxlcyI6W10sImNyZWF0ZWRBdCI6IjIwMjQtMDMtMjZUMDI6MTI6MzMuMzU4WiIsInVwZGF0ZWRBdCI6IjIwMjQtMDMtMjZUMDI6MTI6MzMuMzU4WiIsIl9fdiI6MCwiZGlzY291bnRzIjpbXSwiaWF0IjoxNzExNDY2OTM0LCJleHAiOjE3MTIwNzE3MzR9.x1P9XIl8cXcdFiXbcH6wKx7eIrrUH6J_IuZERB0Ffaa',
				},
				200,
				'Login successfully',
			),
		},
	})
	@ApiResponse({
		status: 400,
		description: 'wrong email or password',
		schema: {
			example: new responseError(400, 'wrong email or password'),
		},
	})
	@ApiResponse({
		status: 403,
		description: "you don't have permission",
		schema: {
			example: new responseError(403, "you don't have permission"),
		},
	})
	@HttpCode(200)
	@Post('/admin/login')
	async adminLogin(@Body() loginUser: LoginUserDto) {
		return this.authService.adminLogin(loginUser);
	}
}
