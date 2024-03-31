import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MinLength,
} from 'class-validator';

export class RegisterUserDto {
	@ApiProperty({
		example: 'admin@gmail.com',
	})
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string;

	@ApiProperty({
		example: 'bepuit',
	})
	@IsNotEmpty()
	@IsString()
	username: string;

	@ApiProperty({
		example: 'bepuit123',
	})
	@IsNotEmpty()
	@IsString()
	@MinLength(8)
	// set contains at least one letter
	@Matches(/^(?=.*[A-Za-z]).+$/, {
		message: 'Password must contain at least one letter',
	})
	password: string;
}
