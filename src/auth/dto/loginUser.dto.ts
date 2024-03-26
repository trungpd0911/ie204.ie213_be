import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
	@ApiProperty({ example: 'admin@gmail.com' })
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string;

	@ApiProperty({ example: 'password123456' })
	@IsNotEmpty()
	@IsString()
	password: string;
}
